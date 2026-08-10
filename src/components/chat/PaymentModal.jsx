// components/chat/PaymentModal.jsx
import { useState } from "react";
import { X, CreditCard, Building, Banknote, CheckCircle2 } from "lucide-react";

export default function PaymentModal({ onClose, onConfirm, amount }) {
  const [method, setMethod] = useState("bank_transfer");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm?.({ paymentMethod: method, paymentReference: reference || `PAY-${Date.now()}` });
      onClose?.();
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-[16px] font-semibold font-['Space_Grotesk',sans-serif]">Confirm Payment</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F7F6F2]"><X className="h-5 w-5 text-[#55605A]" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Amount */}
          <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-5 text-center">
            <p className="text-[13px] text-[#55605A] mb-1">Amount to Pay</p>
            <p className="text-[32px] font-bold text-[#1E7A34] font-['Space_Grotesk',sans-serif]">₦{amount?.toLocaleString()}</p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-[13px] font-semibold text-[#1E2420] mb-3 block">Payment Method</label>
            <div className="space-y-2">
              {[
                { id: "bank_transfer", label: "Bank Transfer", icon: Building },
                { id: "card", label: "Card Payment", icon: CreditCard },
                { id: "cash", label: "Cash Payment", icon: Banknote },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button key={opt.id} onClick={() => setMethod(opt.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${method === opt.id ? 'border-[#1E7A34] bg-[#1E7A34]/5' : 'border-[#E2E0D9] hover:bg-[#F7F6F2]'}`}>
                    <Icon className={`h-5 w-5 ${method === opt.id ? 'text-[#1E7A34]' : 'text-[#9A9488]'}`} />
                    <span className={`text-[14px] font-medium ${method === opt.id ? 'text-[#1E2420]' : 'text-[#55605A]'}`}>{opt.label}</span>
                    {method === opt.id && <CheckCircle2 className="h-4 w-4 text-[#1E7A34] ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference */}
          <div>
            <label className="text-[13px] font-semibold text-[#1E2420] mb-2 block">Payment Reference (Optional)</label>
            <input type="text" value={reference} onChange={e => setReference(e.target.value)}
              placeholder="e.g., Transaction ID" className="w-full rounded-xl border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] bg-[#FAFAF8]" />
          </div>
        </div>

        <div className="p-5 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#E2E0D9] text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2]">Cancel</button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Processing...' : <><CreditCard className="h-4 w-4" /> Confirm Payment</>}
          </button>
        </div>
      </div>
    </div>
  );
}