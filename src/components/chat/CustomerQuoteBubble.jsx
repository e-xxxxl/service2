// components/chat/CustomerQuoteBubble.jsx
import { Calendar, CheckCircle2, XCircle, CreditCard, Wrench, Package, Calculator } from "lucide-react";

export default function CustomerQuoteBubble({ message, onAccept, onReject, onPay, accepting, paying }) {
  const quote = message.quote;
  const payment = message.payment;

  // Booking confirmed
  if (message.messageType === 'payment_confirmed') {
    return (
      <div className="bg-[#1E7A34]/5 border-2 border-[#1E7A34]/30 rounded-2xl p-5 max-w-[340px] w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#1E7A34]/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-[#1E7A34]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1E7A34]">Booking Confirmed!</p>
            <p className="text-[11px] text-[#55605A]">Payment received</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-[13px]"><span className="text-[#55605A]">Amount Paid</span><span className="font-bold text-[#1E2420]">₦{payment?.amount?.toLocaleString() || quote?.totalAmount?.toLocaleString()}</span></div>
          {payment?.reference && <div className="flex justify-between text-[12px]"><span className="text-[#9A9488]">Reference</span><span className="font-medium">{payment.reference}</span></div>}
        </div>
        <p className="text-[12px] text-[#1E7A34] font-medium mt-3">✅ The provider has been notified and will begin work shortly.</p>
      </div>
    );
  }

  // Payment requested (quote accepted, awaiting payment)
  if (message.messageType === 'payment_requested') {
    return (
      <div className="bg-white border-2 border-[#F0821E]/30 rounded-2xl p-5 max-w-[340px] w-full shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#F0821E]/10 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-[#F0821E]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1E2420]">Payment Required</p>
            <p className="text-[11px] text-[#55605A]">Complete payment to confirm booking</p>
          </div>
        </div>
        <div className="bg-[#F7F6F2] rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold">Amount to Pay</span>
            <span className="text-[24px] font-bold text-[#1E2420] font-['Space_Grotesk',sans-serif]">₦{payment?.amount?.toLocaleString() || quote?.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
        <button onClick={() => onPay?.(message)} disabled={paying}
          className="w-full bg-[#F0821E] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#D5720F] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
          {paying ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><CreditCard className="h-4 w-4" /> Pay Now</>}
        </button>
        <p className="text-[11px] text-[#9A9488] text-center mt-2">Payment is processed securely on the platform</p>
      </div>
    );
  }

  // Quote display
  return (
    <div className="bg-white border-2 border-[#1E7A34]/20 rounded-2xl p-5 max-w-[360px] w-full shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#1E7A34]/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-[#1E7A34]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#1E2420]">Service Quote</p>
            {quote?.validUntil && (
              <p className="text-[11px] text-[#9A9488] flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Valid until {new Date(quote.validUntil).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {quote?.status === 'accepted' && <CheckCircle2 className="h-5 w-5 text-[#1E7A34]" />}
        {quote?.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
      </div>

      {/* Service Description */}
      {quote?.serviceDescription && (
        <div className="bg-[#F7F6F2] rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <Wrench className="h-4 w-4 text-[#1E7A34] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-[#1E2420] mb-1">Service Description</p>
              <p className="text-[13px] text-[#55605A]">{quote.serviceDescription}</p>
            </div>
          </div>
        </div>
      )}

      {/* Materials */}
      {quote?.materials && (
        <div className="bg-[#F7F6F2] rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-[#1E7A34] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-[#1E2420] mb-1">Materials</p>
              <p className="text-[13px] text-[#55605A]">{quote.materials}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-2 mb-4">
        {quote?.laborCost > 0 && (
          <div className="flex justify-between text-[13px]"><span className="text-[#55605A]">Labor Cost</span><span className="font-medium">₦{quote.laborCost.toLocaleString()}</span></div>
        )}
        {quote?.materialCost > 0 && (
          <div className="flex justify-between text-[13px]"><span className="text-[#55605A]">Material Cost</span><span className="font-medium">₦{quote.materialCost.toLocaleString()}</span></div>
        )}
        {quote?.additionalFees > 0 && (
          <div className="flex justify-between text-[13px]"><span className="text-[#55605A]">Additional Fees</span><span className="font-medium">₦{quote.additionalFees.toLocaleString()}</span></div>
        )}
      </div>

      {/* Total */}
      <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-4 mb-4 flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[#1E7A34]">Total Amount</span>
        <span className="text-[22px] font-bold text-[#1E7A34] font-['Space_Grotesk',sans-serif]">₦{quote?.totalAmount?.toLocaleString()}</span>
      </div>

      {/* Action Buttons */}
      {quote?.status === 'pending' && (
        <div className="flex gap-3">
          <button onClick={() => onAccept?.(message)} disabled={accepting}
            className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {accepting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Accept Quote'}
          </button>
          <button onClick={() => onReject?.(message)} disabled={accepting}
            className="px-5 py-3 border border-[#E2E0D9] rounded-xl text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2] transition-colors">Decline</button>
        </div>
      )}

      {quote?.status === 'accepted' && (
        <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#1E7A34]" />
          <span className="text-[13px] font-medium text-[#1E7A34]">Quote Accepted - Awaiting Payment</span>
        </div>
      )}

      {quote?.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-[13px] font-medium text-red-500">Quote Declined</span>
          </div>
          {quote?.rejectionReason && <p className="text-[12px] text-red-400 ml-7">{quote.rejectionReason}</p>}
        </div>
      )}
    </div>
  );
}