import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

// Amounts in paise (INR × 100)
// ₹11  = 1100 paise  → 1 week trial
// ₹99  = 9900 paise  → lifetime
const PLANS: Record<string, number> = {
  weekly: 1100,
  lifetime: 9900,
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay secrets");
      return new Response(
        JSON.stringify({
          error: "Server misconfiguration: Razorpay secrets not set",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Extract user_id from JWT payload
    const authHeader = req.headers.get("Authorization") ?? "";
    let userId: string | null = null;

    if (authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const payloadB64 = token.split(".")[1];
        const fixed = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(fixed));
        userId = payload.sub ?? null;
        console.log("JWT decoded — userId:", userId, "role:", payload.role);
      } catch (e) {
        console.error("JWT decode error:", e);
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: could not identify user" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { plan, user_id } = await req.json();
    console.log("plan:", plan, "user_id from body:", user_id);

    if (!plan || !PLANS[plan]) {
      return new Response(
        JSON.stringify({
          error: "Invalid plan: " + plan + ". Valid plans: weekly, lifetime",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const amount = PLANS[plan];
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        notes: { user_id: user_id || userId, plan },
      }),
    });

    if (!razorpayRes.ok) {
      const errText = await razorpayRes.text();
      console.error("Razorpay API error:", errText);
      return new Response(
        JSON.stringify({ error: "Razorpay error: " + errText }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const order = await razorpayRes.json();
    console.log(
      "✅ Order created:",
      order.id,
      "plan:",
      plan,
      "amount:",
      amount,
    );

    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-order error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error: " + err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
