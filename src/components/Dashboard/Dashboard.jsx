// components/dashboard/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import {
  Search,
  MessageCircle,
  Heart,
  Bell,
  User,
  LayoutGrid,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  CheckCircle2,
  Settings,
  LogOut,
  ArrowUpRight,
  Inbox,
  Loader,
  X,
  Send,
  Shield,
  AlertTriangle,
  Menu,
  ChevronLeft,
  Flag,
  AlertCircle,
  Calculator,
  CreditCard,
  Wrench,
  Package,
  XCircle,
  Calendar,
  Phone,
  Edit,
  Save,
  Eye,
  PlayCircle,
} from "lucide-react";
import logoIcon from "../../assets/dashlogo.png";
import { useCustomerDashboard } from "../../hooks/useCustomerDashboard";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";
import { useLocations } from "../../hooks/useLocations";
import { useSocket } from "../../hooks/useSocket";
import ProviderProfileModal from "./ProviderProfileModal";
import PaystackPaymentModal from "../payment/PaystackPaymentModal";
import ContactReveal from "../payment/ContactReveal";
import SupportChat from "../support/SupportChat";
import { useAuth } from "../../context/AuthContext";

const NAV_CONFIG = [
  { id: "dashboard", label: "Home", icon: LayoutGrid },
  { id: "messages", label: "Chats", icon: MessageCircle, badgeKey: "messages" },
  { id: "favorites", label: "Saved", icon: Heart },
  {
    id: "notifications",
    label: "Alerts",
    icon: Bell,
    badgeKey: "notifications",
  },
  { id: "support", label: "Help", icon: Flag },
  { id: "profile", label: "Profile", icon: User },
];

// ========== HELPERS ==========
const formatNigerianTime = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Lagos",
    });
  } catch {
    return "";
  }
};
const formatNigerianDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 172800000) return "Yesterday";
    return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
};

function StatusTag({ children, tone = "signal" }) {
  const t = {
    signal: "bg-[#1E7A34] text-white",
    brass: "bg-[#F0821E] text-white",
    quiet: "bg-[#EFEDE6] text-[#55605A]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[3px] px-2 py-[3px] text-[10px] font-semibold tracking-wide uppercase font-['IBM_Plex_Mono',monospace] ${t[tone]}`}
    >
      {children}
    </span>
  );
}
function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-[#EAE8E1] ${className}`} />
  );
}
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#F0821E]/30 bg-[#FBE0C4]/40 px-4 py-3">
      <p className="text-[12px] md:text-[13px] text-[#7A3E0B]">{message}</p>
      <button
        onClick={onRetry}
        className="shrink-0 rounded-md border border-[#7A3E0B]/30 px-3 py-1.5 text-[11px] md:text-[12px] font-semibold text-[#7A3E0B] hover:bg-[#F0821E]/10"
      >
        Retry
      </button>
    </div>
  );
}
function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D8D5CB] bg-white px-6 py-10 text-center">
      <Icon className="h-5 w-5 text-[#9A9488]" />
      <p className="text-[13px] font-medium text-[#1E2420]">{title}</p>
      {hint && <p className="text-[12px] text-[#9A9488]">{hint}</p>}
    </div>
  );
}

