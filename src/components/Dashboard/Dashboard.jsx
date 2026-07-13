// components/dashboard/Dashboard.jsx
import { useState } from "react";
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
} from "lucide-react";
import logoIcon from "../../assets/dashlogo.png";
import { useCustomerDashboard } from "../../hooks/useCustomerDashboard";

const DEFAULT_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "AC Repair & Installation",
  "Painting",
  "Tiling",
  "Generator Repair",
  "Cleaning",
];

const DEFAULT_STATES = ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Delta", "Edo", "Enugu"];

const CITIES_BY_STATE = {
  'Lagos': ['Ikeja', 'Lekki', 'Victoria Island', 'Surulere', 'Yaba', 'Ikoyi', 'Ajah', 'Apapa', 'Badagry'],
  'Abuja (FCT)': ['Wuse II', 'Garki', 'Maitama', 'Asokoro', 'Gwarinpa', 'Jabi', 'Kubwa', 'Lugbe'],
  'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Oyigbo', 'Okrika'],
  'Oyo': ['Ibadan North', 'Ibadan South', 'Ogbomosho', 'Oyo', 'Iseyin'],
  'Kano': ['Kano Municipal', 'Nassarawa', 'Tarauni', 'Fagge', 'Dala'],
  'Delta': ['Asaba', 'Warri', 'Sapele', 'Ughelli'],
  'Edo': ['Benin City', 'Ekpoma', 'Auchi', 'Uromi'],
  'Enugu': ['Enugu North', 'Enugu South', 'Nsukka', 'Agbani'],
};

const NAV_CONFIG = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "search", label: "Find a pro", icon: Search },
  { id: "messages", label: "Messages", icon: MessageCircle, badgeKey: "messages" },
  { id: "favorites", label: "Saved", icon: Heart },
  { id: "notifications", label: "Alerts", icon: Bell, badgeKey: "notifications" },
  { id: "profile", label: "Profile", icon: User },
];

