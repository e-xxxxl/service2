// components/dashboard/ProviderDashboard.jsx
import { useState, useRef, useEffect } from "react";
import {
  LayoutGrid,
  MessageCircle,
  Bell,
  User,
  Briefcase,
  Star,
  Clock,
  CheckCircle2,
  Settings,
  LogOut,
  TrendingUp,
  ChevronRight,
  MapPin,
  ToggleLeft,
  ToggleRight,
  X,
  MessageSquare,
  Send,
  Search,
  Shield,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Calculator,
  Wrench,
  Package,
  CreditCard,
  XCircle,
  Edit,
  Save,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoIcon from "../../assets/dashlogo.png";
import { useProviderDashboard } from "../../hooks/useProviderDashboard";
import {
  SERVICE_CATEGORIES,
  CITIES_BY_STATE,
} from "../../constants/serviceCategories";

const NAV_CONFIG = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  {
    id: "messages",
    label: "Messages",
    icon: MessageCircle,
    badgeKey: "messages",
  },
  {
    id: "notifications",
    label: "Alerts",
    icon: Bell,
    badgeKey: "notifications",
  },
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

export default function ProviderDashboard({ onLogout }) {
  const navigate = useNavigate();
  const {
    providerName,
    companyName,
    profileCompletion,
    verificationStatus,
    rejectionReason,
    activeJobs,
    recentMessages,
    notifications,
    stats,
    loading,
    error,
    refetch,
    updateAvailability,
    updateProfile,
    respondToJob,
  } = useProviderDashboard();

  const [activeView, setActiveView] = useState(
    () => sessionStorage.getItem("pvActiveView") || "dashboard",
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    sessionStorage.setItem("pvActiveView", activeView);
  }, [activeView]);

  const unreadMessages = (recentMessages || []).filter((m) => m.unread).length;
  const unreadNotifications = (notifications || []).filter(
    (n) => !n.read,
  ).length;
  const badgeCounts = {
    messages: unreadMessages,
    notifications: unreadNotifications,
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userAccountType");
    window.location.href = "/login";
  };
  const handleResubmit = () => navigate("/provider/setup?resubmit=true");

  return (
    <div className="min-h-screen w-full bg-[#F5F4F0] text-[#1E2420] font-['Inter',sans-serif]">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col justify-between border-r border-[#E2E0D9] bg-white px-4 py-6 md:flex">
          <div>
            <div className="mb-8 flex items-center gap-3 px-2">
              <img
                src={logoIcon}
                alt="logo"
                className="h-8 w-8 shrink-0 object-contain"
              />
              <div>
                <span className="text-[14px] font-semibold">
                  9jaTradiesPages
                </span>
                <p className="text-[10px] text-[#9A9488]">Provider Portal</p>
              </div>
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
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${isActive ? "bg-[#1E7A34] text-white shadow-sm" : "text-[#55605A] hover:bg-[#F7F6F2] hover:text-[#1E2420]"}`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {badge > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isActive ? "bg-[#F0821E] text-white" : "bg-[#FBE0C4] text-[#B85E10]"}`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="space-y-3">
            <div
              className={`rounded-lg p-3 ${verificationStatus === "approved" ? "bg-[#1E7A34]/10 border border-[#1E7A34]/20" : verificationStatus === "rejected" ? "bg-red-50 border border-red-200" : verificationStatus === "submitted" ? "bg-[#FFF8F0] border border-[#F0821E]/20" : "bg-[#F7F6F2]"}`}
            >
              <div className="flex items-center gap-2">
                {verificationStatus === "approved" && (
                  <CheckCircle2 className="h-4 w-4 text-[#1E7A34]" />
                )}
                {verificationStatus === "rejected" && (
                  <X className="h-4 w-4 text-red-500" />
                )}
                {verificationStatus === "submitted" && (
                  <Clock className="h-4 w-4 text-[#F0821E]" />
                )}
                {(!verificationStatus || verificationStatus === "pending") && (
                  <AlertCircle className="h-4 w-4 text-[#9A9488]" />
                )}
                <span className="text-[11px] font-semibold">
                  {verificationStatus === "approved"
                    ? "Verified"
                    : verificationStatus === "rejected"
                      ? "Rejected"
                      : verificationStatus === "submitted"
                        ? "Under Review"
                        : "Setup Required"}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-[#F7F6F2] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0821E] text-[14px] font-semibold text-white">
                  {providerName?.[0] || companyName?.[0] || "P"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">
                    {providerName || "Provider"}
                  </p>
                  <p className="truncate text-[11px] text-[#9A9488]">
                    {companyName}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveView("profile")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#F7F6F2]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#DC2626] hover:bg-[#FEF2F2]"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {activeView === "dashboard" && (
            <DashboardView
              providerName={providerName}
              companyName={companyName}
              isAvailable={isAvailable}
              onToggleAvailability={() => {
                const s = !isAvailable;
                setIsAvailable(s);
                updateAvailability?.(s);
              }}
              profileCompletion={profileCompletion}
              verificationStatus={verificationStatus}
              rejectionReason={rejectionReason}
              stats={stats}
              activeJobs={activeJobs}
              recentMessages={recentMessages}
              notifications={notifications}
              loading={loading}
              error={error}
              refetch={refetch}
              onRespondToJob={respondToJob}
              onNavigate={setActiveView}
              onResubmit={handleResubmit}
              onSelectConversation={(conv) => {
                setSelectedConversation(conv);
                setActiveView("messages");
              }}
            />
          )}
          {activeView === "messages" && (
            <MessagesView
              recentMessages={recentMessages}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
              refetch={refetch}
            />
          )}
          {activeView === "notifications" && (
            <NotificationsView
              notifications={notifications}
              loading={loading}
              markNotificationRead={async (n) => {
                try {
                  const token = localStorage.getItem("authToken");
                  const API_URL =
                    import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
                  await fetch(
                    `${API_URL}/provider/notifications/${n.id}/read`,
                    {
                      method: "PATCH",
                      headers: { Authorization: `Bearer ${token}` },
                    },
                  );
                  refetch?.();
                } catch (e) {}
              }}
            />
          )}
          {activeView === "profile" && (
            <ProfileView
              providerName={providerName}
              companyName={companyName}
              profileCompletion={profileCompletion}
              verificationStatus={verificationStatus}
              rejectionReason={rejectionReason}
              onUpdateProfile={updateProfile}
              onResubmit={handleResubmit}
            />
          )}
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#E2E0D9] bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        {NAV_CONFIG.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const badge = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="relative flex flex-col items-center gap-1 px-2 py-1"
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "text-[#1E2420]" : "text-[#9A9488]"}`}
              />
              <span
                className={`text-[10px] font-medium ${isActive ? "text-[#1E2420]" : "text-[#9A9488]"}`}
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

function DashboardView({
  providerName,
  companyName,
  isAvailable,
  onToggleAvailability,
  profileCompletion,
  verificationStatus,
  rejectionReason,
  stats,
  activeJobs,
  recentMessages,
  notifications,
  loading,
  error,
  refetch,
  onRespondToJob,
  onNavigate,
  onResubmit,
  onSelectConversation,
}) {
  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-[12px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="text-[24px] font-semibold">
            Welcome back, {providerName || "Pro"}
          </h1>
          {companyName && (
            <p className="text-[14px] text-[#55605A] mt-1">{companyName}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAvailability}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold ${isAvailable ? "bg-[#1E7A34]/10 text-[#1E7A34] border border-[#1E7A34]/20" : "bg-[#EFEDE6] text-[#55605A] border border-[#E2E0D9]"}`}
          >
            {isAvailable ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
            {isAvailable ? "Available" : "Unavailable"}
          </button>
          <button
            onClick={() => onNavigate("notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E0D9] bg-white"
          >
            <Bell className="h-4 w-4" />
            {(notifications || []).filter((n) => !n.read).length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#F0821E]" />
            )}
          </button>
        </div>
      </div>

      {(!verificationStatus || verificationStatus === "pending") && (
        <div className="mb-6 rounded-xl border-2 border-[#F0821E] bg-[#FFF8F0] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0821E]/10">
              <AlertCircle className="h-6 w-6 text-[#F0821E]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold">
                Complete Your Profile Setup
              </h3>
              <p className="text-[13px] text-[#55605A] mt-1">
                Complete your profile to become visible to customers.
              </p>
              <button
                onClick={() => onNavigate("profile")}
                className="mt-4 rounded-lg bg-[#F0821E] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#D5720F] flex items-center gap-2"
              >
                Setup Profile <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px]">Progress</span>
              <span className="text-[12px] font-semibold">
                {profileCompletion || 0}%
              </span>
            </div>
            <div className="h-2 w-full bg-[#FBE0C4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F0821E] transition-all"
                style={{ width: `${profileCompletion || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
      {verificationStatus === "submitted" && (
        <div className="mb-6 rounded-xl border border-[#F0821E]/20 bg-[#FFF8F0] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0821E]/10">
              <Clock className="h-6 w-6 text-[#F0821E]" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold">
                Verification In Progress
              </h3>
              <p className="text-[13px] text-[#55605A] mt-1">
                Your profile is under review.
              </p>
            </div>
          </div>
        </div>
      )}
      {verificationStatus === "rejected" && (
        <div className="mb-6 rounded-xl border-2 border-red-300 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-red-700">
                Verification Rejected
              </h3>
              {rejectionReason && (
                <div className="mt-3 bg-white border border-red-200 rounded-lg p-4">
                  <p className="text-[12px] font-semibold text-red-700 mb-1">
                    Reason:
                  </p>
                  <p className="text-[13px] text-red-600">{rejectionReason}</p>
                </div>
              )}
              <button
                onClick={onResubmit}
                className="mt-4 rounded-lg bg-[#1E7A34] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#166B2C] flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Resubmit
              </button>
            </div>
          </div>
        </div>
      )}
      {verificationStatus === "approved" && (
        <div className="mb-6 rounded-xl border border-[#1E7A34]/20 bg-[#1E7A34]/5 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-[#1E7A34]" />
            <div>
              <p className="text-[14px] font-semibold text-[#1E7A34]">
                Verified Provider
              </p>
              <p className="text-[12px] text-[#55605A]">
                Your profile is visible to customers.
              </p>
            </div>
          </div>
        </div>
      )}

      {verificationStatus === "approved" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Briefcase}
            label="Active Jobs"
            value={stats?.activeJobs || 0}
            color="green"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats?.completedJobs || 0}
            color="blue"
          />
          <StatCard
            icon={Star}
            label="Rating"
            value={stats?.rating || "0.0"}
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            label="Response Rate"
            value={`${stats?.responseRate || 0}%`}
            color="purple"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Section title="Active Jobs">
            {loading?.jobs ? (
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <SkeletonBlock key={i} className="h-[120px]" />
                ))}
              </div>
            ) : (activeJobs || []).length === 0 ? (
              <EmptyState icon={Briefcase} title="No active jobs yet" />
            ) : (
              <div className="space-y-4">
                {activeJobs.slice(0, 3).map((job) => (
                  <JobCard key={job.id} job={job} onRespond={onRespondToJob} />
                ))}
              </div>
            )}
          </Section>
        </div>
        <div>
          <Section
            title="Messages"
            action={{
              label: "Open Inbox",
              onClick: () => onNavigate("messages"),
            }}
          >
            {loading?.messages ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <SkeletonBlock key={i} className="h-[64px]" />
                ))}
              </div>
            ) : (recentMessages || []).length === 0 ? (
              <EmptyState icon={MessageSquare} title="No messages" />
            ) : (
              <div className="space-y-2">
                {recentMessages.map((msg) => (
                  <MessagePreview
                    key={msg.id}
                    message={msg}
                    onClick={() => onSelectConversation?.(msg)}
                  />
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function ProfileView({
  providerName,
  companyName,
  profileCompletion,
  verificationStatus,
  rejectionReason,
  onUpdateProfile,
  onResubmit,
}) {
  const [pd, setPd] = useState({
    companyName: "",
    serviceType: "",
    tagline: "",
    businessDescription: "",
    yearsOfExperience: 0,
    teamSize: 1,
    ninNumber: "",
    businessAddress: { street: "", city: "", state: "" },
    phone: "",
  });
  const [ninDoc, setNinDoc] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [activeSection, setActiveSection] = useState("verification");
  const [saving, setSaving] = useState(false);
  const [sm, setSm] = useState("");
  const [em, setEm] = useState("");
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const sections = [
    { id: "verification", label: "Verification", icon: Shield },
    { id: "basic", label: "Basic Info", icon: User },
    { id: "address", label: "Address", icon: MapPin },
  ];

  // ✅ Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const API_URL =
          import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
        const res = await fetch(`${API_URL}/provider/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const d = data.data;
          setPd({
            companyName: d.companyName || "",
            serviceType: d.serviceType || "",
            tagline: d.tagline || "",
            businessDescription: d.businessDescription || "",
            yearsOfExperience: d.yearsOfExperience || 0,
            teamSize: d.teamSize || 1,
            ninNumber: d.nin?.number || "",
            businessAddress: {
              street: d.businessAddress?.street || "",
              city: d.city || d.businessAddress?.city || "",
              state: d.state || d.businessAddress?.state || "",
            },
            phone: d.phone || "",
          });
          // Auto-enable editing if fields are empty
          if (!d.companyName && !d.businessDescription) setEditingBasic(true);
          if (!d.businessAddress?.city && !d.businessAddress?.state)
            setEditingAddress(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, []);

  const handleBusinessDescChange = (e) => {
    // ✅ Remove phone numbers and emails from business description
    const value = e.target.value;
    const cleaned = value
      .replace(/\b\d{10,}\b/g, "")
      .replace(/[\d]{3}[-.]?[\d]{3}[-.]?[\d]{4}/g, "")
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "");
    setPd((p) => ({ ...p, businessDescription: cleaned }));
  };

  const handleSave = async (section) => {
    setSaving(true);
    setSm("");
    setEm("");
    try {
      if (section === "verification") {
        const fd = new FormData();
        fd.append("serviceType", pd.serviceType);
        fd.append("tagline", pd.tagline);
        fd.append("ninNumber", pd.ninNumber);
        fd.append("city", pd.businessAddress.city);
        fd.append("state", pd.businessAddress.state);
        fd.append("phone", pd.phone);
        if (ninDoc) fd.append("ninDocument", ninDoc);
        if (selfie) fd.append("selfiePhoto", selfie);
        const t = localStorage.getItem("authToken");
        const API_URL =
          import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
        const res = await fetch(`${API_URL}/provider/setup-profile`, {
          method: "POST",
          headers: { Authorization: `Bearer ${t}` },
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
      } else {
        let d = {};
        if (section === "basic")
          d = {
            companyName: pd.companyName,
            businessDescription: pd.businessDescription,
            yearsOfExperience: pd.yearsOfExperience,
            teamSize: pd.teamSize,
          };
        if (section === "address")
          d = {
            businessAddress: pd.businessAddress,
            city: pd.businessAddress.city,
            state: pd.businessAddress.state,
          };
        await onUpdateProfile?.({ section, data: d });
      }
      setSm("Updated!");
      setEditingBasic(false);
      setEditingAddress(false);
      setTimeout(() => setSm(""), 3000);
    } catch (error) {
      setEm(error.message);
      setTimeout(() => setEm(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      {sm && (
        <div className="mb-4 rounded-lg bg-[#1E7A34]/10 border border-[#1E7A34]/20 px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#1E7A34]" />
          <p className="text-[13px] text-[#1E7A34] font-medium">{sm}</p>
        </div>
      )}
      {em && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
          <X className="h-4 w-4 text-red-600" />
          <p className="text-[13px] text-red-600 font-medium">{em}</p>
        </div>
      )}

      <div
        className={`mb-8 rounded-xl border p-6 ${verificationStatus === "approved" ? "bg-[#1E7A34]/5 border-[#1E7A34]/20" : verificationStatus === "rejected" ? "bg-red-50 border-red-200" : verificationStatus === "submitted" ? "bg-[#FFF8F0] border-[#F0821E]/20" : "bg-white border-[#E2E0D9]"}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center ${verificationStatus === "approved" ? "bg-[#1E7A34]/10" : verificationStatus === "rejected" ? "bg-red-100" : verificationStatus === "submitted" ? "bg-[#F0821E]/10" : "bg-[#EFEDE6]"}`}
          >
            {verificationStatus === "approved" && (
              <CheckCircle2 className="h-7 w-7 text-[#1E7A34]" />
            )}
            {verificationStatus === "rejected" && (
              <X className="h-7 w-7 text-red-500" />
            )}
            {verificationStatus === "submitted" && (
              <Clock className="h-7 w-7 text-[#F0821E]" />
            )}
            {(!verificationStatus || verificationStatus === "pending") && (
              <AlertCircle className="h-7 w-7 text-[#9A9488]" />
            )}
          </div>
          <div>
            <h3 className="text-[16px] font-semibold">
              {verificationStatus === "approved"
                ? "Verified"
                : verificationStatus === "rejected"
                  ? "Rejected"
                  : verificationStatus === "submitted"
                    ? "Under Review"
                    : "Complete Your Profile"}
            </h3>
            <p className="text-[13px] text-[#55605A] mt-1">
              {verificationStatus === "approved"
                ? "Visible to customers."
                : verificationStatus === "rejected"
                  ? `Reason: ${rejectionReason || "Not specified"}`
                  : verificationStatus === "submitted"
                    ? "Being reviewed."
                    : "Fill required info to submit."}
            </p>
            {rejectionReason && verificationStatus === "rejected" && (
              <button
                onClick={onResubmit}
                className="mt-3 rounded-lg bg-[#1E7A34] px-4 py-2 text-[12px] font-semibold text-white"
              >
                Resubmit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-[200px] shrink-0 hidden md:block">
          <nav className="space-y-1 sticky top-24">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    setSm("");
                    setEm("");
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium ${isActive ? "bg-[#1E7A34] text-white shadow-sm" : "text-[#55605A] hover:bg-[#F7F6F2]"}`}
                >
                  <Icon className="h-4 w-4" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex md:hidden gap-2 mb-4 overflow-x-auto pb-2">
          {sections.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-4 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap ${isActive ? "bg-[#1E7A34] text-white" : "bg-white border text-[#55605A]"}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          {activeSection === "verification" && (
            <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
              {verificationStatus === "approved" ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-[#1E7A34]/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-[#1E7A34]" />
                  </div>
                  <h2 className="text-[18px] font-semibold mb-2">
                    Profile Verified
                  </h2>
                  <p className="text-[14px] text-[#55605A]">
                    Your profile is verified and visible.
                  </p>
                </div>
              ) : verificationStatus === "submitted" ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-[#F0821E]/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-[#F0821E]" />
                  </div>
                  <h2 className="text-[18px] font-semibold mb-2">
                    Under Review
                  </h2>
                  <p className="text-[14px] text-[#55605A]">
                    Documents being reviewed.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-[18px] font-semibold mb-6">
                    Verification Required
                  </h2>
                  <p className="text-[13px] text-[#55605A] mb-6">
                    Fill all fields to submit.
                  </p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        Service Type *
                      </label>
                      <select
                        value={pd.serviceType}
                        onChange={(e) =>
                          setPd((p) => ({ ...p, serviceType: e.target.value }))
                        }
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      >
                        <option value="">Select service</option>
                        {Object.entries(SERVICE_CATEGORIES).map(([g, s]) => (
                          <optgroup key={g} label={g}>
                            {s.map((x) => (
                              <option key={x} value={x.toLowerCase()}>
                                {x}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        Tagline *
                      </label>
                      <input
                        type="text"
                        value={pd.tagline}
                        onChange={(e) =>
                          setPd((p) => ({ ...p, tagline: e.target.value }))
                        }
                        maxLength={200}
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                        placeholder="A short description"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        NIN Number *
                      </label>
                      <input
                        type="text"
                        value={pd.ninNumber}
                        onChange={(e) =>
                          setPd((p) => ({ ...p, ninNumber: e.target.value }))
                        }
                        maxLength={11}
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                        placeholder="11-digit NIN"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        NIN Document *
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setNinDoc(e.target.files[0])}
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        Selfie Photo *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelfie(e.target.files[0])}
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold mb-2">
                          State *
                        </label>
                        <select
                          value={pd.businessAddress.state}
                          onChange={(e) =>
                            setPd((p) => ({
                              ...p,
                              businessAddress: {
                                ...p.businessAddress,
                                state: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border px-4 py-3 text-[14px]"
                        >
                          <option value="">Select state</option>
                          {Object.keys(CITIES_BY_STATE).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold mb-2">
                          City *
                        </label>
                        <select
                          value={pd.businessAddress.city}
                          onChange={(e) =>
                            setPd((p) => ({
                              ...p,
                              businessAddress: {
                                ...p.businessAddress,
                                city: e.target.value,
                              },
                            }))
                          }
                          disabled={!pd.businessAddress.state}
                          className="w-full rounded-lg border px-4 py-3 text-[14px] disabled:opacity-50"
                        >
                          <option value="">Select city</option>
                          {(
                            CITIES_BY_STATE[pd.businessAddress.state] || []
                          ).map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={pd.phone}
                        onChange={(e) =>
                          setPd((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => handleSave("verification")}
                      disabled={saving}
                      className="rounded-lg bg-[#F0821E] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#D5720F] disabled:opacity-50"
                    >
                      {saving ? "Submitting..." : "Submit for Verification"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeSection === "basic" && (
            <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold">Basic Information</h2>
                <button
                  onClick={() => {
                    if (editingBasic) handleSave("basic");
                    else setEditingBasic(true);
                  }}
                  className="text-[13px] text-[#1E7A34] font-medium flex items-center gap-1"
                >
                  {editingBasic ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold mb-2">
                    Company Name
                  </label>
                  {editingBasic ? (
                    <input
                      type="text"
                      value={pd.companyName}
                      onChange={(e) =>
                        setPd((p) => ({ ...p, companyName: e.target.value }))
                      }
                      className="w-full rounded-lg border px-4 py-3 text-[14px]"
                    />
                  ) : (
                    <p className="text-[14px] text-[#1E2420] bg-[#F7F6F2] rounded-lg px-4 py-3">
                      {pd.companyName || "Click Edit to add"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-2">
                    Tagline
                  </label>
                  {editingBasic ? (
                    <input
                      type="text"
                      value={pd.tagline}
                      onChange={(e) =>
                        setPd((p) => ({ ...p, tagline: e.target.value }))
                      }
                      maxLength={200}
                      className="w-full rounded-lg border px-4 py-3 text-[14px]"
                    />
                  ) : (
                    <p className="text-[14px] text-[#1E2420] bg-[#F7F6F2] rounded-lg px-4 py-3">
                      {pd.tagline || "Click Edit to add"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-2">
                    Business Description
                  </label>
                  {editingBasic ? (
                    <textarea
                      rows={4}
                      value={pd.businessDescription}
                      onChange={handleBusinessDescChange}
                      className="w-full rounded-lg border px-4 py-3 text-[14px] resize-none"
                    />
                  ) : (
                    <p className="text-[14px] text-[#1E2420] bg-[#F7F6F2] rounded-lg px-4 py-3">
                      {pd.businessDescription || "Click Edit to add"}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">
                      Years of Exp.
                    </label>
                    {editingBasic ? (
                      <input
                        type="number"
                        value={pd.yearsOfExperience}
                        onChange={(e) =>
                          setPd((p) => ({
                            ...p,
                            yearsOfExperience: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      />
                    ) : (
                      <p className="text-[14px] text-[#1E2420] bg-[#F7F6F2] rounded-lg px-4 py-3">
                        {pd.yearsOfExperience || "0"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">
                      Team Size
                    </label>
                    {editingBasic ? (
                      <input
                        type="number"
                        value={pd.teamSize}
                        onChange={(e) =>
                          setPd((p) => ({
                            ...p,
                            teamSize: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      />
                    ) : (
                      <p className="text-[14px] text-[#1E2420] bg-[#F7F6F2] rounded-lg px-4 py-3">
                        {pd.teamSize || "1"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {editingBasic && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setEditingBasic(false)}
                    className="flex-1 py-3 rounded-xl border text-[14px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave("basic")}
                    disabled={saving}
                    className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === "address" && (
            <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold">Address</h2>
                <button
                  onClick={() => {
                    if (editingAddress) handleSave("address");
                    else setEditingAddress(true);
                  }}
                  className="text-[13px] text-[#1E7A34] font-medium flex items-center gap-1"
                >
                  {editingAddress ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold mb-2">
                    Street
                  </label>
                  {editingAddress ? (
                    <input
                      type="text"
                      value={pd.businessAddress.street}
                      onChange={(e) =>
                        setPd((p) => ({
                          ...p,
                          businessAddress: {
                            ...p.businessAddress,
                            street: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-lg border px-4 py-3 text-[14px]"
                    />
                  ) : (
                    <p className="text-[14px] text-[#1E2420] bg-[#F7F6F2] rounded-lg px-4 py-3">
                      {pd.businessAddress.street || "Click Edit to add"}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">
                      City
                    </label>
                    {editingAddress ? (
                      <select
                        value={pd.businessAddress.city}
                        onChange={(e) =>
                          setPd((p) => ({
                            ...p,
                            businessAddress: {
                              ...p.businessAddress,
                              city: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      >
                        <option value="">Select</option>
                        {(CITIES_BY_STATE[pd.businessAddress.state] || []).map(
                          (c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ),
                        )}
                      </select>
                    ) : (
                      <p className="text-[14px] text-[#1E2420] bg-[#F7F6F2] rounded-lg px-4 py-3">
                        {pd.businessAddress.city || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">
                      State
                    </label>
                    {editingAddress ? (
                      <select
                        value={pd.businessAddress.state}
                        onChange={(e) =>
                          setPd((p) => ({
                            ...p,
                            businessAddress: {
                              ...p.businessAddress,
                              state: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      >
                        <option value="">Select</option>
                        {Object.keys(CITIES_BY_STATE).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[14px] text-[#1E2420] bg-[#F7F6F2] rounded-lg px-4 py-3">
                        {pd.businessAddress.state || "Not set"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {editingAddress && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setEditingAddress(false)}
                    className="flex-1 py-3 rounded-xl border text-[14px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave("address")}
                    disabled={saving}
                    className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== MESSAGES VIEW ==========
function MessagesView({
  recentMessages,
  selectedConversation,
  onSelectConversation,
  newMessage,
  onNewMessageChange,
  refetch,
}) {
  const [chatMessages, setChatMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [warning, setWarning] = useState("");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);
  useEffect(() => {
    if (selectedConversation?.id) {
      fetchMessages(selectedConversation.id);
      refetch?.();
    }
  }, [selectedConversation]);

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL =
        import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
      const res = await fetch(`${API_URL}/provider/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const conv = data.data.find((c) => c.id === conversationId);
        setChatMessages(conv?.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!newMessage?.trim() || !selectedConversation) return;
    if (
      /\b\d{10,}\b/.test(newMessage) ||
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(newMessage)
    ) {
      setWarning("Contact info not allowed.");
      setTimeout(() => setWarning(""), 5000);
      return;
    }
    setSending(true);
    try {
      const token = localStorage.getItem("authToken");
      const API_URL =
        import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
      const res = await fetch(
        `${API_URL}/provider/messages/${selectedConversation.customerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newMessage }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: newMessage,
          sender: "me",
          senderModel: "ServiceProvider",
          messageType: "text",
          createdAt: new Date().toISOString(),
        },
      ]);
      onNewMessageChange?.("");
    } catch (err) {
      setWarning(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendQuote = async (quoteData) => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL =
        import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
      const res = await fetch(
        `${API_URL}/provider/send-quote/${selectedConversation.customerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quoteData),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchMessages(selectedConversation.id);
      setShowQuoteModal(false);
    } catch (err) {
      setWarning(err.message);
    }
  };

  const gi = (n) =>
    n
      ? n
          .split(" ")
          .map((x) => x[0])
          .join("")
          .toUpperCase()
      : "C";

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl z-10 flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="text-[16px] font-semibold">Send Quote</h3>
                <p className="text-[12px] text-[#9A9488]">
                  To: {selectedConversation?.customerName}
                </p>
              </div>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#F7F6F2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <QuoteForm
              customerName={selectedConversation?.customerName}
              onSend={handleSendQuote}
              onCancel={() => setShowQuoteModal(false)}
            />
          </div>
        </div>
      )}

      <div className="w-[360px] border-r border-[#E2E0D9] bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-[18px] font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-[13px]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {(recentMessages || []).length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-8 w-8 text-[#9A9488] mx-auto mb-3" />
              <p className="text-[14px]">No messages yet</p>
            </div>
          ) : (
            recentMessages.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectConversation?.(m)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-[#F7F6F2] border-b ${selectedConversation?.id === m.id ? "bg-[#F7F6F2]" : ""}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E7A34] text-[14px] font-semibold text-white">
                  {gi(m.customerName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-[14px] font-semibold">
                      {m.customerName}
                    </p>
                    <span className="text-[11px] text-[#9A9488]">
                      {formatNigerianDate(m.time)}
                    </span>
                  </div>
                  <p className="truncate text-[12px] mt-1">{m.preview}</p>
                </div>
                {m.unread && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F0821E] mt-2" />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#F5F4F0]">
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E7A34] text-[14px] font-semibold text-white">
                  {gi(selectedConversation.customerName)}
                </div>
                <div>
                  <p className="text-[14px] font-semibold">
                    {selectedConversation.customerName}
                  </p>
                  <p className="text-[12px] text-[#55605A]">Customer</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-2 bg-[#FFF8F0] border-b flex items-center gap-2 text-[11px] text-[#B85E10]">
              <Shield className="h-3.5 w-3.5" />
              Keep communication on the platform.
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[14px] text-[#9A9488]">
                    No messages yet. Start the conversation or send a quote!
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, i) => {
                  const isQuoteType = [
                    "quote",
                    "quote_accepted",
                    "quote_rejected",
                    "payment_requested",
                    "payment_confirmed",
                  ].includes(msg.messageType);
                  if (isQuoteType)
                    return (
                      <div
                        key={msg.id || i}
                        className="flex justify-center my-3"
                      >
                        <ProviderQuoteBubble message={msg} />
                      </div>
                    );
                  const isMine =
                    msg.sender === "me" ||
                    msg.senderModel === "ServiceProvider";
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMine ? "bg-[#1E7A34] text-white" : "bg-white border shadow-sm"}`}
                      >
                        <p className="text-[14px]">{msg.text}</p>
                        <p
                          className={`text-[10px] mt-1 ${isMine ? "text-white/70" : "text-[#9A9488]"}`}
                        >
                          {formatNigerianTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            {warning && (
              <div className="mx-4 mb-2 rounded-lg bg-red-50 border px-4 py-3 text-[12px] text-red-600 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{warning}</span>
                <button onClick={() => setWarning("")}>
                  <X className="h-3.5 w-3.5 text-red-400" />
                </button>
              </div>
            )}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#1E7A34]/10 text-[#1E7A34] text-[12px] font-semibold hover:bg-[#1E7A34]/20 flex items-center gap-1.5"
                >
                  <Calculator className="h-4 w-4" />
                  Send Quote
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => onNewMessageChange?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newMessage.trim()) handleSend();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border px-4 py-3 text-[14px]"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage?.trim() || sending}
                  className="rounded-lg bg-[#1E7A34] p-3 text-white hover:bg-[#166B2C] disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-[#9A9488] mx-auto mb-4" />
              <h3 className="text-[18px] font-semibold">
                Select a conversation
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== PROVIDER QUOTE BUBBLE ==========
function ProviderQuoteBubble({ message }) {
  const quote = message.quote;
  const payment = message.payment;
  if (message.messageType === "payment_confirmed")
    return (
      <div className="bg-[#1E7A34]/5 border-2 border-[#1E7A34]/30 rounded-2xl p-5 max-w-[320px]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-[#1E7A34]/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-[#1E7A34]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#1E7A34]">
              Booking Confirmed!
            </p>
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-[13px]">
            <span>Amount</span>
            <span className="font-bold">
              ₦{(payment?.amount || quote?.totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  if (message.messageType === "payment_requested")
    return (
      <div className="bg-white border-2 border-[#F0821E]/20 rounded-2xl p-5 max-w-[320px]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-[#F0821E]/10 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-[#F0821E]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold">Awaiting Payment</p>
          </div>
        </div>
        <div className="bg-[#F7F6F2] rounded-xl p-3">
          <div className="flex justify-between">
            <span>Amount</span>
            <span className="text-[18px] font-bold">
              ₦{(payment?.amount || quote?.totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  if (message.messageType === "quote_accepted")
    return (
      <div className="bg-[#1E7A34]/5 border border-[#1E7A34]/20 rounded-2xl p-4 max-w-[300px]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#1E7A34]" />
          <span className="text-[13px] font-semibold text-[#1E7A34]">
            Quote Accepted
          </span>
        </div>
      </div>
    );
  if (message.messageType === "quote_rejected")
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-[300px]">
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-[13px] font-semibold text-red-500">
            Quote Declined
          </span>
        </div>
        {quote?.rejectionReason && (
          <p className="text-[12px] text-red-400 mt-1">
            {quote.rejectionReason}
          </p>
        )}
      </div>
    );
  return (
    <div className="bg-white border-2 border-[#1E7A34]/20 rounded-2xl p-5 max-w-[340px] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-[#1E7A34]/10 flex items-center justify-center">
          <Calculator className="h-5 w-5 text-[#1E7A34]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold">Quote Sent</p>
          {quote?.status === "accepted" && (
            <span className="text-[11px] text-[#1E7A34]">Accepted</span>
          )}
          {quote?.status === "rejected" && (
            <span className="text-[11px] text-red-500">Declined</span>
          )}
          {quote?.status === "pending" && (
            <span className="text-[11px] text-[#F0821E]">Awaiting</span>
          )}
        </div>
      </div>
      {quote?.serviceDescription && (
        <div className="bg-[#F7F6F2] rounded-xl p-3 mb-3">
          <div className="flex items-start gap-2">
            <Wrench className="h-4 w-4 text-[#1E7A34] mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold mb-1">Service</p>
              <p className="text-[13px]">{quote.serviceDescription}</p>
            </div>
          </div>
        </div>
      )}
      {quote?.materials && (
        <div className="bg-[#F7F6F2] rounded-xl p-3 mb-3">
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-[#1E7A34] mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold mb-1">Materials</p>
              <p className="text-[13px]">{quote.materials}</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2 mb-3">
        {(quote?.laborCost || 0) > 0 && (
          <div className="flex justify-between text-[13px]">
            <span>Labor</span>
            <span className="font-medium">
              ₦{(quote.laborCost || 0).toLocaleString()}
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
        {(quote?.additionalFees || 0) > 0 && (
          <div className="flex justify-between text-[13px]">
            <span>Fees</span>
            <span className="font-medium">
              ₦{(quote.additionalFees || 0).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      <div className="bg-[#1E7A34]/5 rounded-xl p-3 flex items-center justify-between">
        <span className="text-[14px] font-semibold">Total</span>
        <span className="text-[20px] font-bold text-[#1E7A34]">
          ₦{(quote?.totalAmount || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ========== QUOTE FORM ==========
function QuoteForm({ customerName, onSend, onCancel }) {
  const [fd, setFd] = useState({
    serviceDescription: "",
    materials: "",
    laborCost: "",
    materialCost: "",
    additionalFees: "",
  });
  const [loading, setLoading] = useState(false);
  const total =
    (Number(fd.laborCost) || 0) +
    (Number(fd.materialCost) || 0) +
    (Number(fd.additionalFees) || 0);
  return (
    <div className="p-5 space-y-5">
      <div className="bg-[#F7F6F2] rounded-xl p-3 text-center">
        <p className="text-[12px] text-[#9A9488]">Quote for</p>
        <p className="text-[14px] font-semibold">{customerName}</p>
      </div>
      <div>
        <label className="flex items-center gap-2 text-[13px] font-semibold mb-2">
          <Wrench className="h-4 w-4 text-[#1E7A34]" />
          Service *
        </label>
        <textarea
          name="serviceDescription"
          value={fd.serviceDescription}
          onChange={(e) =>
            setFd((p) => ({ ...p, serviceDescription: e.target.value }))
          }
          rows={3}
          className="w-full rounded-xl border px-4 py-3 text-[14px] resize-none bg-[#FAFAF8]"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-[13px] font-semibold mb-2">
          <Package className="h-4 w-4 text-[#1E7A34]" />
          Materials
        </label>
        <textarea
          name="materials"
          value={fd.materials}
          onChange={(e) => setFd((p) => ({ ...p, materials: e.target.value }))}
          rows={2}
          className="w-full rounded-xl border px-4 py-3 text-[14px] resize-none bg-[#FAFAF8]"
        />
      </div>
      <div className="bg-[#F7F6F2] rounded-xl p-4 space-y-3">
        <h4 className="text-[13px] font-semibold">Cost</h4>
        <div>
          <label className="text-[12px] mb-1 block">Labor (₦)</label>
          <input
            type="number"
            name="laborCost"
            value={fd.laborCost}
            onChange={(e) =>
              setFd((p) => ({ ...p, laborCost: e.target.value }))
            }
            min="0"
            className="w-full rounded-lg border px-4 py-2.5 text-[14px] bg-white"
          />
        </div>
        <div>
          <label className="text-[12px] mb-1 block">Materials (₦)</label>
          <input
            type="number"
            name="materialCost"
            value={fd.materialCost}
            onChange={(e) =>
              setFd((p) => ({ ...p, materialCost: e.target.value }))
            }
            min="0"
            className="w-full rounded-lg border px-4 py-2.5 text-[14px] bg-white"
          />
        </div>
        <div>
          <label className="text-[12px] mb-1 block">Fees (₦)</label>
          <input
            type="number"
            name="additionalFees"
            value={fd.additionalFees}
            onChange={(e) =>
              setFd((p) => ({ ...p, additionalFees: e.target.value }))
            }
            min="0"
            className="w-full rounded-lg border px-4 py-2.5 text-[14px] bg-white"
          />
        </div>
        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-[14px] font-semibold">Total</span>
          <span className="text-[22px] font-bold text-[#1E7A34]">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border text-[14px] font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (!fd.serviceDescription.trim() || total <= 0) return;
            setLoading(true);
            try {
              await onSend?.(fd);
              onCancel?.();
            } catch (e) {
            } finally {
              setLoading(false);
            }
          }}
          disabled={!fd.serviceDescription.trim() || total <= 0 || loading}
          className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Quote"}
        </button>
      </div>
    </div>
  );
}

// ========== NOTIFICATIONS VIEW ==========
function NotificationsView({ notifications, loading, markNotificationRead }) {
  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <h2 className="text-[24px] font-semibold mb-6">Notifications</h2>
      <div className="space-y-3">
        {loading?.notifications ? (
          [0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-[80px]" />
          ))
        ) : (notifications || []).length === 0 ? (
          <EmptyState icon={Bell} title="All caught up" />
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead?.(n)}
              className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${n.read ? "bg-white opacity-70" : "bg-[#FFF8F0] border-[#F0821E]/20"}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${n.read ? "bg-[#9A9488]" : n.kind === "success" ? "bg-[#1E7A34]" : "bg-[#F0821E]"}`}
                />
                <div className="flex-1">
                  <p className="text-[14px]">{n.text}</p>
                  <p className="text-[12px] text-[#9A9488] mt-1">
                    {formatNigerianDate(n.time)}
                  </p>
                </div>
                {!n.read && (
                  <span className="text-[11px] font-semibold text-[#F0821E]">
                    New
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ========== REUSABLE ==========
function StatCard({ icon: Icon, label, value, color }) {
  const c = {
    green: "border-[#1E7A34]/20 bg-[#1E7A34]/5",
    blue: "border-[#2563EB]/20 bg-[#2563EB]/5",
    orange: "border-[#F0821E]/20 bg-[#F0821E]/5",
    purple: "border-[#7C3AED]/20 bg-[#7C3AED]/5",
  };
  const ic = {
    green: "bg-[#1E7A34]/10 text-[#1E7A34]",
    blue: "bg-[#2563EB]/10 text-[#2563EB]",
    orange: "bg-[#F0821E]/10 text-[#F0821E]",
    purple: "bg-[#7C3AED]/10 text-[#7C3AED]",
  };
  return (
    <div className={`rounded-xl border p-5 ${c[color] || c.green}`}>
      <div
        className={`p-2.5 rounded-lg inline-block mb-3 ${ic[color] || ic.green}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[28px] font-bold">{value}</p>
      <p className="text-[13px] text-[#55605A] mt-1">{label}</p>
    </div>
  );
}
function Section({ title, action, children }) {
  return (
    <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="text-[13px] font-medium text-[#1E7A34]"
          >
            {action.label} <ChevronRight className="h-4 w-4 inline" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
function MessagePreview({ message, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-[#F7F6F2] text-left"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFEDE6] text-[12px] font-semibold">
        {message.customerName?.[0] || "C"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-[13px] font-semibold">
            {message.customerName}
          </p>
          <span className="text-[11px] text-[#9A9488]">
            {formatNigerianDate(message.time)}
          </span>
        </div>
        <p className="truncate text-[12px] mt-0.5">{message.preview}</p>
      </div>
      {message.unread && (
        <span className="h-2 w-2 rounded-full bg-[#F0821E] mt-2" />
      )}
    </button>
  );
}
function JobCard({ job, onRespond }) {
  return (
    <div className="rounded-xl border-l-4 bg-white border p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-[15px] font-semibold">{job.title}</h4>
          <p className="text-[13px] mt-1">{job.description}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-[#1E7A34]/10 text-[#1E7A34]">
          {job.status}
        </span>
      </div>
      <div className="flex items-center gap-6 text-[12px] text-[#9A9488] mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
      </div>
      {job.status === "new" && (
        <div className="flex gap-3">
          <button
            onClick={() => onRespond?.(job.id, "accept")}
            className="flex-1 rounded-lg bg-[#1E7A34] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Accept
          </button>
          <button
            onClick={() => onRespond?.(job.id, "decline")}
            className="rounded-lg border px-4 py-2.5 text-[13px] font-semibold"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#EAE8E1] ${className}`} />
  );
}
function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D8D5CB] bg-white px-6 py-12 text-center">
      <Icon className="h-8 w-8 text-[#9A9488]" />
      <p className="text-[14px] font-medium">{title}</p>
      {hint && <p className="text-[12px] text-[#9A9488]">{hint}</p>}
    </div>
  );
}