// ========== PRO TICKET CARD ==========
function ProTicketCard({ pro, onMessage, onToggleFavorite, onViewProfile }) {
  const gi = () => {
    const n = pro.fullName || pro.name || pro.companyName || "P";
    return n
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase();
  };
  const dn = pro.fullName || pro.name || "Unknown Pro";
  const cn = pro.companyName && pro.companyName !== dn ? pro.companyName : null;
  const fl = () => {
    const p = [];
    if (pro.city?.trim()) p.push(pro.city.trim());
    if (pro.state?.trim()) p.push(pro.state.trim());
    if (p.length > 0) return p.join(", ");
    if (
      pro.location &&
      pro.location !== "Nigeria" &&
      pro.location !== "{,}" &&
      pro.location !== ", "
    )
      return pro.location;
    return "Location not specified";
  };
  return (
    <div className="group relative rounded-lg border border-[#E2E0D9] bg-white overflow-hidden transition-shadow hover:shadow-[0_4px_20px_-6px_rgba(30,36,32,0.15)]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F7F6F2]">
        <div className="flex items-center gap-3 min-w-0">
          {pro.profilePicture ? (
            <img
              src={pro.profilePicture}
              alt={dn}
              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E2420] text-[13px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
              {gi()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold">{dn}</p>
            {cn && <p className="text-[11px] text-[#9A9488] truncate">{cn}</p>}
            <p className="text-[12px] text-[#55605A]">
              {pro.trade || pro.serviceType || "General Service"}
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite?.(pro, !pro.isFavorited)}
          className="text-[#9A9488] hover:text-[#F0821E] flex-shrink-0"
        >
          <Heart
            className={`h-4 w-4 ${pro.isFavorited ? "fill-[#F0821E] text-[#F0821E]" : ""}`}
          />
        </button>
      </div>
      <div className="border-t border-dashed border-[#D8D5CB]" />
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between text-[12px]">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#9A9488]" />
            <span className="truncate">{fl()}</span>
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#F0821E] text-[#F0821E]" />
            {typeof pro.rating === "number" ? pro.rating.toFixed(1) : "0.0"}
          </span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span>
            {pro.jobs || 0} jobs · {pro.years || 0} yrs
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <StatusTag
            tone={pro.status?.startsWith("Available") ? "signal" : "quiet"}
          >
            {pro.status || "Available"}
          </StatusTag>
          {pro.isVerified && (
            <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#1E7A34]/10 px-2 py-[3px] text-[10px] font-semibold text-[#1E7A34]">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>
      </div>
      <div className="flex border-t border-[#E2E0D9]">
        <button
          onClick={() => onViewProfile?.(pro)}
          className="flex-1 py-2.5 text-[12px] font-semibold text-[#55605A] hover:bg-[#F7F6F2] border-r"
        >
          View Profile
        </button>
        <button
          onClick={() => onMessage?.(pro)}
          className="flex-1 py-2.5 text-[12px] font-semibold text-[#1E2420] hover:bg-[#F7F6F2]"
        >
          Message
        </button>
      </div>
    </div>
  );
}

// ========== CUSTOMER QUOTE BUBBLE ==========
function CustomerQuoteBubble({
  message,
  onAccept,
  onReject,
  onPay,
  accepting,
}) {
  const quote = message.quote;
  const payment = message.payment;
  if (message.messageType === "job_started") {
    return (
      <div className="bg-[#F0821E]/5 border border-[#F0821E]/20 rounded-2xl p-4 max-w-[320px] w-full">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-[#F0821E]" />
          <span className="text-[13px] font-semibold text-[#F0821E]">Work started</span>
        </div>
      </div>
    );
  }
  if (message.messageType === "job_completed") {
    return (
      <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-2xl p-4 max-w-[320px] w-full">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#1E7A34]" />
          <span className="text-[13px] font-semibold text-[#1E7A34]">Job marked complete</span>
        </div>
      </div>
    );
  }
  if (message.messageType === "payment_confirmed") {
    return (
      <div className="bg-[#1E7A34]/5 border-2 border-[#1E7A34]/30 rounded-2xl p-5 max-w-[340px] w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#1E7A34]/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-[#1E7A34]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1E7A34]">
              Booking Confirmed!
            </p>
            <p className="text-[11px] text-[#55605A]">Payment received</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#55605A]">Amount Paid</span>
            <span className="font-bold">
              ₦{(payment?.amount || quote?.totalAmount || 0).toLocaleString()}
            </span>
          </div>
          {payment?.reference && (
            <div className="flex justify-between text-[12px]">
              <span className="text-[#9A9488]">Ref</span>
              <span className="font-medium">{payment.reference}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white border-2 border-[#1E7A34]/20 rounded-2xl p-5 max-w-[360px] w-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#1E7A34]/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-[#1E7A34]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold">Service Quote</p>
            {quote?.validUntil && (
              <p className="text-[11px] text-[#9A9488] flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Valid until {new Date(quote.validUntil).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {quote?.status === "accepted" && (
          <CheckCircle2 className="h-5 w-5 text-[#1E7A34]" />
        )}
        {quote?.status === "rejected" && (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
      {quote?.serviceDescription && (
        <div className="bg-[#F7F6F2] rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <Wrench className="h-4 w-4 text-[#1E7A34] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold mb-1">Service</p>
              <p className="text-[13px]">{quote.serviceDescription}</p>
            </div>
          </div>
        </div>
      )}
      {quote?.materials && (
        <div className="bg-[#F7F6F2] rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-[#1E7A34] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold mb-1">Materials</p>
              <p className="text-[13px]">{quote.materials}</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2 mb-4">
        {(quote?.workmanshipCost || 0) > 0 && (
          <div className="flex justify-between text-[13px]">
            <span>Workmanship</span>
            <span className="font-medium">
              ₦{(quote.workmanshipCost || 0).toLocaleString()}
            </span>
          </div>
        )}
        {(quote?.materialCost || 0) > 0 && (
          <div className="flex justify-between text-[13px]">
            <span>Materials</span>
            <span className="font-medium">
              ₦{(quote.materialCost || 0).toLocaleString()}
            </span>
          </div>
        )}
        {(quote?.otherCosts || 0) > 0 && (
          <div className="flex justify-between text-[13px]">
            <span>Other costs</span>
            <span className="font-medium">
              ₦{(quote.otherCosts || 0).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      {quote?.deadline && (
        <div className="flex items-center gap-1.5 text-[12px] text-[#9A9488] mb-4">
          <Calendar className="h-3.5 w-3.5" />
          Estimated completion: {new Date(quote.deadline).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      )}
      <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-4 mb-4 flex items-center justify-between">
        <span className="text-[14px] font-semibold">Total</span>
        <span className="text-[22px] font-bold text-[#1E7A34]">
          ₦{(quote?.totalAmount || 0).toLocaleString()}
        </span>
      </div>
      {quote?.status === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={() => onAccept?.(message)}
            disabled={accepting}
            className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {accepting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Accept Quote"
            )}
          </button>
          <button
            onClick={() => onReject?.(message)}
            disabled={accepting}
            className="px-5 py-3 border border-[#E2E0D9] rounded-xl text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2] transition-colors"
          >
            Decline
          </button>
        </div>
      )}
      {quote?.status === "accepted" && (
        <div className="space-y-3">
          <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#1E7A34]" />
            <span className="text-[13px] font-medium text-[#1E7A34]">
              Accepted - awaiting payment
            </span>
          </div>
          <button
            onClick={() => onPay?.(message)}
            className="w-full bg-[#F0821E] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#D5720F] flex items-center justify-center gap-2"
          >
            <CreditCard className="h-4 w-4" /> Pay Now
          </button>
        </div>
      )}
      {quote?.status === "paid" && (
        <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#1E7A34]" />
          <span className="text-[13px] font-medium text-[#1E7A34]">
            Paid - job is active
          </span>
        </div>
      )}
      {quote?.status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-[13px] font-medium text-red-500">
              Declined
            </span>
          </div>
          {quote?.rejectionReason && (
            <p className="text-[12px] text-red-400 ml-7">
              {quote.rejectionReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ========== PAYMENT MODAL ==========
// ========== CUSTOMER PROFILE ==========

function CustomerProfileView() {
  const [editing, setEditing] = useState(false); const [saving, setSaving] = useState(false);
  const [sm, setSm] = useState(''); const [em, setEm] = useState('');
  const [fd, setFd] = useState({ fullName: '', email: '', phone: '', state: '', city: '' });
  const { states: NIGERIAN_STATES, getLgas } = useLocations();
  const { user } = useAuth();

  // Source of truth is the authenticated user record (fetched via
  // /auth/verify), not the JWT payload - the token only carries
  // id/email/accountType, never fullName/phone/state/city.
  useEffect(() => {
    if (user) {
      setFd({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        state: user.state || '',
        city: user.city || '',
      });
    }
  }, [user]);

  const citiesForState = getLgas(fd.state);
  const { updateUser } = useAuth();

  const handleSave = async () => {
    setSaving(true); setSm(''); setEm('');
    try {
      const token = localStorage.getItem('authToken'); const API_URL = import.meta.env.VITE_API_URL || 'https://service-server-e64r.onrender.com/api';
      const res = await fetch(`${API_URL}/auth/update-profile`, { method:'PUT', headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body:JSON.stringify(fd) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message);
      updateUser?.(fd);
      setSm('Profile updated!'); setEditing(false); setTimeout(()=>setSm(''),3000);
    } catch(e) { setEm(e.message); setTimeout(()=>setEm(''),5000); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-white rounded-xl border p-4 md:p-6">
      <div className="flex items-center justify-between mb-6"><h2 className="text-[16px] font-semibold">Profile Information</h2><button onClick={() => setEditing(!editing)} className="text-[13px] text-[#1E7A34] font-medium flex items-center gap-1">{editing ? <X className="h-4 w-4"/> : <Edit className="h-4 w-4"/>}{editing ? 'Cancel' : 'Edit'}</button></div>
      {sm && <div className="mb-4 rounded-lg bg-[#1E7A34]/10 border border-[#1E7A34]/20 px-4 py-2 text-[13px] text-[#1E7A34]">{sm}</div>}
      {em && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-[13px] text-red-600">{em}</div>}
      <div className="space-y-4">
        <div><label className="block text-[12px] font-semibold text-[#9A9488] uppercase mb-1">Full Name</label>
          {editing ? <input type="text" value={fd.fullName} onChange={e=>setFd(p=>({...p,fullName:e.target.value}))} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" /> : <p className="text-[14px] text-[#1E2420]">{fd.fullName || 'Not set'}</p>}
        </div>
        <div><label className="block text-[12px] font-semibold text-[#9A9488] uppercase mb-1">Email</label><p className="text-[14px] text-[#1E2420]">{fd.email || 'Not set'}</p></div>
        <div><label className="block text-[12px] font-semibold text-[#9A9488] uppercase mb-1">Phone</label>
          {editing ? <input type="tel" value={fd.phone} onChange={e=>setFd(p=>({...p,phone:e.target.value}))} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" /> : <p className="text-[14px] text-[#1E2420]">{fd.phone || 'Not set'}</p>}
        </div>
        {/* State Dropdown */}
        <div><label className="block text-[12px] font-semibold text-[#9A9488] uppercase mb-1">State</label>
          {editing ? (
            <select value={fd.state} onChange={e => { setFd(p => ({...p, state: e.target.value, city: ''})); }} className="w-full rounded-lg border px-4 py-2.5 text-[14px] bg-white">
              <option value="">Select state</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : <p className="text-[14px] text-[#1E2420]">{fd.state || 'Not set'}</p>}
        </div>
        {/* City Dropdown */}
        <div><label className="block text-[12px] font-semibold text-[#9A9488] uppercase mb-1">City</label>
          {editing ? (
            <select value={fd.city} onChange={e => setFd(p => ({...p, city: e.target.value}))} disabled={!fd.state} className="w-full rounded-lg border px-4 py-2.5 text-[14px] bg-white disabled:opacity-50">
              <option value="">Select city</option>
              {citiesForState.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : <p className="text-[14px] text-[#1E2420]">{fd.city || 'Not set'}</p>}
        </div>
      </div>
      {editing && <button onClick={handleSave} disabled={saving} className="mt-6 w-full bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>}
    </div>
  );
}
// ========== MESSAGES TAB ==========
function MessagesTab({
  conversations: convoList,
  loading,
  onSendMessage,
  selectedChat,
  onSelectChat,
  socket,
  socketConnected,
}) {
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [warning, setWarning] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [acceptingQuote, setAcceptingQuote] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [providerTyping, setProviderTyping] = useState(false);
  const [seenByProvider, setSeenByProvider] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("none");
  const [jobDates, setJobDates] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);
  useEffect(() => {
    if (selectedChat?.id) {
      fetchMessages(selectedChat.id);
      setShowChatOnMobile(true);
    } else if (selectedChat?.professionalId) {
      setChatMessages([]);
      setShowChatOnMobile(true);
    }
  }, [selectedChat]);

  // Join the conversation's room for as long as it's open, and append
  // incoming messages live instead of waiting for a refetch.
  useEffect(() => {
    if (!socket || !selectedChat?.id) return;
    const conversationId = selectedChat.id;
    socket.emit("join:conversation", conversationId);

    const onMessage = ({ conversationId: cid, message }) => {
      if (cid !== conversationId) return;
      // Messages sent from this side are already shown optimistically by
      // handleSend - only live-append messages coming from the provider.
      if (message.senderModel === "User") return;
      setChatMessages((prev) => {
        if (prev.some((m) => (m._id || m.id) === (message._id || message.id))) return prev;
        return [...prev, { ...message, messageType: message.messageType || "text" }];
      });
      setProviderTyping(false);
    };
    const onTypingStart = ({ conversationId: cid }) => {
      if (cid === conversationId) setProviderTyping(true);
    };
    const onTypingStop = ({ conversationId: cid }) => {
      if (cid === conversationId) setProviderTyping(false);
    };
    const onRead = ({ conversationId: cid }) => {
      if (cid === conversationId) setSeenByProvider(true);
    };

    socket.on("message:received", onMessage);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);
    socket.on("messages:read", onRead);

    return () => {
      socket.emit("leave:conversation", conversationId);
      socket.off("message:received", onMessage);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
      socket.off("messages:read", onRead);
      setProviderTyping(false);
      setSeenByProvider(false);
    };
  }, [socket, selectedChat?.id]);

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL =
        import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
      const res = await fetch(
        `${API_URL}/customer/messages/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (data.success && data.data?.messages) {
        const processed = data.data.messages.map((m) => {
          if (!m.messageType && m.quote?.totalAmount) m.messageType = "quote";
          if (!m.messageType && m.payment?.status === "paid")
            m.messageType = "payment_confirmed";
          if (!m.messageType) m.messageType = "text";
          return m;
        });
        setChatMessages(processed);
        setContactUnlocked(!!data.data.contactUnlocked);
        setBookingStatus(data.data.bookingStatus || "none");
        setJobDates(data.data.job || null);
        socket?.emit("messages:read", { conversationId });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChat) return;
    if (
      /\b\d{10,}\b/.test(messageText) ||
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(messageText)
    ) {
      setWarning("Contact info not allowed.");
      setTimeout(() => setWarning(""), 5000);
      return;
    }
    setSending(true);
    try {
      await onSendMessage?.(
        selectedChat.professionalId || selectedChat.id,
        messageText,
      );
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: messageText,
          sender: "me",
          senderModel: "User",
          messageType: "text",
          createdAt: new Date().toISOString(),
        },
      ]);
      setSeenByProvider(false);
      setMessageText("");
    } catch (err) {
      setWarning(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleAcceptQuote = async (message) => {
    if (acceptingQuote) return;
    setAcceptingQuote(true);
    try {
      const token = localStorage.getItem("authToken");
      const API_URL =
        import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
      const cid = selectedChat?.id;
      const mid = message._id || message.id;
      const res = await fetch(
        `${API_URL}/customer/accept-quote/${cid}/${mid}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchMessages(cid);
    } catch (err) {
      setWarning(err.message);
      setTimeout(() => setWarning(""), 5000);
    } finally {
      setAcceptingQuote(false);
    }
  };

  const handleRejectQuote = async (message) => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL =
        import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
      const cid = selectedChat?.id;
      const mid = message._id || message.id;
      await fetch(`${API_URL}/customer/reject-quote/${cid}/${mid}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "Declined" }),
      });
      fetchMessages(cid);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayNow = (message) => {
    setPaymentMessage(message);
    setShowPaymentModal(true);
  };
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setPaymentMessage(null);
    fetchMessages(selectedChat?.id);
  };

  const handleSelectChatMobile = (chat) => {
    onSelectChat?.(chat);
    setShowChatOnMobile(true);
  };
  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };
  const gii = (n) =>
    n
      ? n
          .split(" ")
          .map((x) => x[0])
          .join("")
          .toUpperCase()
      : "?";

  return (
    <div
      className="flex bg-white rounded-xl border border-[#E2E0D9] overflow-hidden"
      style={{ height: "calc(100vh - 120px)" }}
    >
      {showPaymentModal && (
        <PaystackPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          conversationId={selectedChat?.id}
          messageId={paymentMessage?._id || paymentMessage?.id}
          amount={paymentMessage?.quote?.totalAmount}
          providerName={selectedChat?.name}
          customerEmail={user?.email}
        />
      )}
      <div
        className={`${showChatOnMobile ? "hidden" : "flex"} md:flex w-full md:w-[320px] border-r border-[#E2E0D9] flex-col flex-shrink-0`}
      >
        <div className="p-3 md:p-4 border-b">
          <h3 className="text-[14px] md:text-[15px] font-semibold">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            [0, 1, 2].map((i) => (
              <SkeletonBlock key={i} className="h-[60px] md:h-[64px] m-2" />
            ))
          ) : !convoList?.length ? (
            <EmptyState icon={MessageCircle} title="No messages yet" />
          ) : (
            convoList.map((chat) => (
              <button
                key={chat.id || chat.professionalId}
                onClick={() => handleSelectChatMobile(chat)}
                className={`w-full flex items-center gap-3 p-3 md:p-4 text-left hover:bg-[#F7F6F2] border-b ${selectedChat?.id === chat.id || selectedChat?.professionalId === chat.professionalId ? "bg-[#F7F6F2] border-l-[3px] border-l-[#1E7A34]" : ""}`}
              >
                <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E7A34] to-[#166B2C] text-[11px] md:text-[13px] font-semibold text-white">
                  {gii(chat.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-[12px] md:text-[13px] font-semibold">
                      {chat.name}
                    </p>
                    <span className="text-[9px] md:text-[10px] text-[#9A9488]">
                      {formatNigerianDate(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className="truncate text-[11px] md:text-[12px] text-[#55605A] mt-0.5">
                    {chat.lastMessage || "Start a conversation"}
                  </p>
                </div>
                {chat.unread && (
                  <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-[#F0821E] flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
      <div
        className={`${!showChatOnMobile ? "hidden" : "flex"} md:flex flex-1 flex-col bg-[#FAFAF8] min-w-0`}
      >
        {selectedChat ? (
          <>
            <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 bg-white border-b flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={handleBackToList}
                  className="md:hidden text-[#55605A] p-1"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1E7A34] to-[#166B2C] text-[11px] md:text-[13px] font-semibold text-white">
                  {gii(selectedChat.name)}
                </div>
                <div>
                  <p className="text-[13px] md:text-[14px] font-semibold">
                    {selectedChat.name}
                  </p>
                  <p className="text-[10px] md:text-[11px] text-[#9A9488]">
                    {selectedChat.trade}
                  </p>
                </div>
              </div>
              <ContactReveal
                role="customer"
                conversationId={selectedChat.id}
                contactUnlocked={contactUnlocked}
              />
            </div>
            {jobDates?.deadline && bookingStatus !== "none" && bookingStatus !== "quote_sent" && (
              <div className="px-3 md:px-5 py-1.5 md:py-2 bg-white border-b flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] md:text-[11px] text-[#55605A] flex-shrink-0">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 md:h-3.5 w-3 md:w-3.5 text-[#9A9488]" />
                  Target completion: {new Date(jobDates.deadline).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                {bookingStatus === "in_progress" && (
                  <span className="flex items-center gap-1 text-[#F0821E] font-medium">
                    <PlayCircle className="h-3 md:h-3.5 w-3 md:w-3.5" /> In progress
                  </span>
                )}
                {bookingStatus === "completed" && (
                  <span className="flex items-center gap-1 text-[#1E7A34] font-medium">
                    <CheckCircle2 className="h-3 md:h-3.5 w-3 md:w-3.5" /> Completed
                  </span>
                )}
              </div>
            )}
            <div className="px-3 md:px-5 py-1.5 md:py-2 bg-[#FFF8F0] border-b flex items-center gap-2 text-[10px] md:text-[11px] text-[#B85E10] flex-shrink-0">
              <Shield className="h-3 md:h-3.5 w-3 md:w-3.5 flex-shrink-0" />
              <span>
                Keep communication on the platform. Sharing contacts is not
                allowed.
              </span>
            </div>
            {socket && !socketConnected && (
              <div className="px-3 md:px-5 py-1.5 bg-[#FFF3F3] border-b flex items-center gap-2 text-[10px] md:text-[11px] text-red-600 flex-shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                Reconnecting... messages will send once you're back online.
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-3 md:px-5 py-3 md:py-4 space-y-3 md:space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Shield className="h-8 md:h-10 w-8 md:w-10 text-[#D8D5CB] mb-3" />
                  <p className="text-[13px] md:text-[14px] font-semibold">
                    Start a conversation
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, i) => {
                  if (
                    msg.messageType === "quote" ||
                    msg.messageType === "payment_requested" ||
                    msg.messageType === "payment_confirmed" ||
                    msg.messageType === "quote_rejected" ||
                    msg.messageType === "job_started" ||
                    msg.messageType === "job_completed"
                  ) {
                    return (
                      <div
                        key={msg._id || msg.id || i}
                        className="flex justify-center my-3"
                      >
                        <CustomerQuoteBubble
                          message={msg}
                          onAccept={handleAcceptQuote}
                          onReject={handleRejectQuote}
                          onPay={handlePayNow}
                          accepting={acceptingQuote}
                        />
                      </div>
                    );
                  }
                  const isMine =
                    msg.sender === "me" || msg.senderModel === "User";
                  return (
                    <div
                      key={msg._id || msg.id || i}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 md:px-4 py-2 md:py-2.5 ${isMine ? "bg-[#1E7A34] text-white rounded-br-md" : "bg-white border border-[#E2E0D9] rounded-bl-md shadow-sm"}`}
                      >
                        <p className="text-[13px] md:text-[14px]">{msg.text}</p>
                        <p
                          className={`text-[9px] md:text-[10px] mt-1 flex items-center gap-1 ${isMine ? "text-white/70" : "text-[#9A9488]"}`}
                        >
                          {formatNigerianTime(msg.createdAt)}
                          {isMine && i === chatMessages.length - 1 && seenByProvider && (
                            <span>· Seen</span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              {providerTyping && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#9A9488] px-1">
                  <span className="flex gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9A9488] animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9A9488] animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9A9488] animate-bounce" />
                  </span>
                  typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {warning && (
              <div className="mx-3 md:mx-4 mb-2 rounded-lg bg-red-50 border border-red-200 px-3 md:px-4 py-2 flex items-start gap-2">
                <AlertTriangle className="h-3.5 md:h-4 w-3.5 md:w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] md:text-[12px] text-red-600 flex-1">
                  {warning}
                </p>
                <button
                  onClick={() => setWarning("")}
                  className="flex-shrink-0"
                >
                  <X className="h-3 md:h-3.5 w-3 md:w-3.5 text-red-400" />
                </button>
              </div>
            )}
            <div className="p-3 md:p-4 bg-white border-t flex-shrink-0">
              <div className="flex items-end gap-2 md:gap-3">
                <textarea
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (socket && selectedChat?.id) {
                      socket.emit("typing:start", { conversationId: selectedChat.id });
                      clearTimeout(typingTimeoutRef.current);
                      typingTimeoutRef.current = setTimeout(() => {
                        socket.emit("typing:stop", { conversationId: selectedChat.id });
                      }, 2000);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 rounded-xl border border-[#E2E0D9] px-3 md:px-4 py-2 md:py-3 text-[13px] md:text-[14px] focus:outline-none focus:border-[#1E7A34] resize-none bg-[#FAFAF8]"
                  style={{ minHeight: "40px", maxHeight: "100px" }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 100) + "px";
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim() || sending}
                  className="rounded-xl bg-[#1E7A34] p-2.5 md:p-3 text-white hover:bg-[#166B2C] disabled:opacity-40 transition-colors flex-shrink-0"
                >
                  <Send className="h-4 md:h-5 w-4 md:w-5" />
                </button>
              </div>
              <p className="text-[9px] md:text-[10px] text-[#9A9488] mt-1.5 flex items-center gap-1">
                <Shield className="h-2.5 md:h-3 w-2.5 md:w-3" />
                Phone numbers and emails are blocked
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-10 md:h-12 w-10 md:w-12 text-[#D8D5CB] mx-auto mb-3 md:mb-4" />
              <h3 className="text-[14px] md:text-[16px] font-semibold">
                Select a conversation
              </h3>
              <p className="text-[12px] md:text-[13px] text-[#9A9488] mt-1">
                Choose a message to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ========== MAIN DASHBOARD ==========
export default function Dashboard({
  categories,
  states,
  onCompleteProfile,
  onOpenSettings,
  onLogout,
}) {
  const {
    customerName,
    profileCompletion,
    recentPros,
    conversations,
    notifications,
    favorites,
    searchResults,
    isSearching,
    loading,
    error,
    refetch,
    search,
    toggleFavorite,
    markNotificationRead,
    sendMessage,
  } = useCustomerDashboard();
  const [activeView, setActiveView] = useState(
    () => sessionStorage.getItem("activeView") || "dashboard",
  );
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProviderForProfile, setSelectedProviderForProfile] =
    useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { socket, connected: socketConnected } = useSocket();

  useEffect(() => {
    sessionStorage.setItem("activeView", activeView);
  }, [activeView]);
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeView]);

  // Live updates: a new message or notification anywhere refreshes the
  // dashboard payload (conversation list, unread badges, notifications)
  // instead of waiting on the 15s poll. The open conversation thread itself
  // is updated separately, directly, inside MessagesTab for instant feel.
  useEffect(() => {
    if (!socket) return;
    const onUpdate = () => refetch();
    socket.on("message:notification", onUpdate);
    socket.on("notification:new", onUpdate);
    return () => {
      socket.off("message:notification", onUpdate);
      socket.off("notification:new", onUpdate);
    };
  }, [socket, refetch]);

  const unreadMessages = (conversations || []).filter((c) => c.unread).length;
  const unreadNotifications = (notifications || []).filter(
    (n) => !n.read,
  ).length;
  const badgeCounts = {
    messages: unreadMessages,
    notifications: unreadNotifications,
  };
  const { states: locationStates, getLgas } = useLocations();
  const citiesForState = getLgas(state);
  const cats = categories || Object.values(SERVICE_CATEGORIES).flat();
  const searchStates = states || locationStates;

  const handleMessagePro = (pro) => {
    const ec = conversations?.find((c) => c.professionalId === pro.id);
    setSelectedChat(
      ec || {
        professionalId: pro.id,
        name: pro.fullName || pro.name || pro.companyName || "Pro",
        trade: pro.trade || pro.serviceType,
        profilePicture: pro.profilePicture,
        lastMessage: "",
        unread: false,
      },
    );
    setActiveView("messages");
  };
  const handleViewProfile = (pro) => {
    setSelectedProviderForProfile(pro);
    setShowProfileModal(true);
  };
  const handleMessageFromProfile = (pro) => {
    handleMessagePro(pro);
    setShowProfileModal(false);
  };
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };
  const handleSendMessage = async (proId, text) => {
    try {
      await sendMessage(proId, text);
      await refetch();
    } catch (err) {
      throw err;
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userAccountType");
    window.location.href = "/login";
  };

  return (
    <div className="h-screen w-full bg-[#F5F4F0] text-[#1E2420] font-['Inter',sans-serif] overflow-hidden flex flex-col">
      {showProfileModal && (
        <ProviderProfileModal
          providerId={selectedProviderForProfile?.id}
          onClose={() => setShowProfileModal(false)}
          onMessage={handleMessageFromProfile}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex max-w-[1240px] mx-auto w-full overflow-hidden">
        <aside
          className={`fixed md:sticky top-0 z-50 h-full w-[220px] bg-white border-r border-[#E2E0D9] flex-col justify-between px-4 py-6 transition-transform duration-300 overflow-y-auto md:translate-x-0 md:flex ${sidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden"}`}
        >
          <div>
            <div className="mb-8 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <img src={logoIcon} alt="logo" className="h-8 w-8" />
                <span className="text-[14px] font-semibold">
                  9jaTradiesPages
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-[#9A9488]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {NAV_CONFIG.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const badge = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${isActive ? "bg-[#1E7A34] text-white" : "text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]"}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {badge > 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-['IBM_Plex_Mono',monospace] ${isActive ? "bg-[#F0821E] text-white" : "bg-[#FBE0C4] text-[#B85E10]"}`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="space-y-1 border-t border-[#E2E0D9] pt-4">
            <button
              onClick={() => onOpenSettings?.()}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#EFEDE6]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#EFEDE6]"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 pb-20 md:pb-6">
          {error && <ErrorBanner message={error} onRetry={refetch} />}
          <div className="md:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[#55605A]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView("notifications")}
                className="relative"
              >
                <Bell className="h-5 w-5 text-[#55605A]" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#F0821E]" />
                )}
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E7A34] text-[11px] font-semibold text-white">
                {customerName?.[0] || "?"}
              </div>
            </div>
          </div>
          {activeView === "messages" ? (
            <MessagesTab
              conversations={conversations}
              loading={loading?.conversations}
              onSendMessage={handleSendMessage}
              selectedChat={selectedChat}
              onSelectChat={handleSelectChat}
              socket={socket}
              socketConnected={socketConnected}
            />
          ) : activeView === "support" ? (
            <SupportChat />
          ) : activeView === "notifications" ? (
            <div className="space-y-2 md:space-y-3">
              {(notifications || []).length === 0 ? (
                <EmptyState icon={Bell} title="All caught up" />
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={async () => {
                      await markNotificationRead(n);
                      if (n.kind === "action") setActiveView("messages");
                    }}
                    className={`rounded-xl border p-3 md:p-4 cursor-pointer transition-all hover:shadow-sm ${n.read ? "bg-white opacity-70" : "bg-[#FFF8F0] border-[#F0821E]/20"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${n.read ? "bg-[#9A9488]" : n.kind === "success" ? "bg-[#1E7A34]" : "bg-[#F0821E]"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] md:text-[14px]">{n.text}</p>
                        <p className="text-[11px] md:text-[12px] text-[#9A9488] mt-1">
                          {formatNigerianDate(n.time)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="text-[10px] font-semibold text-[#F0821E] whitespace-nowrap">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeView === "favorites" ? (
            <div className="space-y-2">
              {(favorites || []).map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-md border border-[#E2E0D9] bg-white px-3 py-2.5"
                >
                  <div>
                    <p className="text-[12px] md:text-[13px] font-semibold">
                      {f.name}
                    </p>
                    <p className="text-[10px] md:text-[11.5px] text-[#55605A]">
                      {f.trade} · {f.location}
                    </p>
                  </div>
                  <button onClick={() => toggleFavorite(f, false)}>
                    <Heart className="h-4 w-4 fill-[#F0821E] text-[#F0821E]" />
                  </button>
                </div>
              ))}
            </div>
          ) : activeView === "profile" ? (
            <CustomerProfileView />
          ) : (
            <>
              <div className="hidden md:flex mb-7 items-center justify-between">
                <div>
                  <p className="text-[12px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                    {new Date().toLocaleDateString("en-NG", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <h1 className="text-[22px] font-semibold">
                    Good to see you, {customerName || "there"}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveView("notifications")}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E0D9] bg-white"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#F0821E]" />
                    )}
                  </button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E7A34] text-[12px] font-semibold text-white">
                    {customerName?.[0] || "?"}
                  </div>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowSearchResults(true);
                  search?.({ category, state, city });
                }}
                className="mb-6 md:mb-8 rounded-lg border border-[#E2E0D9] bg-white p-3 md:p-4"
              >
                <p className="mb-2 md:mb-3 text-[11px] md:text-[12px] font-semibold uppercase text-[#9A9488]">
                  Find a trusted professional near you
                </p>
                <div className="grid grid-cols-1 gap-2 md:gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-md border bg-[#FBFAF8] px-3 py-2.5 text-[12px] md:text-[13px]"
                  >
                    <option value="">Service category</option>
                    {Object.entries(SERVICE_CATEGORIES).map(([g, s]) => (
                      <optgroup key={g} label={g}>
                        {s.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setCity("");
                    }}
                    className="rounded-md border bg-[#FBFAF8] px-3 py-2.5 text-[12px] md:text-[13px]"
                  >
                    <option value="">State</option>
                    {searchStates.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-md border bg-[#FBFAF8] px-3 py-2.5 text-[12px] md:text-[13px]"
                    disabled={!state}
                  >
                    <option value="">City</option>
                    {citiesForState.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="flex items-center justify-center gap-1.5 rounded-md bg-[#F0821E] px-5 py-2.5 text-[12px] md:text-[13px] font-semibold text-white hover:bg-[#D5720F] disabled:opacity-70"
                  >
                    {isSearching ? (
                      <Loader className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Search className="h-3.5 w-3.5" />
                    )}
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                </div>
              </form>
              {showSearchResults && (
                <section className="mb-6 md:mb-8">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h2 className="text-[16px] md:text-[18px] font-semibold">
                      Results{" "}
                      {searchResults?.length > 0 && (
                        <span className="ml-2 text-[12px] md:text-[14px] font-normal">
                          ({searchResults.length})
                        </span>
                      )}
                    </h2>
                    <button
                      onClick={() => setShowSearchResults(false)}
                      className="flex items-center gap-1 text-[12px] md:text-[13px]"
                    >
                      <X className="h-4 w-4" />
                      Hide
                    </button>
                  </div>
                  {isSearching ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                      {[0, 1, 2].map((i) => (
                        <SkeletonBlock
                          key={i}
                          className="h-[180px] md:h-[210px]"
                        />
                      ))}
                    </div>
                  ) : !searchResults?.length ? (
                    <EmptyState icon={Search} title="No professionals found" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                      {searchResults.map((pro) => (
                        <ProTicketCard
                          key={pro.id}
                          pro={pro}
                          onMessage={handleMessagePro}
                          onToggleFavorite={toggleFavorite}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 md:gap-8">
                <div className="space-y-6 md:space-y-8">
                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-[14px] md:text-[15px] font-semibold">
                        Recently contacted
                      </h2>
                    </div>
                    {loading?.pros ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                        {[0, 1, 2].map((i) => (
                          <SkeletonBlock
                            key={i}
                            className="h-[180px] md:h-[210px]"
                          />
                        ))}
                      </div>
                    ) : !recentPros?.length ? (
                      <EmptyState icon={Search} title="No professionals yet" />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                        {recentPros.map((pro) => (
                          <ProTicketCard
                            key={pro.id}
                            pro={pro}
                            onMessage={handleMessagePro}
                            onToggleFavorite={toggleFavorite}
                            onViewProfile={handleViewProfile}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-[14px] md:text-[15px] font-semibold">
                        Conversations
                      </h2>
                      <button
                        onClick={() => setActiveView("messages")}
                        className="flex items-center gap-1 text-[11px] md:text-[12px] hover:text-[#1E2420]"
                      >
                        Open inbox{" "}
                        <ChevronRight className="h-3 md:h-3.5 w-3 md:w-3.5" />
                      </button>
                    </div>
                    {loading?.conversations ? (
                      <div className="space-y-2">
                        {[0, 1, 2].map((i) => (
                          <SkeletonBlock
                            key={i}
                            className="h-[52px] md:h-[60px]"
                          />
                        ))}
                      </div>
                    ) : !conversations?.length ? (
                      <EmptyState
                        icon={Inbox}
                        title="No conversations yet"
                        hint="Message a provider to start one."
                      />
                    ) : (
                      <div className="divide-y divide-[#E2E0D9] rounded-lg border bg-white overflow-hidden">
                        {conversations.slice(0, 3).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSelectedChat(c);
                              setActiveView("messages");
                            }}
                            className="flex w-full items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 hover:bg-[#F7F6F2] transition-colors text-left"
                          >
                            <div
                              className={`flex h-9 w-9 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-full text-[11px] md:text-[12px] font-semibold ${c.unread ? "bg-[#1E7A34] text-white" : "bg-[#EFEDE6] text-[#55605A]"}`}
                            >
                              {c.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p
                                  className={`truncate text-[12px] md:text-[13px] ${c.unread ? "font-semibold text-[#1E2420]" : "font-medium text-[#55605A]"}`}
                                >
                                  {c.name}
                                  <span className="ml-1.5 font-normal text-[#9A9488]">
                                    · {c.trade}
                                  </span>
                                </p>
                                {c.time && (
                                  <span className="flex-shrink-0 text-[10px] md:text-[11px] text-[#9A9488]">
                                    {formatNigerianDate(c.time)}
                                  </span>
                                )}
                              </div>
                              <p
                                className={`truncate text-[11px] md:text-[12px] ${c.unread ? "text-[#1E2420]" : "text-[#9A9488]"}`}
                              >
                                {c.preview || "No messages yet"}
                              </p>
                            </div>
                            {c.unread && (
                              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#F0821E]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
                <div className="space-y-6 md:space-y-8">
                  <section>
                    <h2 className="mb-2 md:mb-3 text-[14px] md:text-[15px] font-semibold">
                      Notifications
                    </h2>
                    {loading?.notifications ? (
                      <div className="space-y-2">
                        {[0, 1, 2].map((i) => (
                          <SkeletonBlock
                            key={i}
                            className="h-[44px] md:h-[52px]"
                          />
                        ))}
                      </div>
                    ) : !notifications?.length ? (
                      <EmptyState icon={Bell} title="All caught up" />
                    ) : (
                      <div className="space-y-1 md:space-y-2">
                        {notifications.slice(0, 3).map((n) => (
                          <div
                            key={n.id}
                            className="flex items-start gap-2 md:gap-2.5 rounded-md border bg-white px-3 py-2 md:py-2.5"
                          >
                            <span
                              className={`mt-0.5 h-1.5 w-1.5 rounded-full ${n.read ? "bg-[#9A9488]" : "bg-[#F0821E]"}`}
                            />
                            <p className="text-[11px] md:text-[12px]">
                              {n.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                  <section>
                    <h2 className="mb-2 md:mb-3 text-[14px] md:text-[15px] font-semibold">
                      Saved
                    </h2>
                    {loading?.favorites ? (
                      <div className="space-y-2">
                        {[0, 1].map((i) => (
                          <SkeletonBlock
                            key={i}
                            className="h-[44px] md:h-[52px]"
                          />
                        ))}
                      </div>
                    ) : !favorites?.length ? (
                      <EmptyState icon={Heart} title="No saved pros" />
                    ) : (
                      <div className="space-y-1 md:space-y-2">
                        {favorites.slice(0, 3).map((f) => (
                          <div
                            key={f.id}
                            className="flex items-center justify-between rounded-md border bg-white px-3 py-2 md:py-2.5"
                          >
                            <div>
                              <p className="text-[12px] md:text-[13px] font-semibold">
                                {f.name}
                              </p>
                              <p className="text-[10px] md:text-[11px]">
                                {f.trade}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <nav className="md:hidden flex-shrink-0 flex items-center justify-around border-t border-[#E2E0D9] bg-white/95 px-2 py-1.5">
        {NAV_CONFIG.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const badge = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1"
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "text-[#1E2420]" : "text-[#9A9488]"}`}
              />
              <span
                className={`text-[9px] font-medium ${isActive ? "text-[#1E2420]" : "text-[#9A9488]"}`}
              >
                {item.label}
              </span>
              {badge > 0 && (
                <span className="absolute -top-0.5 right-1 h-1.5 w-1.5 rounded-full bg-[#F0821E]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
