// components/dashboard/Dashboard.jsx - FULLY CORRECTED
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
  Phone,
  Calendar,
  Briefcase,
  AlertCircle,
  Flag,
} from "lucide-react";
import logoIcon from "../../assets/dashlogo.png";
import { useCustomerDashboard } from "../../hooks/useCustomerDashboard";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";
import ProviderProfileModal from "./ProviderProfileModal";

const DEFAULT_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Oyo",
  "Kano",
  "Delta",
  "Edo",
  "Enugu",
];
const CITIES_BY_STATE = {
  Lagos: [
    "Ikeja",
    "Lekki",
    "Victoria Island",
    "Surulere",
    "Yaba",
    "Ikoyi",
    "Ajah",
    "Apapa",
    "Badagry",
  ],
  "Abuja (FCT)": [
    "Wuse II",
    "Garki",
    "Maitama",
    "Asokoro",
    "Gwarinpa",
    "Jabi",
    "Kubwa",
    "Lugbe",
  ],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Oyigbo", "Okrika"],
  Oyo: ["Ibadan North", "Ibadan South", "Ogbomosho", "Oyo", "Iseyin"],
  Kano: ["Kano Municipal", "Nassarawa", "Tarauni", "Fagge", "Dala"],
  Delta: ["Asaba", "Warri", "Sapele", "Ughelli"],
  Edo: ["Benin City", "Ekpoma", "Auchi", "Uromi"],
  Enugu: ["Enugu North", "Enugu South", "Nsukka", "Agbani"],
};

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

