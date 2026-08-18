// components/support/SupportChat.jsx
//
// Shared support/complaint chat used by both the customer and provider
// dashboards - a real two-way conversation with admin (backend: SupportThread
// via /api/support/thread), not a one-off report with a faked canned reply.
import { useEffect, useRef, useState } from "react";
import { Flag, AlertCircle, Send } from "lucide-react";
import { friendlyErrorMessage } from "../../utils/apiError";

const API_URL = import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";

function formatTime(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Africa/Lagos" });
  } catch {
    return "";
  }
}

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[#EAE8E1] ${className}`} />;
}

export default function SupportChat() {
  const [thread, setThread] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [reportType, setReportType] = useState("general");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const loadThread = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/support/thread`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setThread(data.data);
    } catch (err) {
      setError("We couldn't load your support conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThread();
    const interval = setInterval(loadThread, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages?.length]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    const token = localStorage.getItem("authToken");
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/support/thread`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject: subject || undefined, type: reportType, text: messageText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setThread(data.data);
      setMessageText("");
    } catch (err) {
      setError(friendlyErrorMessage(err) || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const messages = thread?.messages || [];

  return (
    <div
      className="flex flex-col bg-white rounded-xl border border-[#E2E0D9] overflow-hidden"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 bg-white border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#F0821E]/10 flex items-center justify-center">
            <Flag className="h-5 w-5 text-[#F0821E]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold">Help & Support</p>
            <p className="text-[11px] text-[#9A9488]">Report issues or ask questions</p>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-5 py-3 bg-[#FAFAF8] border-b flex flex-wrap gap-3 flex-shrink-0">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="rounded-lg border px-3 py-2 text-[12px] bg-white"
        >
          <option value="general">General inquiry</option>
          <option value="complaint">Report complaint</option>
          <option value="bug">Report bug</option>
          <option value="suggestion">Suggestion</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief subject (optional)"
          className="flex-1 rounded-lg border px-3 py-2 text-[12px] bg-white min-w-[150px]"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 space-y-4 bg-[#FAFAF8]">
        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <SkeletonBlock key={i} className="h-[52px] max-w-[70%]" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Flag className="h-8 w-8 text-[#D8D5CB] mb-3" />
            <p className="text-[13px] font-semibold">No conversation yet</p>
            <p className="text-[12px] text-[#9A9488] mt-1">
              Send a message below and our team will respond here.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isAdmin = msg.sender === "admin";
            return (
              <div key={msg._id || i} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-2.5 ${isAdmin ? "bg-white border rounded-bl-md shadow-sm" : "bg-[#1E7A34] text-white rounded-br-md"}`}
                >
                  {isAdmin && (
                    <p className="text-[11px] font-semibold text-[#F0821E] mb-1">Support Team</p>
                  )}
                  <p className="text-[13px]">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isAdmin ? "text-[#9A9488]" : "text-white/70"}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="mx-4 md:mx-5 mb-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-[12px] text-red-600 flex-shrink-0">
          {error}
        </div>
      )}
      <div className="px-4 md:px-5 py-2 bg-[#FFF8F0] border-t flex items-center gap-2 text-[11px] text-[#B85E10] flex-shrink-0">
        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
        <span>Messages are reviewed by our team and answered here.</span>
      </div>
      <div className="p-3 md:p-4 bg-white border-t flex-shrink-0">
        <div className="flex items-end gap-2 md:gap-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe your issue..."
            rows={1}
            className="flex-1 rounded-xl border px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] resize-none bg-[#FAFAF8]"
            style={{ minHeight: "44px", maxHeight: "100px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim() || sending}
            className="rounded-xl bg-[#F0821E] p-3 text-white hover:bg-[#D5720F] disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
