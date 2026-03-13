import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const body = `${orderId}|${paymentId}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computed = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ── Step 1: Decode JWT and extract userId ──────────────────
    const authHeader = req.headers.get("Authorization") ?? "";
    let userIdFromJwt: string | null = null;

    if (authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const payloadB64 = token.split(".")[1];
        const fixed = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(fixed));
        userIdFromJwt = payload.sub ?? null;
      } catch (e) {
        console.error("JWT decode error:", e);
      }
    }

    if (!userIdFromJwt) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: could not identify user" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── Step 2: Parse request body ─────────────────────────────
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      plan,
      amount,
    } = await req.json();

    // ── Step 3: user_id in body must match JWT — prevents one user
    //           activating pro for a different user_id ───────────
    if (user_id && user_id !== userIdFromJwt) {
      console.error(`user_id mismatch: JWT=${userIdFromJwt} body=${user_id}`);
      return new Response(
        JSON.stringify({ error: "Unauthorized: user_id mismatch" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Always use the JWT userId as the authoritative one
    const resolvedUserId = userIdFromJwt;

    // ── Step 4: Validate required payment fields ───────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing payment fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!plan || !["weekly", "lifetime", "monthly", "yearly"].includes(plan)) {
      return new Response(JSON.stringify({ error: "Invalid plan: " + plan }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Step 5: Verify Razorpay HMAC signature ─────────────────
    const isValid = await verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      RAZORPAY_KEY_SECRET,
    );

    if (!isValid) {
      console.error(
        "Invalid Razorpay signature for payment:",
        razorpay_payment_id,
      );
      return new Response(
        JSON.stringify({ error: "Invalid payment signature" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── Step 6: Activate pro (idempotent via ON CONFLICT) ──────
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: rpcError } = await supabaseAdmin.rpc("activate_pro", {
      p_user_id: resolvedUserId,
      p_payment_id: razorpay_payment_id,
      p_order_id: razorpay_order_id,
      p_amount: amount,
      p_plan: plan,
    });

    if (rpcError) {
      console.error("activate_pro error:", rpcError);
      return new Response(
        JSON.stringify({
          error: "Failed to activate Pro: " + rpcError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      `✅ Pro activated: user=${resolvedUserId} payment=${razorpay_payment_id} plan=${plan}`,
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("verify-payment error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error: " + err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
