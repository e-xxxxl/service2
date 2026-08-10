// components/chat/ProviderQuoteModal.jsx
import { useState } from "react";
import { X, Calculator, Send, Wrench, Package, Receipt } from "lucide-react";

export default function ProviderQuoteModal({ onClose, onSend, customerName }) {
  const [formData, setFormData] = useState({
    serviceDescription: "",
    materials: "",
    laborCost: "",
    materialCost: "",
    additionalFees: ""
  });
  const [loading, setLoading] = useState(false);

  const total = (Number(formData.laborCost) || 0) + (Number(formData.materialCost) || 0) + (Number(formData.additionalFees) || 0);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = async () => {
    if (!formData.serviceDescription.trim() || total <= 0) return;
    setLoading(true);
    try {
      await onSend?.(formData);
      onClose?.();
    } catch (err) {
      console.error('Send quote error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl z-10 flex items-center justify-between p-5 border-b">
          <div>
            <h3 className="text-[16px] font-semibold font-['Space_Grotesk',sans-serif]">Send Quote</h3>
            <p className="text-[12px] text-[#9A9488]">To: {customerName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F7F6F2]"><X className="h-5 w-5 text-[#55605A]" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Service Description */}
          <div>
            <label className="flex items-center gap-2 text-[13px] font-semibold text-[#1E2420] mb-2">
              <Wrench className="h-4 w-4 text-[#1E7A34]" /> Service Description *
            </label>
            <textarea
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the service you'll provide..."
              className="w-full rounded-xl border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] resize-none bg-[#FAFAF8]"
            />
          </div>

          {/* Materials */}
          <div>
            <label className="flex items-center gap-2 text-[13px] font-semibold text-[#1E2420] mb-2">
              <Package className="h-4 w-4 text-[#1E7A34]" /> Materials Needed
            </label>
            <textarea
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              rows={2}
              placeholder="List materials required (optional)..."
              className="w-full rounded-xl border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] resize-none bg-[#FAFAF8]"
            />
          </div>

          {/* Cost Breakdown */}
          <div className="bg-[#F7F6F2] rounded-xl p-4 space-y-3">
            <h4 className="text-[13px] font-semibold text-[#1E2420]">Cost Breakdown</h4>
            
            <div>
              <label className="text-[12px] text-[#55605A] mb-1 block">Labor Cost (₦)</label>
              <input type="number" name="laborCost" value={formData.laborCost} onChange={handleChange}
                min="0" placeholder="0" className="w-full rounded-lg border border-[#E2E0D9] px-4 py-2.5 text-[14px] bg-white" />
            </div>
            
            <div>
              <label className="text-[12px] text-[#55605A] mb-1 block">Material Cost (₦)</label>
              <input type="number" name="materialCost" value={formData.materialCost} onChange={handleChange}
                min="0" placeholder="0" className="w-full rounded-lg border border-[#E2E0D9] px-4 py-2.5 text-[14px] bg-white" />
            </div>
            
            <div>
              <label className="text-[12px] text-[#55605A] mb-1 block">Additional Fees (₦)</label>
              <input type="number" name="additionalFees" value={formData.additionalFees} onChange={handleChange}
                min="0" placeholder="0" className="w-full rounded-lg border border-[#E2E0D9] px-4 py-2.5 text-[14px] bg-white" />
            </div>

            {/* Total */}
            <div className="border-t border-[#E2E0D9] pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#1E7A34]" />
                <span className="text-[14px] font-semibold text-[#1E7A34]">Total Amount</span>
              </div>
              <span className="text-[22px] font-bold text-[#1E7A34] font-['Space_Grotesk',sans-serif]">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#E2E0D9] text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2]">Cancel</button>
          <button onClick={handleSend} disabled={!formData.serviceDescription.trim() || total <= 0 || loading}
            className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Sending...' : <><Send className="h-4 w-4" /> Send Quote</>}
          </button>
        </div>
      </div>
    </div>
  );
}