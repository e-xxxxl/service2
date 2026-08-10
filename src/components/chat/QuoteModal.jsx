// components/chat/QuoteModal.jsx
import { useState } from "react";
import { X, Plus, Trash2, Calculator, Send } from "lucide-react";

export default function QuoteModal({ onClose, onSend, customerName }) {
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([{ name: "", description: "", quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems(prev => [...prev, { name: "", description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value } : item
    ));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleSend = async () => {
    if (!description.trim() || totalAmount <= 0) return;
    setLoading(true);
    try {
      await onSend?.({ description, amount: totalAmount, items });
      onClose?.();
    } catch (err) {
      console.error('Send quote error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl z-10 flex items-center justify-between p-4 border-b">
          <h3 className="text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">Send Quote</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F7F6F2]"><X className="h-5 w-5 text-[#55605A]" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-[#F7F6F2] rounded-xl p-3 text-center">
            <p className="text-[12px] text-[#9A9488]">Quote for</p>
            <p className="text-[14px] font-semibold">{customerName}</p>
          </div>

          <div>
            <label className="block text-[12px] font-semibold mb-1.5">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="e.g., Bathroom plumbing repair"
              className="w-full rounded-lg border border-[#E2E0D9] px-3 py-2.5 text-[13px]" />
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-semibold">Line Items</label>
              <button onClick={addItem} className="text-[11px] text-[#1E7A34] font-medium flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="bg-[#FAFAF8] rounded-xl p-3 border border-[#E2E0D9] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#9A9488] font-medium">Item {i + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <input type="text" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)}
                    placeholder="Item name" className="w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-[12px]" />
                  <input type="text" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                    placeholder="Description (optional)" className="w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-[12px]" />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-[#9A9488]">Qty</label>
                      <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)}
                        min="1" className="w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-[12px]" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-[#9A9488]">Unit Price (₦)</label>
                      <input type="number" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', e.target.value)}
                        min="0" className="w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-[12px]" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-[#9A9488]">Total</label>
                      <div className="w-full rounded-lg bg-[#EFEDE6] px-3 py-2 text-[12px] font-semibold">
                        ₦{(item.quantity * item.unitPrice).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#1E7A34]" />
              <span className="text-[14px] font-semibold text-[#1E7A34]">Total Amount</span>
            </div>
            <span className="text-[20px] font-bold text-[#1E7A34] font-['Space_Grotesk',sans-serif]">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4">
          <button onClick={handleSend} disabled={!description.trim() || totalAmount <= 0 || loading}
            className="w-full bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Sending...' : <><Send className="h-4 w-4" /> Send Quote</>}
          </button>
        </div>
      </div>
    </div>
  );
}