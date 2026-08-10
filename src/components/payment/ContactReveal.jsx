// components/payment/ContactReveal.jsx
//
// Shown in a conversation header once contactUnlocked is true on that
// conversation (server-set, only after a confirmed Paystack payment). The
// actual phone/email is only fetched on demand from the backend's
// contact-reveal endpoint - never shipped as part of the regular message
// payload - so it stays hidden until this component's own request confirms
// the unlock server-side too.
import { useState } from "react";
import { Lock, Phone, Mail, ChevronDown } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";

export default function ContactReveal({ role, conversationId, contactUnlocked }) {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!contactUnlocked) {
    return (
      <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-[#9A9488]">
        <Lock className="h-3 w-3" />
        <span>Contact unlocks after payment</span>
      </div>
    );
  }

  const reveal = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (contact || loading) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/${role}/messages/${conversationId}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load contact");
      setContact(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={reveal}
        className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold text-[#1E7A34] hover:underline"
      >
        <Phone className="h-3 w-3" />
        Contact details
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#E2E0D9] bg-white shadow-lg p-3 z-10 text-left">
          {loading ? (
            <p className="text-[12px] text-[#9A9488]">Loading...</p>
          ) : error ? (
            <p className="text-[12px] text-red-600">{error}</p>
          ) : contact ? (
            <div className="space-y-2">
              {contact.phone && (
                <div className="flex items-center gap-2 text-[12.5px]">
                  <Phone className="h-3.5 w-3.5 text-[#9A9488] flex-shrink-0" />
                  <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2 text-[12.5px]">
                  <Mail className="h-3.5 w-3.5 text-[#9A9488] flex-shrink-0" />
                  <a href={`mailto:${contact.email}`} className="hover:underline break-all">{contact.email}</a>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
