// components/dashboard/ProviderDashboard.jsx
// components/dashboard/ProviderDashboard.jsx
import { useState } from "react";
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
  DollarSign,
  Users,
  CheckSquare,
  ChevronRight,
  MapPin,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Edit,
  Camera,
  Plus,
  X,
  Phone,
  Mail,
  Globe,
  Link,
  AtSign,
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Filter,
  MoreVertical,
  Hash,
  ExternalLink,
} from "lucide-react";
import logoIcon from "../../assets/dashlogo.png";
import { useProviderDashboard } from "../../hooks/useProviderDashboard";

// Navigation config with all views
const NAV_CONFIG = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "messages", label: "Messages", icon: MessageCircle, badgeKey: "messages" },
  { id: "notifications", label: "Alerts", icon: Bell, badgeKey: "notifications" },
  { id: "profile", label: "Profile", icon: User },
];

// Main Dashboard Component
export default function ProviderDashboard({
  onLogout,
}) {
  const {
    providerName,
    companyName,
    profileCompletion,
    activeJobs,
    recentMessages,
    notifications,
    stats,
    loading,
    error,
    refetch,
    updateAvailability,
    updateProfile,
    respondToJob
  } = useProviderDashboard();

  const [activeView, setActiveView] = useState("dashboard");
  const [isAvailable, setIsAvailable] = useState(true);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const unreadMessages = (recentMessages || []).filter((m) => m.unread).length;
  const unreadNotifications = (notifications || []).filter((n) => !n.read).length;
  const badgeCounts = { 
    messages: unreadMessages, 
    notifications: unreadNotifications 
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F4F0] text-[#1E2420] font-['Inter',sans-serif]">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col justify-between border-r border-[#E2E0D9] bg-white px-4 py-6 md:flex">
          <div>
            <div className="mb-8 flex items-center gap-3 px-2">
              <img
                src={logoIcon}
                alt="9jaTradiesPages"
                className="h-8 w-8 shrink-0 object-contain"
              />
              <div>
                <span className="text-[14px] font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
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
                    type="button"
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
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold font-['IBM_Plex_Mono',monospace] ${
                        isActive
                          ? "bg-[#F0821E] text-white"
                          : "bg-[#FBE0C4] text-[#B85E10]"
                      }`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Provider Quick Info */}
          <div className="space-y-3">
            <div className="rounded-lg bg-[#F7F6F2] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0821E] text-[14px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
                  {providerName?.[0] || companyName?.[0] || "P"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#1E2420]">
                    {providerName || "Provider"}
                  </p>
                  <p className="truncate text-[11px] text-[#9A9488]">{companyName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveView("profile")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#F7F6F2] hover:text-[#1E2420]"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                type="button"
                onClick={() => onLogout?.()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#DC2626] hover:bg-[#FEF2F2]"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
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
                const newStatus = !isAvailable;
                setIsAvailable(newStatus);
                updateAvailability?.(newStatus);
              }}
              profileCompletion={profileCompletion}
              stats={stats}
              activeJobs={activeJobs}
              recentMessages={recentMessages}
              notifications={notifications}
              loading={loading}
              error={error}
              refetch={refetch}
              onRespondToJob={respondToJob}
              onNavigate={setActiveView}
              onSelectConversation={(conv) => {
                setSelectedConversation(conv);
                setActiveView("messages");
              }}
            />
          )}
          
          {activeView === "jobs" && (
            <JobsView
              activeJobs={activeJobs}
              loading={loading}
              onRespondToJob={respondToJob}
            />
          )}
          
          {activeView === "messages" && (
            <MessagesView
              recentMessages={recentMessages}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
              onSendMessage={() => {
                // Handle send message
                setNewMessage("");
              }}
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
              onUpdateProfile={updateProfile}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#E2E0D9] bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        {NAV_CONFIG.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const badge = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className="relative flex flex-col items-center gap-1 px-2 py-1"
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-[#1E2420]" : "text-[#9A9488]"
                }`}
              />
              <span className={`text-[10px] font-medium ${
                isActive ? "text-[#1E2420]" : "text-[#9A9488]"
              }`}>
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

// Dashboard View Component
function DashboardView({
  providerName,
  companyName,
  isAvailable,
  onToggleAvailability,
  profileCompletion,
  stats,
  activeJobs,
  recentMessages,
  notifications,
  loading,
  error,
  refetch,
  onRespondToJob,
  onNavigate,
  onSelectConversation
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
            type="button"
            onClick={onToggleAvailability}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
              isAvailable
                ? 'bg-[#1E7A34]/10 text-[#1E7A34] border border-[#1E7A34]/20'
                : 'bg-[#EFEDE6] text-[#55605A] border border-[#E2E0D9]'
            }`}
          >
            {isAvailable ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
            {isAvailable ? 'Available for Jobs' : 'Currently Unavailable'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E0D9] bg-white text-[#55605A] hover:text-[#1E2420] transition-colors"
          >
            <Bell className="h-4 w-4" />
            {(notifications || []).filter(n => !n.read).length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#F0821E]" />
            )}
          </button>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {profileCompletion < 100 && (
        <div className="mb-6 rounded-lg border border-[#F0821E]/20 bg-[#FFF8F0] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0821E]/10">
                <Edit className="h-4 w-4 text-[#F0821E]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1E2420]">
                  Complete Your Profile
                </p>
                <p className="text-[12px] text-[#55605A]">
                  {profileCompletion}% complete - Add more details to attract customers
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className="rounded-lg bg-[#F0821E] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#D5720F] transition-colors"
            >
              Complete Profile
            </button>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#FBE0C4]">
            <div
              className="h-full rounded-full bg-[#F0821E] transition-all"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats?.activeJobs || 0}
          color="green"
        />
        <StatCard
          icon={CheckSquare}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <Section
            title="Active Jobs"
            action={{ label: "View All", onClick: () => onNavigate("jobs") }}
          >
            {loading.jobs ? (
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
                  <JobCard
                    key={job.id}
                    job={job}
                    onRespond={onRespondToJob}
                  />
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Recent Messages */}
        <div>
          <Section
            title="Messages"
            action={{ label: "Open Inbox", onClick: () => onNavigate("messages") }}
          >
            {loading.messages ? (
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

// Profile View Component
// In ProviderDashboard.jsx, update the ProfileView component
function ProfileView({ providerName, companyName, profileCompletion, onUpdateProfile }) {
  const [profileData, setProfileData] = useState({
    companyName: companyName || '',
    businessDescription: '',
    tagline: '',
    yearsOfExperience: 0,
    teamSize: 1,
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    phone: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    whatsapp: ''
  });

  const [activeSection, setActiveSection] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'business', label: 'Business Details', icon: Briefcase },
    { id: 'services', label: 'Services & Pricing', icon: DollarSign },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'documents', label: 'Documents & Verification', icon: CheckCircle2 },
    { id: 'social', label: 'Social & Links', icon: Globe },
  ];

  const handleSave = async (section) => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      let dataToSave = {};
      
      // Prepare data based on section
      switch(section) {
        case 'basic':
          dataToSave = {
            companyName: profileData.companyName,
            businessDescription: profileData.businessDescription,
            tagline: profileData.tagline,
            yearsOfExperience: profileData.yearsOfExperience,
            teamSize: profileData.teamSize
          };
          break;
        case 'business':
          dataToSave = {
            businessAddress: profileData.businessAddress,
            phone: profileData.phone
          };
          break;
        case 'social':
          dataToSave = {
            website: profileData.website,
            facebook: profileData.facebook,
            instagram: profileData.instagram,
            twitter: profileData.twitter,
            linkedin: profileData.linkedin,
            whatsapp: profileData.whatsapp
          };
          break;
        default:
          dataToSave = profileData;
      }
      
      console.log('Saving section:', section, 'Data:', dataToSave);
      
      await onUpdateProfile?.({ 
        section, 
        data: dataToSave 
      });
      
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage(error.message || 'Failed to save changes');
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 rounded-lg bg-[#1E7A34]/10 border border-[#1E7A34]/20 px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#1E7A34]" />
          <p className="text-[13px] text-[#1E7A34] font-medium">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
          <X className="h-4 w-4 text-red-600" />
          <p className="text-[13px] text-red-600 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Profile Header */}
      <div className="mb-8">
        <div className="relative h-48 rounded-2xl bg-gradient-to-r from-[#1E7A34] to-[#166B2C] overflow-hidden mb-16">
          <button className="absolute bottom-4 right-4 rounded-lg bg-white/20 backdrop-blur-sm px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/30 transition-colors">
            <Camera className="h-4 w-4 inline mr-2" />
            Change Cover
          </button>
        </div>
        
        <div className="relative px-6">
          <div className="absolute -top-20 left-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center">
                <span className="text-[40px] font-bold text-[#1E7A34] font-['Space_Grotesk',sans-serif]">
                  {companyName?.[0] || "P"}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 rounded-lg bg-[#1E7A34] p-2 text-white hover:bg-[#166B2C] transition-colors shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="ml-40">
            <h1 className="text-[24px] font-semibold font-['Space_Grotesk',sans-serif]">
              {companyName || "Your Business"}
            </h1>
            <p className="text-[14px] text-[#55605A] mt-1">{providerName}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-[13px] text-[#1E7A34] font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Verified Provider
              </span>
              <span className="text-[13px] text-[#55605A]">
                Profile {profileCompletion}% complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="flex gap-6">
        {/* Section Navigation */}
        <div className="w-[240px] shrink-0">
          <nav className="space-y-1 sticky top-24">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setSuccessMessage('');
                    setErrorMessage('');
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#1E7A34] text-white shadow-sm'
                      : 'text-[#55605A] hover:bg-[#F7F6F2]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section Content */}
        <div className="flex-1">
          {activeSection === 'basic' && (
            <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
              <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif] mb-6">
                Basic Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={profileData.tagline}
                    onChange={(e) => setProfileData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                    placeholder="A short description of your business"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                    Business Description
                  </label>
                  <textarea
                    value={profileData.businessDescription}
                    onChange={(e) => setProfileData(prev => ({ ...prev, businessDescription: e.target.value }))}
                    rows={4}
                    className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20 resize-none"
                    placeholder="Describe your business, experience, and what makes you unique..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profileData.yearsOfExperience}
                      onChange={(e) => setProfileData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                      className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                      Team Size
                    </label>
                    <input
                      type="number"
                      value={profileData.teamSize}
                      onChange={(e) => setProfileData(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                      className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setActiveSection('basic')}
                  className="rounded-lg border border-[#E2E0D9] px-6 py-3 text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave('basic')}
                  disabled={saving}
                  className="rounded-lg bg-[#1E7A34] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#166B2C] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'business' && (
            <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
              <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif] mb-6">
                Business Details
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={profileData.businessAddress.street}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        businessAddress: { ...prev.businessAddress, street: e.target.value }
                      }))}
                      className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.businessAddress.city}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        businessAddress: { ...prev.businessAddress, city: e.target.value }
                      }))}
                      className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                      placeholder="Lagos"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={profileData.businessAddress.state}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        businessAddress: { ...prev.businessAddress, state: e.target.value }
                      }))}
                      className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                      placeholder="Lagos State"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setActiveSection('business')}
                  className="rounded-lg border border-[#E2E0D9] px-6 py-3 text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave('business')}
                  disabled={saving}
                  className="rounded-lg bg-[#1E7A34] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#166B2C] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="rounded-xl border border-[#E2E0D9] bg-white p-6">
              <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif] mb-6">
                Social Media & Links
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
                    { key: 'facebook', label: 'Facebook', icon: ExternalLink, placeholder: 'https://facebook.com/yourpage' },
                    { key: 'instagram', label: 'Instagram', icon: Camera, placeholder: 'https://instagram.com/yourhandle' },
                    { key: 'twitter', label: 'Twitter', icon: AtSign, placeholder: 'https://twitter.com/yourhandle' },
                    { key: 'linkedin', label: 'LinkedIn', icon: Link, placeholder: 'https://linkedin.com/in/yourprofile' },
                    { key: 'whatsapp', label: 'WhatsApp', icon: Phone, placeholder: '+234 800 000 0000' },
                  ].map(({ key, label, icon: Icon, placeholder }) => (
                    <div key={key}>
                      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#1E2420] mb-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </label>
                      <input
                        type="text"
                        value={profileData[key]}
                        onChange={(e) => setProfileData(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34] focus:ring-1 focus:ring-[#1E7A34]/20"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setActiveSection('social')}
                  className="rounded-lg border border-[#E2E0D9] px-6 py-3 text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave('social')}
                  disabled={saving}
                  className="rounded-lg bg-[#1E7A34] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#166B2C] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Messages View Component
function MessagesView({
  recentMessages,
  selectedConversation,
  onSelectConversation,
  newMessage,
  onNewMessageChange,
  onSendMessage
}) {
  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Conversations List */}
      <div className="w-[360px] border-r border-[#E2E0D9] bg-white">
        <div className="p-4 border-b border-[#E2E0D9]">
          <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif] mb-4">
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-[#E2E0D9] pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-[#1E7A34]"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto">
          {(recentMessages || []).length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-8 w-8 text-[#9A9488] mx-auto mb-3" />
              <p className="text-[14px] text-[#55605A]">No messages yet</p>
              <p className="text-[12px] text-[#9A9488] mt-1">
                Messages from customers will appear here
              </p>
            </div>
          ) : (
            recentMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => onSelectConversation?.(msg)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-[#F7F6F2] transition-colors border-b border-[#E2E0D9] ${
                  selectedConversation?.id === msg.id ? 'bg-[#F7F6F2]' : ''
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E7A34] text-[14px] font-semibold text-white">
                  {msg.customerName?.[0] || "C"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold text-[#1E2420]">
                      {msg.customerName}
                    </p>
                    <span className="shrink-0 text-[11px] text-[#9A9488]">
                      {msg.time}
                    </span>
                  </div>
                  <p className="truncate text-[12px] text-[#55605A] mt-1">
                    {msg.preview}
                  </p>
                </div>
                {msg.unread && (
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#F0821E] mt-2" />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F5F4F0]">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E0D9] bg-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E7A34] text-[14px] font-semibold text-white">
                  {selectedConversation.customerName?.[0] || "C"}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1E2420]">
                    {selectedConversation.customerName}
                  </p>
                  <p className="text-[12px] text-[#55605A]">Customer</p>
                </div>
              </div>
              <button className="rounded-lg p-2 hover:bg-[#F7F6F2] transition-colors">
                <MoreVertical className="h-5 w-5 text-[#55605A]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Example messages - you'll populate from actual data */}
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                  <p className="text-[14px] text-[#1E2420]">
                    Hello! I'm interested in your plumbing services for a bathroom renovation.
                  </p>
                  <p className="text-[11px] text-[#9A9488] mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-[#1E7A34] px-4 py-3 shadow-sm">
                  <p className="text-[14px] text-white">
                    Hi! I'd be happy to help. When would you like to schedule an inspection?
                  </p>
                  <p className="text-[11px] text-white/70 mt-1">10:32 AM</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-[#E2E0D9] bg-white">
              <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 hover:bg-[#F7F6F2] transition-colors">
                  <Paperclip className="h-5 w-5 text-[#55605A]" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => onNewMessageChange?.(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newMessage.trim()) {
                      onSendMessage?.();
                    }
                  }}
                />
                <button
                  onClick={onSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-lg bg-[#1E7A34] p-3 text-white hover:bg-[#166B2C] transition-colors disabled:opacity-50"
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
              <h3 className="text-[18px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
                Select a conversation
              </h3>
              <p className="text-[14px] text-[#55605A] mt-2">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Jobs View Component
function JobsView({ activeJobs, loading, onRespondToJob }) {
  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-semibold font-['Space_Grotesk',sans-serif]">
          Jobs
        </h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-[#E2E0D9] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#55605A] hover:bg-[#F7F6F2]">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading.jobs ? (
          [0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-[140px]" />
          ))
        ) : (activeJobs || []).length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs available"
            hint="New job requests will appear here"
          />
        ) : (
          activeJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onRespond={onRespondToJob}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Notifications View Component
function NotificationsView({ notifications, loading }) {
  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <h2 className="text-[24px] font-semibold font-['Space_Grotesk',sans-serif] mb-6">
        Notifications
      </h2>
      
      <div className="space-y-3">
        {loading.notifications ? (
          [0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-[80px]" />
          ))
        ) : (notifications || []).length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            hint="You're all caught up!"
          />
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border p-4 ${
                notification.read ? 'bg-white border-[#E2E0D9]' : 'bg-[#FFF8F0] border-[#F0821E]/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  notification.kind === 'success' ? 'bg-[#1E7A34]' :
                  notification.kind === 'action' ? 'bg-[#F0821E]' :
                  'bg-[#9A9488]'
                }`} />
                <div className="flex-1">
                  <p className="text-[14px] text-[#1E2420]">{notification.text}</p>
                  <p className="text-[12px] text-[#9A9488] mt-1">{notification.time}</p>
                </div>
                {!notification.read && (
                  <span className="text-[11px] font-semibold text-[#F0821E]">New</span>
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
  const colors = {
    green: "border-[#1E7A34]/20 bg-[#1E7A34]/5",
    blue: "border-[#2563EB]/20 bg-[#2563EB]/5",
    orange: "border-[#F0821E]/20 bg-[#F0821E]/5",
    purple: "border-[#7C3AED]/20 bg-[#7C3AED]/5"
  };

  const iconColors = {
    green: "bg-[#1E7A34]/10 text-[#1E7A34]",
    blue: "bg-[#2563EB]/10 text-[#2563EB]",
    orange: "bg-[#F0821E]/10 text-[#F0821E]",
    purple: "bg-[#7C3AED]/10 text-[#7C3AED]"
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[color] || colors.green}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${iconColors[color] || iconColors.green}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-[28px] font-bold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
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
        <h3 className="text-[16px] font-semibold font-['Space_Grotesk',sans-serif]">
          {title}
        </h3>
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1 text-[13px] font-medium text-[#1E7A34] hover:text-[#166B2C]"
          >
            {action.label}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function JobCard({ job, onRespond }) {
  const urgencyColors = {
    urgent: 'border-l-[#DC2626]',
    high: 'border-l-[#F0821E]',
    normal: 'border-l-[#1E7A34]',
    low: 'border-l-[#9A9488]'
  };

  return (
    <div className={`rounded-xl border-l-4 bg-white border border-[#E2E0D9] p-5 ${urgencyColors[job.urgency] || urgencyColors.normal}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-[15px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
            {job.title}
          </h4>
          <p className="text-[13px] text-[#55605A] mt-1">{job.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase ${
          job.status === 'new' ? 'bg-[#1E7A34]/10 text-[#1E7A34]' :
          job.status === 'in-progress' ? 'bg-[#F0821E]/10 text-[#F0821E]' :
          'bg-[#EFEDE6] text-[#55605A]'
        }`}>
          {job.status}
        </span>
      </div>
      
      <div className="flex items-center gap-6 text-[12px] text-[#9A9488] mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> {job.posted}
        </span>
        <span className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5" /> {job.budget}
        </span>
      </div>

      {job.status === 'new' && (
        <div className="flex gap-3">
          <button
            onClick={() => onRespond?.(job.id, 'accept')}
            className="flex-1 rounded-lg bg-[#1E7A34] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#166B2C] transition-colors"
          >
            Accept Job
          </button>
          <button
            onClick={() => onRespond?.(job.id, 'decline')}
            className="rounded-lg border border-[#E2E0D9] px-4 py-2.5 text-[13px] font-semibold text-[#55605A] hover:bg-[#F7F6F2] transition-colors"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

function MessagePreview({ message, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-[#F7F6F2] transition-colors text-left"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFEDE6] text-[12px] font-semibold text-[#1E2420]">
        {message.customerName?.[0] || "C"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[13px] font-semibold text-[#1E2420]">
            {message.customerName}
          </p>
          <span className="shrink-0 text-[11px] text-[#9A9488]">
            {message.time}
          </span>
        </div>
        <p className="truncate text-[12px] text-[#55605A] mt-0.5">
          {message.preview}
        </p>
      </div>
      {message.unread && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#F0821E] mt-2" />
      )}
    </button>
  );
}

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-[#EAE8E1] ${className}`} />;
}

function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D8D5CB] bg-white px-6 py-12 text-center">
      <Icon className="h-8 w-8 text-[#9A9488]" />
      <p className="text-[14px] font-medium text-[#1E2420]">{title}</p>
      {hint && <p className="text-[12px] text-[#9A9488]">{hint}</p>}
    </div>
  );
}