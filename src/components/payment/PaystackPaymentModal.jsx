// components/payment/PaystackPaymentModal.jsx
//
// Real payment flow: the backend already created a pending Transaction and
// initialized it with Paystack (amount fixed server-side from the accepted
// quote) before this modal ever opens. This component only opens Paystack's
// checkout for that already-initialized reference, then asks the backend to
// verify it. The frontend's "payment succeeded" callback is never trusted on
// its own - /api/payment/verify re-checks with Paystack server-side before
// anything is unlocked or credited.
import { useEffect, useState } from "react";
import { X, ShieldCheck, AlertCircle } from "lucide-react";
import { friendlyErrorMessage } from "../../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
const PAYSTACK_SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const existing = document.querySelector(`script[src="${PAYSTACK_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack")));
      return;
    }
    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(script);
  });
}

export default function PaystackPaymentModal({
  conversationId,
  messageId,
  amount,
  providerName,
  customerEmail,
  onClose,
  onSuccess,
}) {
  const [stage, setStage] = useState("confirm"); // confirm | opening | verifying | error
  const [error, setError] = useState("");

  useEffect(() => {
    loadPaystackScript().catch(() => setError("Could not load the payment provider. Check your connection and try again."));
  }, []);

  const verify = async (reference) => {
    setStage("verifying");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/payment/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "We could not confirm your payment.");

      if (data.data.status === "success") {
        onSuccess?.();
      } else {
        setError("We couldn't confirm your payment. Your account has not been charged again. If money left your account, contact support with your reference: " + reference);
        setStage("error");
      }
    } catch (err) {
      setError(friendlyErrorMessage(err) || "We couldn't confirm your payment. Please check your payment status before trying again.");
      setStage("error");
    }
  };

  const handlePay = async () => {
    setError("");
    setStage("opening");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/payment/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conversationId, messageId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to start payment");

      await loadPaystackScript();
      if (!window.PaystackPop) throw new Error("Payment provider is unavailable right now.");
      if (!PAYSTACK_PUBLIC_KEY) throw new Error("Payments are not configured yet. Please contact support.");

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: customerEmail,
        amount: Math.round(data.data.amount * 100), // kobo - display only, amount is fixed server-side
        ref: data.data.reference,
        currency: "NGN",
        callback: (response) => verify(response.reference),
        onClose: () => setStage("confirm"),
      });
      handler.openIframe();
    } catch (err) {
      setError(friendlyErrorMessage(err) || "Failed to start payment. Please try again.");
      setStage("error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-[#E2E0D9]">
          <h3 className="text-[16px] font-semibold text-[#1E2420]">Pay for this job</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F7F6F2]" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-5 text-center">
            <p className="text-[13px] text-[#55605A] mb-1">
              {providerName ? `Paying ${providerName}` : "Amount to pay"}
            </p>
            <p className="text-[32px] font-bold text-[#1E7A34]">₦{(amount || 0).toLocaleString()}</p>
          </div>

          <div className="flex items-start gap-2 text-[12.5px] text-[#55605A]">
            <ShieldCheck className="h-4 w-4 text-[#1E7A34] flex-shrink-0 mt-0.5" />
            <p>
              Paid securely through Paystack. Your provider's contact details unlock automatically
              once payment is confirmed, and the job moves to active.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-[12.5px] text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-[#E2E0D9] flex gap-3">
          <button
            onClick={onClose}
            disabled={stage === "opening" || stage === "verifying"}
            className="flex-1 py-3 rounded-xl border border-[#E2E0D9] text-[14px] font-semibold text-[#55605A] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={stage === "opening" || stage === "verifying"}
            className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {stage === "opening" || stage === "verifying" ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {stage === "verifying" ? "Confirming..." : "Opening..."}
              </>
            ) : (
              "Pay with Paystack"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
