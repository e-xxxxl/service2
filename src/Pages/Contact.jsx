// pages/Contact.jsx
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: ["support@9jatradiespages.com", "hello@9jatradiespages.com"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+234 800 000 0000", "Mon - Fri, 9am - 5pm WAT"],
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["Lagos, Nigeria", "Serving all 36 states"],
    },
    {
      icon: Clock,
      title: "Response Time",
      details: ["Within a few hours", "During business days"],
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#E2E0D9] p-8 md:p-12 text-center max-w-md w-full">
          <div className="h-16 w-16 rounded-full bg-[#1E7A34]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-[#1E7A34]" />
          </div>
          <h2 className="text-[22px] font-bold text-[#1E2420] mb-2 font-['Space_Grotesk',sans-serif]">
            Message sent
          </h2>
          <p className="text-[14px] text-[#55605A] mb-6">
            Thank you for reaching out. We'll get back to you within a few hours during business days.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", subject: "", message: "" });
            }}
            className="text-[14px] font-medium text-[#1E7A34] hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
        <Navbar/>
      {/* Header */}
      <section className="bg-white border-b border-[#E2E0D9] pt-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-[#1E7A34] font-['IBM_Plex_Mono',monospace]">
            Get in touch
          </span>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#1E2420] mt-3 mb-4 font-['Space_Grotesk',sans-serif] leading-tight">
            Contact us
          </h1>
          <p className="text-[15px] text-[#55605A] leading-relaxed max-w-xl">
            Have a question, suggestion, or need help? We'd love to hear from you. Our team typically responds within a few hours.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-[20px] font-semibold text-[#1E2420] mb-6 font-['Space_Grotesk',sans-serif]">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[13px] font-semibold text-[#1E2420] mb-2"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-semibold text-[#1E2420] mb-2"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-[13px] font-semibold text-[#1E2420] mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20 transition-all"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General inquiry</option>
                  <option value="account">Account help</option>
                  <option value="verification">Verification question</option>
                  <option value="bug">Report a bug</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[13px] font-semibold text-[#1E2420] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] bg-white focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20 transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E7A34] text-white rounded-lg text-[14px] font-semibold hover:bg-[#166B2C] transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div>
            <h2 className="text-[20px] font-semibold text-[#1E2420] mb-6 font-['Space_Grotesk',sans-serif]">
              Contact information
            </h2>
            <div className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl border border-[#E2E0D9] p-5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-lg bg-[#1E7A34]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-[#1E7A34]" />
                      </div>
                      <h3 className="text-[14px] font-semibold text-[#1E2420]">
                        {item.title}
                      </h3>
                    </div>
                    <div className="pl-12 space-y-0.5">
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-[13px] text-[#55605A]">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="mt-6 bg-white rounded-xl border border-[#E2E0D9] p-5">
              <h3 className="text-[14px] font-semibold text-[#1E2420] mb-3">
                Quick links
              </h3>
              <div className="space-y-2">
                <a
                  href="/faq"
                  className="block text-[13px] text-[#1E7A34] hover:underline"
                >
                  Frequently asked questions
                </a>
                <a
                  href="/privacy-policy"
                  className="block text-[13px] text-[#1E7A34] hover:underline"
                >
                  Privacy policy
                </a>
                <a
                  href="/terms-of-service"
                  className="block text-[13px] text-[#1E7A34] hover:underline"
                >
                  Terms of service
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>   
    </div>
  );
};

export default Contact;