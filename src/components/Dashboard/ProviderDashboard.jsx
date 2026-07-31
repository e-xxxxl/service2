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
  Camera,
  X,
  Phone,
  MessageSquare,
  Send,
  Search,
  Shield,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoIcon from "../../assets/dashlogo.png";
import { useProviderDashboard } from "../../hooks/useProviderDashboard";
import { SERVICE_CATEGORIES } from "../../constants/serviceCategories";

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

export default function ProviderDashboard({ onLogout }) {
  const navigate = useNavigate();
  const {
    providerName,
    companyName,
    profileCompletion,
    verificationStatus,
    rejectionReason,
    isVisible,
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

  const [activeView, setActiveView] = useState("dashboard");
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

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
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col justify-between border-r border-[#E2E0D9] bg-white px-4 py-6 md:flex">
          <div>
            <div className="mb-8 flex items-center gap-3 px-2">
              <img
                src={logoIcon}
                alt="logo"
                className="h-8 w-8 shrink-0 object-contain"
              />
              <div>
                <span className="text-[14px] font-semibold font-['Space_Grotesk',sans-serif]">
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
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                      isActive
                        ? "bg-[#1E7A34] text-white shadow-sm"
                        : "text-[#55605A] hover:bg-[#F7F6F2] hover:text-[#1E2420]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {badge > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isActive
                            ? "bg-[#F0821E] text-white"
                            : "bg-[#FBE0C4] text-[#B85E10]"
                        }`}
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
            {/* Verification Status */}
            <div
              className={`rounded-lg p-3 ${
                verificationStatus === "approved"
                  ? "bg-[#1E7A34]/10 border border-[#1E7A34]/20"
                  : verificationStatus === "rejected"
                    ? "bg-red-50 border border-red-200"
                    : verificationStatus === "submitted"
                      ? "bg-[#FFF8F0] border border-[#F0821E]/20"
                      : "bg-[#F7F6F2]"
              }`}
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

        {/* Main Content */}
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
              onSendMessage={() => setNewMessage("")}
            />
          )}
          {activeView === "notifications" && (
            <NotificationsView
              notifications={notifications}
              loading={loading}
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

      {/* Mobile Bottom Nav */}
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

// Dashboard View
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
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-[12px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="text-[24px] font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
            Welcome back, {providerName || "Pro"}
          </h1>
          {companyName && (
            <p className="text-[14px] text-[#55605A] mt-1">{companyName}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAvailability}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
              isAvailable
                ? "bg-[#1E7A34]/10 text-[#1E7A34] border border-[#1E7A34]/20"
                : "bg-[#EFEDE6] text-[#55605A] border border-[#E2E0D9]"
            }`}
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

      {/* Pending Setup Banner */}
      {(!verificationStatus || verificationStatus === "pending") && (
        <div className="mb-6 rounded-xl border-2 border-[#F0821E] bg-[#FFF8F0] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0821E]/10">
              <AlertCircle className="h-6 w-6 text-[#F0821E]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold font-['Space_Grotesk',sans-serif]">
                Complete Your Profile Setup
              </h3>
              <p className="text-[13px] text-[#55605A] mt-1">
                Complete your profile with service details, NIN verification,
                and contact information to become visible to customers.
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
              <span className="text-[12px] text-[#55605A]">Setup Progress</span>
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

      {/* Submitted Banner */}
      {verificationStatus === "submitted" && (
        <div className="mb-6 rounded-xl border border-[#F0821E]/20 bg-[#FFF8F0] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0821E]/10">
              <Clock className="h-6 w-6 text-[#F0821E]" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold font-['Space_Grotesk',sans-serif]">
                Verification In Progress
              </h3>
              <p className="text-[13px] text-[#55605A] mt-1">
                Your profile is under review. Our team will verify your
                documents within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rejected Banner */}
      {verificationStatus === "rejected" && (
        <div className="mb-6 rounded-xl border-2 border-red-300 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-red-700 font-['Space_Grotesk',sans-serif]">
                Verification Rejected
              </h3>
              <p className="text-[13px] text-red-600 mt-1">
                Your verification was not approved.
              </p>
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
                Resubmit Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approved Banner */}
      {verificationStatus === "approved" && (
        <div className="mb-6 rounded-xl border border-[#1E7A34]/20 bg-[#1E7A34]/5 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-[#1E7A34]" />
            <div>
              <p className="text-[14px] font-semibold text-[#1E7A34]">
                Verified Provider
              </p>
              <p className="text-[12px] text-[#55605A]">
                Your profile is visible to customers searching in your area.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats - Only show if approved */}
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
              <EmptyState
                icon={Briefcase}
                title="No active jobs yet"
                hint="New job requests will appear here"
              />
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
              <EmptyState
                icon={MessageSquare}
                title="No messages"
                hint="Customer messages will appear here"
              />
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

// Profile View
function ProfileView({
  providerName,
  companyName,
  profileCompletion,
  verificationStatus,
  rejectionReason,
  onUpdateProfile,
  onResubmit,
}) {
  const [profileData, setProfileData] = useState({
    companyName: companyName || "",
    serviceType: "",
    tagline: "",
    businessDescription: "",
    yearsOfExperience: 0,
    teamSize: 1,
    ninNumber: "",
    businessAddress: { street: "", city: "", state: "" },
    phone: "",
  });
  const [ninDocument, setNinDocument] = useState(null);
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [activeSection, setActiveSection] = useState("verification");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sections = [
    { id: "verification", label: "Verification", icon: Shield },
    { id: "basic", label: "Basic Info", icon: User },
    { id: "address", label: "Address", icon: MapPin },
  ];

  const handleSave = async (section) => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      if (section === "verification") {
        const fd = new FormData();
        fd.append("serviceType", profileData.serviceType);
        fd.append("tagline", profileData.tagline);
        fd.append("ninNumber", profileData.ninNumber);
        fd.append("city", profileData.businessAddress.city);
        fd.append("state", profileData.businessAddress.state);
        fd.append("phone", profileData.phone);
        if (ninDocument) fd.append("ninDocument", ninDocument);
        if (selfiePhoto) fd.append("selfiePhoto", selfiePhoto);
        const token = localStorage.getItem("authToken");
        const API_URL =
          import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
        const res = await fetch(`${API_URL}/provider/setup-profile`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
      } else {
        let d = {};
        if (section === "basic")
          d = {
            companyName: profileData.companyName,
            businessDescription: profileData.businessDescription,
            yearsOfExperience: profileData.yearsOfExperience,
            teamSize: profileData.teamSize,
          };
        if (section === "address")
          d = {
            businessAddress: profileData.businessAddress,
            city: profileData.businessAddress.city,
            state: profileData.businessAddress.state,
          };
        await onUpdateProfile?.({ section, data: d });
      }
      setSuccessMessage("Updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      {successMessage && (
        <div className="mb-4 rounded-lg bg-[#1E7A34]/10 border border-[#1E7A34]/20 px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#1E7A34]" />
          <p className="text-[13px] text-[#1E7A34] font-medium">
            {successMessage}
          </p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-[13px] text-red-600 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Verification Status Card */}
      <div
        className={`mb-8 rounded-xl border p-6 ${
          verificationStatus === "approved"
            ? "bg-[#1E7A34]/5 border-[#1E7A34]/20"
            : verificationStatus === "rejected"
              ? "bg-red-50 border-red-200"
              : verificationStatus === "submitted"
                ? "bg-[#FFF8F0] border-[#F0821E]/20"
                : "bg-white border-[#E2E0D9]"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center ${
              verificationStatus === "approved"
                ? "bg-[#1E7A34]/10"
                : verificationStatus === "rejected"
                  ? "bg-red-100"
                  : verificationStatus === "submitted"
                    ? "bg-[#F0821E]/10"
                    : "bg-[#EFEDE6]"
            }`}
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
                ? "Verified ✓"
                : verificationStatus === "rejected"
                  ? "Verification Rejected"
                  : verificationStatus === "submitted"
                    ? "Under Review"
                    : "Complete Your Profile"}
            </h3>
            <p className="text-[13px] text-[#55605A] mt-1">
              {verificationStatus === "approved"
                ? "Your profile is visible to customers."
                : verificationStatus === "rejected"
                  ? `Reason: ${rejectionReason || "Not specified"}`
                  : verificationStatus === "submitted"
                    ? "Your documents are being reviewed."
                    : "Fill in the required information to submit for verification."}
            </p>
            {rejectionReason && verificationStatus === "rejected" && (
              <button
                onClick={onResubmit}
                className="mt-3 rounded-lg bg-[#1E7A34] px-4 py-2 text-[12px] font-semibold text-white"
              >
                Resubmit Documents
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="mb-8 rounded-xl border border-[#E2E0D9] bg-white p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-semibold">Profile Completion</h3>
          <span className="text-[13px] font-semibold text-[#1E2420]">
            {profileCompletion || 0}%
          </span>
        </div>
        <div className="h-2 w-full bg-[#EFEDE6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1E7A34] transition-all rounded-full"
            style={{ width: `${profileCompletion || 0}%` }}
          />
        </div>
      </div>

      {/* Section Navigation & Content */}
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
                    setSuccessMessage("");
                    setErrorMessage("");
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-[#1E7A34] text-white shadow-sm"
                      : "text-[#55605A] hover:bg-[#F7F6F2]"
                  }`}
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
                className={`px-4 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-[#1E7A34] text-white"
                    : "bg-white border text-[#55605A]"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          {/* Verification Section */}
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
                    Your profile has been verified and is visible to customers.
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
                    Your documents are being reviewed. You'll be notified once
                    complete.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif] mb-6">
                    Verification Required
                  </h2>
                  <p className="text-[13px] text-[#55605A] mb-6">
                    Fill all fields to submit for verification.
                  </p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        Service Type *
                      </label>
                      <select
                        value={profileData.serviceType}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            serviceType: e.target.value,
                          }))
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
                        value={profileData.tagline}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            tagline: e.target.value,
                          }))
                        }
                        maxLength={200}
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                        placeholder="A short description of your service"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        NIN Number *
                      </label>
                      <input
                        type="text"
                        value={profileData.ninNumber}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            ninNumber: e.target.value,
                          }))
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
                        onChange={(e) => setNinDocument(e.target.files[0])}
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
                        onChange={(e) => setSelfiePhoto(e.target.files[0])}
                        className="w-full rounded-lg border px-4 py-3 text-[14px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={profileData.businessAddress.state}
                          onChange={(e) =>
                            setProfileData((p) => ({
                              ...p,
                              businessAddress: {
                                ...p.businessAddress,
                                state: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border px-4 py-3 text-[14px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={profileData.businessAddress.city}
                          onChange={(e) =>
                            setProfileData((p) => ({
                              ...p,
                              businessAddress: {
                                ...p.businessAddress,
                                city: e.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border px-4 py-3 text-[14px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
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

          {/* Basic Info Section */}
          {activeSection === "basic" && (
            <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
              <h2 className="text-[18px] font-semibold mb-6">
                Basic Information
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) =>
                      setProfileData((p) => ({
                        ...p,
                        companyName: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border px-4 py-3 text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-2">
                    Business Description
                  </label>
                  <textarea
                    rows={4}
                    value={profileData.businessDescription}
                    onChange={(e) =>
                      setProfileData((p) => ({
                        ...p,
                        businessDescription: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border px-4 py-3 text-[14px] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profileData.yearsOfExperience}
                      onChange={(e) =>
                        setProfileData((p) => ({
                          ...p,
                          yearsOfExperience: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full rounded-lg border px-4 py-3 text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">
                      Team Size
                    </label>
                    <input
                      type="number"
                      value={profileData.teamSize}
                      onChange={(e) =>
                        setProfileData((p) => ({
                          ...p,
                          teamSize: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-full rounded-lg border px-4 py-3 text-[14px]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => handleSave("basic")}
                  disabled={saving}
                  className="rounded-lg bg-[#1E7A34] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#166B2C] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Address Section */}
          {activeSection === "address" && (
            <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
              <h2 className="text-[18px] font-semibold mb-6">Address</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold mb-2">
                    Street
                  </label>
                  <input
                    type="text"
                    value={profileData.businessAddress.street}
                    onChange={(e) =>
                      setProfileData((p) => ({
                        ...p,
                        businessAddress: {
                          ...p.businessAddress,
                          street: e.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-lg border px-4 py-3 text-[14px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.businessAddress.city}
                      onChange={(e) =>
                        setProfileData((p) => ({
                          ...p,
                          businessAddress: {
                            ...p.businessAddress,
                            city: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-lg border px-4 py-3 text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={profileData.businessAddress.state}
                      onChange={(e) =>
                        setProfileData((p) => ({
                          ...p,
                          businessAddress: {
                            ...p.businessAddress,
                            state: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-lg border px-4 py-3 text-[14px]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => handleSave("address")}
                  disabled={saving}
                  className="rounded-lg bg-[#1E7A34] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#166B2C] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Messages View
function MessagesView({
  recentMessages,
  selectedConversation,
  onSelectConversation,
  newMessage,
  onNewMessageChange,
  onSendMessage,
}) {
  const [chatMessages, setChatMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [warning, setWarning] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (selectedConversation?.id) fetchMessages(selectedConversation.id);
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
      console.error("Fetch error:", err);
    }
  };

  const handleSend = async () => {
    if (!newMessage?.trim() || !selectedConversation) return;
    if (
      /\b\d{10,}\b/.test(newMessage) ||
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(newMessage)
    ) {
      setWarning("Contact information is not allowed.");
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

  return (
    <div className="flex h-[calc(100vh-0px)]">
      <div className="w-[360px] border-r border-[#E2E0D9] bg-white">
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
        <div className="overflow-y-auto">
          {(recentMessages || []).length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-8 w-8 text-[#9A9488] mx-auto mb-3" />
              <p className="text-[14px] text-[#55605A]">No messages yet</p>
            </div>
          ) : (
            recentMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => onSelectConversation?.(msg)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-[#F7F6F2] border-b ${selectedConversation?.id === msg.id ? "bg-[#F7F6F2]" : ""}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E7A34] text-[14px] font-semibold text-white">
                  {msg.customerName?.[0] || "C"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-[14px] font-semibold">
                      {msg.customerName}
                    </p>
                    <span className="text-[11px] text-[#9A9488]">
                      {msg.time}
                    </span>
                  </div>
                  <p className="truncate text-[12px] mt-1">{msg.preview}</p>
                </div>
                {msg.unread && (
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
                  {selectedConversation.customerName?.[0] || "C"}
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
                  <p className="text-[14px] text-[#9A9488]">No messages yet.</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => {
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
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            {warning && (
              <div className="mx-4 mb-2 rounded-lg bg-red-50 border px-4 py-3 text-[12px] text-red-600">
                {warning}
              </div>
            )}
            <div className="p-4 border-t bg-white">
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

// Notifications View
function NotificationsView({ notifications, loading }) {
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
              className={`rounded-xl border p-4 ${n.read ? "bg-white" : "bg-[#FFF8F0] border-[#F0821E]/20"}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${n.kind === "success" ? "bg-[#1E7A34]" : "bg-[#F0821E]"}`}
                />
                <div>
                  <p className="text-[14px]">{n.text}</p>
                  <p className="text-[12px] text-[#9A9488] mt-1">{n.time}</p>
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

// Reusable Components
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
      <p className="text-[28px] font-bold font-['Space_Grotesk',sans-serif]">
        {value}
      </p>
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
          <span className="text-[11px] text-[#9A9488]">{message.time}</span>
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