function StatusTag({ children, tone = "signal" }) {
  const tones = {
    signal: "bg-[#1E7A34] text-white",
    brass: "bg-[#F0821E] text-white",
    quiet: "bg-[#EFEDE6] text-[#55605A]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[3px] px-2 py-[3px] text-[10px] font-semibold tracking-wide uppercase font-['IBM_Plex_Mono',monospace] ${tones[tone]}`}
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

function ProTicketCard({ pro, onMessage, onToggleFavorite, onViewProfile }) {
  const getInitials = () => {
    const name = pro.fullName || pro.name || pro.companyName || "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const displayName = pro.fullName || pro.name || "Unknown Pro";
  const companyName =
    pro.companyName && pro.companyName !== displayName ? pro.companyName : null;
  const formatLocation = () => {
    const parts = [];
    if (pro.city?.trim()) parts.push(pro.city.trim());
    if (pro.state?.trim()) parts.push(pro.state.trim());
    if (parts.length > 0) return parts.join(", ");
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
              alt={displayName}
              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E2420] text-[13px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
              {getInitials()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
              {displayName}
            </p>
            {companyName && (
              <p className="text-[11px] text-[#9A9488] truncate">
                {companyName}
              </p>
            )}
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
        <div className="flex items-center justify-between text-[12px] text-[#55605A]">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#9A9488]" />
            <span className="truncate">{formatLocation()}</span>
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
          className="flex-1 py-2.5 text-[12px] font-semibold text-[#55605A] hover:bg-[#F7F6F2] transition-colors border-r border-[#E2E0D9]"
        >
          View Profile
        </button>
        <button
          onClick={() => onMessage?.(pro)}
          className="flex-1 py-2.5 text-[12px] font-semibold text-[#1E2420] hover:bg-[#F7F6F2] transition-colors"
        >
          Message
        </button>
      </div>
    </div>
  );
}

function SupportTab() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "admin",
      text: "Welcome to support! How can we help you today? You can report issues, complaints, or ask questions.",
      time: new Date().toISOString(),
    },
  ]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [reportType, setReportType] = useState("general");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    const token = localStorage.getItem("authToken");
    const API_URL = import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
    setSending(true);
    try {
      const userMsg = {
        id: Date.now(),
        sender: "user",
        text: messageText,
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setMessageText("");
      await fetch(`${API_URL}/customer/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject:
            subject || reportType === "complaint"
              ? "Complaint"
              : "General inquiry",
          message: messageText,
          type: reportType,
        }),
      });
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "admin",
            text: "Thank you for your message. Our team will review this and get back to you shortly.",
            time: new Date().toISOString(),
          },
        ]);
      }, 1500);
    } catch (err) {
      console.error("Send report error:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl border border-[#E2E0D9] overflow-hidden"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#F0821E]/10 flex items-center justify-center">
            <Flag className="h-5 w-5 text-[#F0821E]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#1E2420]">
              Support & Complaints
            </p>
            <p className="text-[11px] text-[#9A9488]">
              Report issues or ask questions
            </p>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-[#FAFAF8] border-b flex flex-wrap gap-3 flex-shrink-0">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="rounded-lg border border-[#E2E0D9] px-3 py-2 text-[12px] bg-white"
        >
          <option value="general">General inquiry</option>
          <option value="complaint">Report a complaint</option>
          <option value="bug">Report a bug</option>
          <option value="suggestion">Suggestion</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief subject (optional)"
          className="flex-1 rounded-lg border border-[#E2E0D9] px-3 py-2 text-[12px] bg-white min-w-[150px]"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#FAFAF8]">
        {messages.map((msg) => {
          const isAdmin = msg.sender === "admin";
          return (
            <div
              key={msg.id}
              className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isAdmin ? "bg-white border border-[#E2E0D9] rounded-bl-md shadow-sm" : "bg-[#1E7A34] text-white rounded-br-md"}`}
              >
                {isAdmin && (
                  <p className="text-[11px] font-semibold text-[#F0821E] mb-1">
                    9jaTradiesPages Support
                  </p>
                )}
                <p className="text-[13px] md:text-[14px]">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 ${isAdmin ? "text-[#9A9488]" : "text-white/70"}`}
                >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-5 py-2 bg-[#FFF8F0] border-t border-[#F0821E]/10 flex items-center gap-2 text-[11px] text-[#B85E10] flex-shrink-0">
        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
        <span>
          Reports are reviewed by our team. You'll be notified when there's a
          response.
        </span>
      </div>
      <div className="p-4 bg-white border-t flex-shrink-0">
        <div className="flex items-end gap-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe your issue or question..."
            rows={1}
            className="flex-1 rounded-xl border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] resize-none bg-[#FAFAF8]"
            style={{ minHeight: "44px", maxHeight: "100px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 100) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim() || sending}
            className="rounded-xl bg-[#F0821E] p-3 text-white hover:bg-[#D5720F] disabled:opacity-40 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Replace the entire MessagesTab function with this fixed version
function MessagesTab({ conversations: convoList, loading, onSendMessage, selectedChat, onSelectChat }) {
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [warning, setWarning] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);
  
  useEffect(() => {
    if (selectedChat?.id) {
      fetchMessages(selectedChat.id);
      setShowChatOnMobile(true); // Auto-show chat when a conversation is selected
    } else if (selectedChat?.professionalId) {
      setChatMessages([]);
      setShowChatOnMobile(true); // Also show for new conversations
    }
  }, [selectedChat]);

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL = import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
      const res = await fetch(`${API_URL}/customer/messages/${conversationId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) setChatMessages(data.data.messages || []);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChat) return;
    if (/\b\d{10,}\b/.test(messageText) || /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(messageText)) {
      setWarning("Contact information is not allowed."); 
      setTimeout(() => setWarning(""), 5000); 
      return;
    }
    setSending(true);
    try {
      await onSendMessage?.(selectedChat.professionalId || selectedChat.id, messageText);
      setChatMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: messageText, 
        sender: "me", 
        senderModel: "User", 
        createdAt: new Date().toISOString() 
      }]);
      setMessageText("");
    } catch (err) { 
      setWarning(err.message); 
    } finally { 
      setSending(false); 
    }
  };

  const handleSelectChat = (chat) => {
    onSelectChat?.(chat);
    setShowChatOnMobile(true);
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };

  return (
    <div className="flex bg-white rounded-xl border border-[#E2E0D9] overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Conversation List - Hide on mobile when chat is shown */}
      <div className={`${showChatOnMobile ? 'hidden' : 'flex'} md:flex w-full md:w-[320px] border-r border-[#E2E0D9] flex-col flex-shrink-0`}>
        <div className="p-3 md:p-4 border-b">
          <h3 className="text-[14px] md:text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            [0,1,2].map(i => <SkeletonBlock key={i} className="h-[60px] md:h-[64px] m-2" />)
          ) : !convoList?.length ? (
            <EmptyState icon={MessageCircle} title="No messages yet" />
          ) : (
            convoList.map(chat => (
              <button 
                key={chat.id || chat.professionalId} 
                onClick={() => handleSelectChat(chat)}
                className={`w-full flex items-center gap-3 p-3 md:p-4 text-left hover:bg-[#F7F6F2] border-b transition-colors ${
                  selectedChat?.id === chat.id || selectedChat?.professionalId === chat.professionalId ? 
                  "bg-[#F7F6F2] border-l-[3px] border-l-[#1E7A34]" : ""
                }`}
              >
                <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E7A34] to-[#166B2C] text-[11px] md:text-[13px] font-semibold text-white">
                  {chat.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-[12px] md:text-[13px] font-semibold">{chat.name}</p>
                    <span className="text-[9px] md:text-[10px] text-[#9A9488]">{chat.lastMessageTime}</span>
                  </div>
                  <p className="truncate text-[11px] md:text-[12px] text-[#55605A] mt-0.5">
                    {chat.lastMessage || "Start a conversation"}
                  </p>
                </div>
                {chat.unread && <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-[#F0821E] flex-shrink-0" />}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area - Full width on mobile when shown */}
      <div className={`${!showChatOnMobile ? 'hidden' : 'flex'} md:flex flex-1 flex-col bg-[#FAFAF8] min-w-0`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 bg-white border-b flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                {/* Back button - visible on mobile */}
                <button onClick={handleBackToList} className="md:hidden text-[#55605A] p-1">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1E7A34] to-[#166B2C] text-[11px] md:text-[13px] font-semibold text-white">
                  {selectedChat.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] md:text-[14px] font-semibold">{selectedChat.name}</p>
                  <p className="text-[10px] md:text-[11px] text-[#9A9488]">{selectedChat.trade}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-[#F7F6F2] text-[10px] md:text-[11px] text-[#9A9488]">
                <Shield className="h-3 w-3" />Secure
              </div>
            </div>

            {/* Security Banner */}
            <div className="px-3 md:px-5 py-1.5 md:py-2 bg-[#FFF8F0] border-b flex items-center gap-2 text-[10px] md:text-[11px] text-[#B85E10] flex-shrink-0">
              <Shield className="h-3 md:h-3.5 w-3 md:w-3.5 flex-shrink-0" />
              <span>Keep communication on the platform. Sharing contacts is not allowed.</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 md:px-5 py-3 md:py-4 space-y-3 md:space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Shield className="h-8 md:h-10 w-8 md:w-10 text-[#D8D5CB] mb-3" />
                  <p className="text-[13px] md:text-[14px] font-semibold">Start a conversation</p>
                  <p className="text-[11px] md:text-[12px] text-[#9A9488] mt-1">Send your first message below</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => {
                  const isMine = msg.sender === "me" || msg.senderModel === "User";
                  return (
                    <div key={msg.id || i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 md:px-4 py-2 md:py-2.5 ${
                        isMine ? "bg-[#1E7A34] text-white rounded-br-md" : "bg-white border border-[#E2E0D9] rounded-bl-md shadow-sm"
                      }`}>
                        <p className="text-[13px] md:text-[14px]">{msg.text}</p>
                        <p className={`text-[9px] md:text-[10px] mt-1 ${isMine ? "text-white/70" : "text-[#9A9488]"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Warning */}
            {warning && (
              <div className="mx-3 md:mx-4 mb-2 rounded-lg bg-red-50 border border-red-200 px-3 md:px-4 py-2 flex items-start gap-2">
                <AlertTriangle className="h-3.5 md:h-4 w-3.5 md:w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] md:text-[12px] text-red-600">{warning}</p>
                <button onClick={() => setWarning("")} className="flex-shrink-0 ml-auto">
                  <X className="h-3 md:h-3.5 w-3 md:w-3.5 text-red-400" />
                </button>
              </div>
            )}

            {/* Message Input */}
            <div className="p-3 md:p-4 bg-white border-t flex-shrink-0">
              <div className="flex items-end gap-2 md:gap-3">
                <textarea 
                  value={messageText} 
                  onChange={e => setMessageText(e.target.value)} 
                  onKeyDown={e => { 
                    if (e.key === "Enter" && !e.shiftKey) { 
                      e.preventDefault(); 
                      handleSend(); 
                    } 
                  }} 
                  placeholder="Type your message..." 
                  rows={1} 
                  className="flex-1 rounded-xl border border-[#E2E0D9] px-3 md:px-4 py-2 md:py-3 text-[13px] md:text-[14px] focus:outline-none focus:border-[#1E7A34] resize-none bg-[#FAFAF8]" 
                  style={{minHeight:"40px",maxHeight:"100px"}}
                  onInput={e => { 
                    e.target.style.height = "auto"; 
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; 
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
                <Shield className="h-2.5 md:h-3 w-2.5 md:w-3" />Phone numbers and emails are blocked
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-10 md:h-12 w-10 md:w-12 text-[#D8D5CB] mx-auto mb-3 md:mb-4" />
              <h3 className="text-[14px] md:text-[16px] font-semibold font-['Space_Grotesk',sans-serif]">Select a conversation</h3>
              <p className="text-[12px] md:text-[13px] text-[#9A9488] mt-1">Choose a message to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({
  categories,
  states = DEFAULT_STATES,
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
  const [activeView, setActiveView] = useState("dashboard");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProviderForProfile, setSelectedProviderForProfile] =
    useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const unreadMessages = (conversations || []).filter((c) => c.unread).length;
  const unreadNotifications = (notifications || []).filter(
    (n) => !n.read,
  ).length;
  const badgeCounts = {
    messages: unreadMessages,
    notifications: unreadNotifications,
  };
  const citiesForState =
    state && CITIES_BY_STATE[state] ? CITIES_BY_STATE[state] : [];
  const cats = categories || Object.values(SERVICE_CATEGORIES).flat();

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeView]);

  const handleMessagePro = (pro) => {
    const existingChat = conversations?.find(
      (c) => c.professionalId === pro.id,
    );
    setSelectedChat(
      existingChat || {
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
                <span className="text-[14px] font-semibold font-['Space_Grotesk',sans-serif]">
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
            />
          ) : activeView === "support" ? (
            <SupportTab />
          ) : activeView === "notifications" ? (
            <div className="space-y-2 md:space-y-3">
              {(notifications || []).map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n)}
                  className={`rounded-xl border p-3 md:p-4 cursor-pointer ${n.read ? "bg-white" : "bg-[#FFF8F0] border-[#F0821E]/20"}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${n.kind === "success" ? "bg-[#1E7A34]" : "bg-[#F0821E]"}`}
                    />
                    <div>
                      <p className="text-[13px] md:text-[14px]">{n.text}</p>
                      <p className="text-[11px] md:text-[12px] text-[#9A9488] mt-1">
                        {n.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="rounded-lg border border-dashed border-[#D8D5CB] bg-white p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] md:text-[14px] font-semibold">
                  Profile
                </p>
                <span className="text-[11px] md:text-[12px]">
                  {profileCompletion || 0}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#EFEDE6] mb-4">
                <div
                  className="h-full rounded-full bg-[#1E7A34]"
                  style={{ width: `${profileCompletion || 0}%` }}
                />
              </div>
              <button
                onClick={() => onCompleteProfile?.()}
                className="w-full rounded-md border border-[#1E7A34] py-2 text-[12px] md:text-[13px] font-semibold text-[#1E7A34] hover:bg-[#1E7A34] hover:text-white"
              >
                Complete profile
              </button>
            </div>
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
                  <h1 className="text-[22px] font-semibold font-['Space_Grotesk',sans-serif]">
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
                <p className="mb-2 md:mb-3 text-[11px] md:text-[12px] font-semibold uppercase text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                  Find a trusted professional near you
                </p>
                <div className="grid grid-cols-1 gap-2 md:gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[12px] md:text-[13px]"
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
                    className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[12px] md:text-[13px]"
                  >
                    <option value="">State</option>
                    {states.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[12px] md:text-[13px]"
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
                        <span className="ml-2 text-[12px] md:text-[14px] font-normal text-[#9A9488]">
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
                        className="flex items-center gap-1 text-[11px] md:text-[12px] text-[#55605A] hover:text-[#1E2420]"
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
                      <EmptyState icon={Inbox} title="No conversations yet" />
                    ) : (
                      <div className="divide-y divide-[#E2E0D9] rounded-lg border bg-white">
                        {conversations.slice(0, 3).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSelectedChat(c);
                              setActiveView("messages");
                            }}
                            className="flex w-full items-center gap-3 px-3 md:px-4 py-2 md:py-3 hover:bg-[#F7F6F2]"
                          >
                            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-[#EFEDE6] text-[11px] md:text-[12px] font-semibold">
                              {c.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] md:text-[13px] font-semibold">
                                {c.name}
                                <span className="ml-1.5 text-[#9A9488]">
                                  · {c.trade}
                                </span>
                              </p>
                              <p className="truncate text-[11px] md:text-[12px] text-[#55605A]">
                                {c.preview}
                              </p>
                            </div>
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
                              <p className="text-[10px] md:text-[11px] text-[#55605A]">
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