function StatusTag({ children, tone = "signal" }) {
  const tones = {
    signal: "bg-[#1E7A34] text-white",
    brass: "bg-[#F0821E] text-white",
    quiet: "bg-[#EFEDE6] text-[#55605A]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-[3px] px-2 py-[3px] text-[10px] font-semibold tracking-wide uppercase font-['IBM_Plex_Mono',monospace] ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[#EAE8E1] ${className}`} />;
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-[#F0821E]/30 bg-[#FBE0C4]/40 px-4 py-3">
      <p className="text-[13px] text-[#7A3E0B]">Couldn't load your dashboard: {message}</p>
      <button type="button" onClick={onRetry} className="shrink-0 rounded-md border border-[#7A3E0B]/30 px-3 py-1.5 text-[12px] font-semibold text-[#7A3E0B] hover:bg-[#F0821E]/10">
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

function ProTicketCard({ pro, onMessage, onToggleFavorite }) {
  return (
    <div className="group relative rounded-lg border border-[#E2E0D9] bg-white overflow-hidden transition-shadow hover:shadow-[0_4px_20px_-6px_rgba(30,36,32,0.15)]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F7F6F2]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E2420] text-[13px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
            {(pro.name || "P").split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
              {pro.name}
            </p>
            <p className="text-[12px] text-[#55605A]">{pro.trade}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={pro.isFavorited ? "Remove from saved" : "Save professional"}
            onClick={() => onToggleFavorite?.(pro, !pro.isFavorited)}
            className="text-[#9A9488] hover:text-[#F0821E]"
          >
            <Heart className={`h-4 w-4 ${pro.isFavorited ? "fill-[#F0821E] text-[#F0821E]" : ""}`} />
          </button>
        </div>
      </div>

      <div className="border-t border-dashed border-[#D8D5CB]" />

      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between text-[12px] text-[#55605A]">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#9A9488]" />
            {pro.location || "Nigeria"}
          </span>
          <span className="flex items-center gap-1 font-['IBM_Plex_Mono',monospace] text-[#1E2420]">
            <Star className="h-3.5 w-3.5 fill-[#F0821E] text-[#F0821E]" />
            {pro.rating || "0.0"}
          </span>
        </div>
        <div className="flex items-center justify-between text-[12px] text-[#55605A]">
          <span>{pro.jobs || 0} jobs completed · {pro.years || 0} yrs experience</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <StatusTag tone={pro.status?.startsWith("Available") ? "signal" : "quiet"}>
            {pro.status || "Available"}
          </StatusTag>
          {pro.lastContact && (
            <span className="flex items-center gap-1 text-[11px] text-[#9A9488]">
              <Clock className="h-3 w-3" />
              Contacted {pro.lastContact}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onMessage?.(pro)}
        className="flex w-full items-center justify-center gap-1.5 border-t border-[#E2E0D9] py-2.5 text-[12px] font-semibold text-[#1E2420] transition-colors hover:bg-[#F7F6F2] font-['Space_Grotesk',sans-serif]"
      >
        Message {pro.name?.split(" ")[0] || "Pro"}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function Dashboard({
  categories = DEFAULT_CATEGORIES,
  states = DEFAULT_STATES,
  onOpenConversation,
  onOpenInbox,
  onOpenNotifications,
  onCompleteProfile,
  onOpenSettings,
  onLogout,
  onNavigate,
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

  const [active, setActive] = useState("dashboard");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const unreadMessages = (conversations || []).filter((c) => c.unread).length;
  const unreadNotifications = (notifications || []).filter((n) => !n.read).length;
  const badgeCounts = { messages: unreadMessages, notifications: unreadNotifications };

  function handleNavigate(id) {
    setActive(id);
    onNavigate?.(id);
  }

  async function handleSearchSubmit(e) {
    e.preventDefault();
    setShowSearchResults(true);
    await search?.({ category, state, city });
  }

  function handleMessagePro(pro) {
    sendMessage?.(pro.id, "");
    onOpenConversation?.(pro);
  }

  async function handleToggleFavoriteOnPro(pro, nextState) {
    await toggleFavorite?.(pro, nextState);
  }

  async function handleUnsaveFavorite(item) {
    await toggleFavorite?.(item, false);
  }

  function handleOpenConversation(c) {
    onOpenConversation?.(c);
  }

  async function handleOpenNotification(n) {
    await markNotificationRead?.(n);
  }

  const citiesForState = state && CITIES_BY_STATE[state] ? CITIES_BY_STATE[state] : [];

  return (
    <div className="min-h-screen w-full bg-[#F5F4F0] text-[#1E2420] font-['Inter',sans-serif] pb-20 md:pb-0">
      <div className="mx-auto flex max-w-[1240px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col justify-between border-r border-[#E2E0D9] px-4 py-6 md:flex">
          <div>
            <div className="mb-8 flex items-center gap-2 px-2">
              <img src={logoIcon} alt="9jaTradiesPages" className="h-8 w-8 shrink-0 object-contain" />
              <span className="text-[14px] font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
                9jaTradiesPages
              </span>
            </div>

            <nav className="space-y-1">
              {NAV_CONFIG.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                const badge = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                      isActive ? "bg-[#1E7A34] text-white" : "text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {badge > 0 && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-['IBM_Plex_Mono',monospace] ${
                        isActive ? "bg-[#F0821E] text-white" : "bg-[#FBE0C4] text-[#B85E10]"
                      }`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1 border-t border-[#E2E0D9] pt-4">
            <button type="button" onClick={() => onOpenSettings?.()} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button type="button" onClick={() => onLogout?.()} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]">
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        {/* Main column */}
        <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">
          {error && <ErrorBanner message={error} onRetry={refetch} />}

          {/* Topbar */}
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <h1 className="text-[22px] font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
                Good to see you, {customerName || "there"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => onOpenNotifications?.()} className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E0D9] bg-white text-[#55605A] hover:text-[#1E2420]">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#F0821E]" />}
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E7A34] text-[12px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
                {customerName?.[0] || "?"}
              </div>
            </div>
          </div>

          {/* Quick find panel */}
          <form onSubmit={handleSearchSubmit} className="mb-8 rounded-lg border border-[#E2E0D9] bg-white p-4 md:p-5">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
              Find a trusted professional near you
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[13px] text-[#1E2420] outline-none focus:border-[#1E2420]">
                <option value="">Service category</option>
                {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <select value={state} onChange={(e) => { setState(e.target.value); setCity(""); }} className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[13px] text-[#1E2420] outline-none focus:border-[#1E2420]">
                <option value="">State</option>
                {states.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[13px] text-[#1E2420] outline-none focus:border-[#1E2420]" disabled={!state}>
                <option value="">City</option>
                {citiesForState.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <button type="submit" disabled={isSearching} className="flex items-center justify-center gap-1.5 rounded-md bg-[#F0821E] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#D5720F] font-['Space_Grotesk',sans-serif] disabled:opacity-70">
                {isSearching ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Search Results */}
          {showSearchResults && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif]">
                  Search Results
                  {searchResults?.length > 0 && (
                    <span className="ml-2 text-[14px] font-normal text-[#9A9488]">
                      ({searchResults.length} found)
                    </span>
                  )}
                </h2>
                <button onClick={() => setShowSearchResults(false)} className="text-[13px] font-medium text-[#55605A] hover:text-[#1E2420] flex items-center gap-1">
                  <X className="h-4 w-4" /> Hide results
                </button>
              </div>

              {isSearching ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[0, 1, 2].map((i) => (<SkeletonBlock key={i} className="h-[210px]" />))}
                </div>
              ) : !searchResults || searchResults.length === 0 ? (
                <EmptyState icon={Search} title="No professionals found" hint="Try adjusting your search filters or search in a different area." />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {searchResults.map((pro) => (
                    <ProTicketCard key={pro.id} pro={pro} onMessage={handleMessagePro} onToggleFavorite={handleToggleFavoriteOnPro} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Content grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left column */}
            <div className="space-y-8">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">Recently contacted</h2>
                  <button type="button" onClick={() => handleNavigate("search")} className="flex items-center gap-1 text-[12px] font-medium text-[#55605A] hover:text-[#1E2420]">
                    View all <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {loading?.pros ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2].map((i) => (<SkeletonBlock key={i} className="h-[210px]" />))}
                  </div>
                ) : (recentPros || []).length === 0 ? (
                  <EmptyState icon={Search} title="No professionals contacted yet" hint="Run a search to find someone for your next job." />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {recentPros.map((pro) => (
                      <ProTicketCard key={pro.id} pro={pro} onMessage={handleMessagePro} onToggleFavorite={handleToggleFavoriteOnPro} />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">Conversations</h2>
                  <button type="button" onClick={() => onOpenInbox?.()} className="flex items-center gap-1 text-[12px] font-medium text-[#55605A] hover:text-[#1E2420]">
                    Open inbox <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {loading?.conversations ? (
                  <div className="space-y-2">{[0, 1, 2].map((i) => (<SkeletonBlock key={i} className="h-[60px]" />))}</div>
                ) : (conversations || []).length === 0 ? (
                  <EmptyState icon={Inbox} title="No conversations yet" hint="Messages with professionals will show up here." />
                ) : (
                  <div className="divide-y divide-[#E2E0D9] rounded-lg border border-[#E2E0D9] bg-white">
                    {conversations.map((c) => (
                      <button key={c.id} type="button" onClick={() => handleOpenConversation(c)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F7F6F2]">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFEDE6] text-[12px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
                          {c.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13px] font-semibold text-[#1E2420]">
                              {c.name}
                              <span className="ml-1.5 font-normal text-[#9A9488]">· {c.trade}</span>
                            </p>
                            <span className="shrink-0 text-[11px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">{c.time}</span>
                          </div>
                          <p className="truncate text-[12px] text-[#55605A]">{c.preview}</p>
                        </div>
                        {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[#F0821E]" />}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">Notifications</h2>
                {loading?.notifications ? (
                  <div className="space-y-2">{[0, 1, 2].map((i) => (<SkeletonBlock key={i} className="h-[52px]" />))}</div>
                ) : (notifications || []).length === 0 ? (
                  <EmptyState icon={Bell} title="You're all caught up" />
                ) : (
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <button key={n.id} type="button" onClick={() => handleOpenNotification(n)} className={`flex w-full items-start gap-2.5 rounded-md border border-[#E2E0D9] bg-white px-3 py-2.5 text-left transition-opacity hover:bg-[#F7F6F2] ${n.read ? "opacity-60" : ""}`}>
                        <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.kind === "success" ? "bg-[#1E7A34]" : n.kind === "action" ? "bg-[#F0821E]" : "bg-[#9A9488]"}`} />
                        <div className="min-w-0">
                          <p className="text-[12.5px] leading-snug text-[#1E2420]">{n.text}</p>
                          <p className="mt-0.5 text-[11px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">{n.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-3 text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">Saved professionals</h2>
                {loading?.favorites ? (
                  <div className="space-y-2">{[0, 1].map((i) => (<SkeletonBlock key={i} className="h-[52px]" />))}</div>
                ) : (favorites || []).length === 0 ? (
                  <EmptyState icon={Heart} title="No saved professionals yet" hint="Tap the heart on a profile to save it here." />
                ) : (
                  <div className="space-y-2">
                    {favorites.map((f) => (
                      <div key={f.id} className="flex items-center justify-between rounded-md border border-[#E2E0D9] bg-white px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-[#1E2420]">{f.name}</p>
                          <p className="truncate text-[11.5px] text-[#55605A]">{f.trade} · {f.location}</p>
                        </div>
                        <button type="button" aria-label="Remove from saved" onClick={() => handleUnsaveFavorite(f)} className="shrink-0">
                          <Heart className="h-4 w-4 fill-[#F0821E] text-[#F0821E]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-lg border border-dashed border-[#D8D5CB] bg-white px-4 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9A9488] font-['IBM_Plex_Mono',monospace]">Profile</p>
                  <span className="text-[11px] font-['IBM_Plex_Mono',monospace] text-[#1E2420]">{profileCompletion || 0}%</span>
                </div>
                <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[#EFEDE6]">
                  <div className="h-full rounded-full bg-[#1E7A34]" style={{ width: `${profileCompletion || 0}%` }} />
                </div>
                <p className="mb-3 flex items-center gap-1.5 text-[12px] text-[#55605A]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7A34]" />
                  Add your address to see closer matches
                </p>
                <button type="button" onClick={() => onCompleteProfile?.()} className="w-full rounded-md border border-[#1E7A34] py-2 text-[12.5px] font-semibold text-[#1E7A34] transition-colors hover:bg-[#1E7A34] hover:text-white font-['Space_Grotesk',sans-serif]">
                  Complete profile
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#E2E0D9] bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        {NAV_CONFIG.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const badge = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
          return (
            <button key={item.id} type="button" onClick={() => handleNavigate(item.id)} className="relative flex flex-col items-center gap-1 px-2 py-1">
              <Icon className={`h-5 w-5 ${isActive ? "text-[#1E2420]" : "text-[#9A9488]"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-[#1E2420]" : "text-[#9A9488]"}`}>{item.label}</span>
              {badge > 0 && <span className="absolute -top-0.5 right-1 h-1.5 w-1.5 rounded-full bg-[#F0821E]" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}