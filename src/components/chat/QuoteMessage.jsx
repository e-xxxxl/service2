// components/chat/QuoteMessage.jsx
import { Calendar, CheckCircle, XCircle, CreditCard } from "lucide-react";

export default function QuoteMessage({ message, isProvider, onAccept, onReject }) {
  const quote = message.quote;
  const booking = message.booking;

  if (message.messageType === 'booking_confirmed') {
    return (
      <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-4 max-w-[280px]">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-[#1E7A34]" />
          <span className="text-[13px] font-semibold text-[#1E7A34]">Booking Confirmed</span>
        </div>
        <p className="text-[12px] text-[#55605A]">Amount: ₦{booking?.amount?.toLocaleString()}</p>
        <p className="text-[11px] text-[#1E7A34] mt-2 font-medium">✅ Paid & Confirmed</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#1E7A34]/20 rounded-xl p-4 max-w-[300px] shadow-sm">
      {/* Quote Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase text-[#1E7A34] bg-[#1E7A34]/10 px-2 py-0.5 rounded-full">Quote</span>
        {quote?.validUntil && (
          <span className="text-[10px] text-[#9A9488] flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Valid until {new Date(quote.validUntil).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[14px] font-semibold text-[#1E2420] mb-3">{quote?.description}</p>

      {/* Items */}
      {quote?.items?.length > 0 && (
        <div className="space-y-2 mb-3">
          {quote.items.map((item, i) => (
            <div key={i} className="flex justify-between text-[12px]">
              <span className="text-[#55605A]">{item.name} x{item.quantity}</span>
              <span className="font-medium">₦{item.total?.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-[#E2E0D9] pt-2 flex justify-between">
            <span className="text-[13px] font-semibold">Total</span>
            <span className="text-[16px] font-bold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
              ₦{quote?.amount?.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Status */}
      {quote?.status === 'pending' && !isProvider && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onAccept?.(message)}
            className="flex-1 bg-[#1E7A34] text-white py-2.5 rounded-lg text-[12px] font-semibold hover:bg-[#166B2C] flex items-center justify-center gap-1.5">
            <CreditCard className="h-4 w-4" /> Book Now
          </button>
          <button onClick={() => onReject?.(message)}
            className="px-4 py-2.5 border border-[#E2E0D9] rounded-lg text-[12px] font-semibold text-[#55605A] hover:bg-[#F7F6F2]">
            Decline
          </button>
        </div>
      )}

      {quote?.status === 'accepted' && (
        <div className="flex items-center gap-2 mt-3 text-[12px] text-[#1E7A34] font-medium">
          <CheckCircle className="h-4 w-4" /> Accepted
        </div>
      )}

      {quote?.status === 'rejected' && (
        <div className="flex items-center gap-2 mt-3 text-[12px] text-red-500 font-medium">
          <XCircle className="h-4 w-4" /> Declined
        </div>
      )}
    </div>
  );
}