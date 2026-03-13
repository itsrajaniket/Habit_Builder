import { useState } from "react";
import { supabase } from "../lib/supabase";

async function callEdgeFunction(name, body, accessToken) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const res = await fetch(`${supabaseUrl}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "(unreadable)");
    throw new Error(`${name} returned non-JSON (${res.status}): ${text}`);
  }

  if (!res.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Edge function ${name} failed (${res.status})`,
    );
  }

  return data;
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async (plan, user) => {
    setLoading(true);
    setError(null);

    try {
      // Get session ONCE here — before any Razorpay modal opens
      // We never call getSession() again inside the handler to avoid the auth lock
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session?.access_token) {
        throw new Error("Not authenticated. Please log out and log back in.");
      }

      // Store token in a plain variable — no Supabase calls after this
      const accessToken = session.access_token;

      return await runPayment(plan, user, accessToken);
    } catch (err) {
      console.error("[Payment] error:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const runPayment = (plan, user, accessToken) => {
    return new Promise(async (resolve, reject) => {
      // Create order
      let order;
      try {
        order = await callEdgeFunction(
          "create-order",
          { plan, user_id: user.id },
          accessToken,
        );
      } catch (err) {
        setLoading(false);
        reject(new Error("Could not create order: " + err.message));
        return;
      }

      if (!order?.id) {
        setLoading(false);
        reject(new Error("Invalid order response from server"));
        return;
      }

      if (!window.Razorpay) {
        setLoading(false);
        reject(new Error("Razorpay SDK not loaded."));
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Habit Builder",
        description:
          plan === "yearly" ? "Pro Plan — Yearly" : "Pro Plan — Monthly",
        order_id: order.id,
        prefill: { email: user.email },
        theme: { color: "#a78bfa" },

        handler: function (response) {
          // ✅ Use plain fetch directly — NO supabase.auth calls here at all
          // This avoids the auth lock that was silently killing the verify call
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

          fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: anonKey,
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user.id,
              plan,
              amount: order.amount,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((result) => {
              if (!result?.success) {
                setLoading(false);
                reject(
                  new Error(result?.error || "Payment verification failed"),
                );
                return;
              }
              setLoading(false);
              resolve({ success: true, plan });
            })
            .catch((err) => {
              console.error("[Payment] verify fetch error:", err);
              setLoading(false);
              reject(err);
            });
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            reject(new Error("Payment dismissed"));
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error("[Payment] failed:", response.error);
        setLoading(false);
        reject(
          new Error(
            response.error?.description ||
              response.error?.reason ||
              "Payment failed",
          ),
        );
      });

      rzp.open();
    });
  };

  return { initiatePayment, loading, error };
}
