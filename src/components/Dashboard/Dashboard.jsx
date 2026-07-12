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
} from "lucide-react";
import logoIcon from "../../assets/dashlogo.png";

/**
 * 9jaTradiesPages — Customer Dashboard
 * -------------------------------------------------
 * Design language: "job ticket" — cards read like the paper
 * work-dockets tradespeople hand customers on-site: a torn
 * header strip, a stamped status tag, mono-set reference
 * numbers. Kept quiet everywhere else.
 *
 * Palette pulled from the 9jaTradiesPages logo:
 * brand green #1E7A34 (bookend color — trust, primary actions),
 * brand orange #F0821E (the standout middle color — accents,
 * badges, alerts), on a quiet neutral paper/ink base.
 *
 * Fonts (add to index.html <head>):
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
 *
 * Logo: 9jatradiespages-icon.png ships alongside this file — keep
 * them in the same folder, or change the import path above.
 *
 * ---------------------------------------------------------------
 * BACKEND INTEGRATION POINTS
 * ---------------------------------------------------------------
 * This component is UI-complete and interactive on mock data. To
 * wire it to a real API, pass these props from a parent that owns
 * the data fetching (React Query / SWR / your own hooks etc.):
 *
 * DATA
 *  - customerName, profileCompletion (number 0-100)
 *  - categories, states, cities            → for the search selects
 *  - recentPros                            → [{ id, name, trade, location,
 *                                              rating, jobs, years, status,
 *                                              lastContact, isFavorited }]
 *  - conversations                         → [{ id, name, trade, preview,
 *                                              time, unread }]
 *  - notifications                         → [{ id, text, time, kind, read }]
 *                                              kind: "success" | "action" | "message"
 *  - favorites                             → [{ id, name, trade, location }]
 *  - isLoadingPros / isLoadingConversations
 *    / isLoadingNotifications / isLoadingFavorites  → show skeleton states
 *
 * ACTIONS (all optional, all no-ops by default)
 *  - onSearch({ category, state, city })   → run the search, route to results
 *  - onMessagePro(pro)                     → open/create a conversation
 *  - onOpenConversation(conversation)      → open a thread
 *  - onOpenInbox()                         → "Open inbox" link
 *  - onToggleFavorite(item, nextState)     → save/unsave a professional
 *  - onOpenNotification(notification)      → mark read + navigate
 *  - onOpenNotifications()                 → bell icon in the topbar
 *  - onCompleteProfile()                   → route to profile edit
 *  - onOpenSettings() / onLogout()
 *  - onNavigate(sectionId)                 → fires whenever the sidebar /
 *                                              bottom nav selection changes,
 *                                              alongside the internal
 *                                              active-tab state — hook your
 *                                              router up here.
 */

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

const DEFAULT_STATES = ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano"];
const DEFAULT_CITIES = ["Ikeja", "Lekki", "Wuse II", "Garki", "Port Harcourt"];

const DEFAULT_RECENT_PROS = [
  {
    id: "TP-2291",
    name: "Chidi Okonkwo",
    trade: "Electrician",
    location: "Ikeja, Lagos",
    rating: 4.9,
    jobs: 132,
    years: 9,
    status: "Available today",
    lastContact: "2 days ago",
    isFavorited: true,
  },
  {
    id: "TP-1187",
    name: "Amaka Bello",
    trade: "Plumber",
    location: "Lekki, Lagos",
    rating: 4.8,
    jobs: 88,
    years: 6,
    status: "Replies in ~1hr",
    lastContact: "5 days ago",
    isFavorited: false,
  },
  {
    id: "TP-3042",
    name: "Suleiman Yaro",
    trade: "AC Technician",
    location: "Wuse II, Abuja",
    rating: 5.0,
    jobs: 61,
    years: 4,
    status: "Available today",
    lastContact: "1 week ago",
    isFavorited: false,
  },
];

const DEFAULT_CONVERSATIONS = [
  {
    id: 1,
    name: "Chidi Okonkwo",
    trade: "Electrician",
    preview: "I can come by by 4pm tomorrow, does that still work for you?",
    time: "10:42 AM",
    unread: true,
  },
  {
    id: 2,
    name: "Amaka Bello",
    trade: "Plumber",
    preview: "Sent you the quote for the pipe replacement — check when free.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    name: "Femi Adeyemi",
    trade: "Painter",
    preview: "Thank you, job's marked complete on my end.",
    time: "Mon",
    unread: false,
  },
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    text: "Chidi Okonkwo accepted your job request",
    time: "1h ago",
    kind: "success",
    read: false,
  },
  {
    id: 2,
    text: "New review request: rate your job with Femi Adeyemi",
    time: "1d ago",
    kind: "action",
    read: false,
  },
  {
    id: 3,
    text: "Suleiman Yaro sent you a quote",
    time: "2d ago",
    kind: "message",
    read: false,
  },
];

const DEFAULT_FAVORITES = [
  {
    id: "TP-2291",
    name: "Chidi Okonkwo",
    trade: "Electrician",
    location: "Ikeja, Lagos",
  },
  {
    id: "TP-5510",
    name: "Blessing Nwachukwu",
    trade: "Cleaner",
    location: "Garki, Abuja",
  },
];

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
    <span
      className={`inline-flex items-center gap-1 rounded-[3px] px-2 py-[3px] text-[10px] font-semibold tracking-wide uppercase font-['IBM_Plex_Mono',monospace] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[#EAE8E1] ${className}`} />;
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
      {/* Ticket header strip */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F7F6F2]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E2420] text-[13px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
            {pro.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
              {pro.name}
            </p>
            <p className="text-[12px] text-[#55605A]">{pro.trade}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#9A9488]">
            {pro.id}
          </span>
          <button
            type="button"
            aria-label={pro.isFavorited ? "Remove from saved" : "Save professional"}
            onClick={() => onToggleFavorite?.(pro, !pro.isFavorited)}
            className="text-[#9A9488] hover:text-[#F0821E]"
          >
            <Heart
              className={`h-4 w-4 ${
                pro.isFavorited ? "fill-[#F0821E] text-[#F0821E]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Perforation */}
      <div className="border-t border-dashed border-[#D8D5CB]" />

      {/* Ticket body */}
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between text-[12px] text-[#55605A]">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#9A9488]" />
            {pro.location}
          </span>
          <span className="flex items-center gap-1 font-['IBM_Plex_Mono',monospace] text-[#1E2420]">
            <Star className="h-3.5 w-3.5 fill-[#F0821E] text-[#F0821E]" />
            {pro.rating}
          </span>
        </div>
        <div className="flex items-center justify-between text-[12px] text-[#55605A]">
          <span>{pro.jobs} jobs completed · {pro.years} yrs experience</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <StatusTag tone={pro.status.startsWith("Available") ? "signal" : "quiet"}>
            {pro.status}
          </StatusTag>
          <span className="flex items-center gap-1 text-[11px] text-[#9A9488]">
            <Clock className="h-3 w-3" />
            Contacted {pro.lastContact}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onMessage?.(pro)}
        className="flex w-full items-center justify-center gap-1.5 border-t border-[#E2E0D9] py-2.5 text-[12px] font-semibold text-[#1E2420] transition-colors hover:bg-[#F7F6F2] font-['Space_Grotesk',sans-serif]"
      >
        Message {pro.name.split(" ")[0]}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function Dashboard({
  customerName = "Ada",
  profileCompletion = 80,
  categories = DEFAULT_CATEGORIES,
  states = DEFAULT_STATES,
  cities = DEFAULT_CITIES,
  recentPros = DEFAULT_RECENT_PROS,
  conversations = DEFAULT_CONVERSATIONS,
  notifications = DEFAULT_NOTIFICATIONS,
  favorites = DEFAULT_FAVORITES,
  isLoadingPros = false,
  isLoadingConversations = false,
  isLoadingNotifications = false,
  isLoadingFavorites = false,
  onSearch,
  onMessagePro,
  onOpenConversation,
  onOpenInbox,
  onToggleFavorite,
  onOpenNotification,
  onOpenNotifications,
  onCompleteProfile,
  onOpenSettings,
  onLogout,
  onNavigate,
}) {
  const [active, setActive] = useState("dashboard");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // Optimistic local copies so the UI feels alive before a backend is
  // wired up — real data still flows in via props above.
  const [proList, setProList] = useState(recentPros);
  const [conversationList, setConversationList] = useState(conversations);
  const [notificationList, setNotificationList] = useState(notifications);
  const [favoriteList, setFavoriteList] = useState(favorites);

  const unreadMessages = conversationList.filter((c) => c.unread).length;
  const unreadNotifications = notificationList.filter((n) => !n.read).length;
  const badgeCounts = { messages: unreadMessages, notifications: unreadNotifications };

  function handleNavigate(id) {
    setActive(id);
    onNavigate?.(id);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    onSearch?.({ category, state, city });
  }

  function handleMessagePro(pro) {
    onMessagePro?.(pro);
  }

  function handleToggleFavoriteOnPro(pro, nextState) {
    setProList((list) =>
      list.map((p) => (p.id === pro.id ? { ...p, isFavorited: nextState } : p))
    );
    onToggleFavorite?.(pro, nextState);
  }

  function handleUnsaveFavorite(item) {
    setFavoriteList((list) => list.filter((f) => f.id !== item.id));
    setProList((list) =>
      list.map((p) => (p.id === item.id ? { ...p, isFavorited: false } : p))
    );
    onToggleFavorite?.(item, false);
  }

  function handleOpenConversation(c) {
    setConversationList((list) =>
      list.map((row) => (row.id === c.id ? { ...row, unread: false } : row))
    );
    onOpenConversation?.(c);
  }

  function handleOpenNotification(n) {
    setNotificationList((list) =>
      list.map((row) => (row.id === n.id ? { ...row, read: true } : row))
    );
    onOpenNotification?.(n);
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F4F0] text-[#1E2420] font-['Inter',sans-serif] pb-20 md:pb-0">
      <div className="mx-auto flex max-w-[1240px]">
        {/* Sidebar — desktop only */}
        <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col justify-between border-r border-[#E2E0D9] px-4 py-6 md:flex">
          <div>
            <div className="mb-8 flex items-center gap-2 px-2">
              <img
                src={logoIcon}
                alt="9jaTradiesPages"
                className="h-8 w-8 shrink-0 object-contain"
              />
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
                      isActive
                        ? "bg-[#1E7A34] text-white"
                        : "text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {badge > 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-['IBM_Plex_Mono',monospace] ${
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

          <div className="space-y-1 border-t border-[#E2E0D9] pt-4">
            <button
              type="button"
              onClick={() => onOpenSettings?.()}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => onLogout?.()}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        {/* Main column */}
        <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">
          {/* Topbar */}
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                {new Date().toLocaleDateString("en-NG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <h1 className="text-[22px] font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
                Good to see you, {customerName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenNotifications?.()}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E0D9] bg-white text-[#55605A] hover:text-[#1E2420]"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#F0821E]" />
                )}
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E7A34] text-[12px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
                {customerName[0]}
              </div>
            </div>
          </div>

          {/* Quick find panel */}
          <form
            onSubmit={handleSearchSubmit}
            className="mb-8 rounded-lg border border-[#E2E0D9] bg-white p-4 md:p-5"
          >
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
              Find a trusted professional
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[13px] text-[#1E2420] outline-none focus:border-[#1E2420]"
              >
                <option value="">Service category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[13px] text-[#1E2420] outline-none focus:border-[#1E2420]"
              >
                <option value="">State</option>
                {states.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[13px] text-[#1E2420] outline-none focus:border-[#1E2420]"
              >
                <option value="">City</option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-md bg-[#F0821E] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#D5720F] font-['Space_Grotesk',sans-serif]"
              >
                <Search className="h-3.5 w-3.5" />
                Search
              </button>
            </div>
          </form>

          {/* Content grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left: recent pros + conversations */}
            <div className="space-y-8">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">
                    Recently contacted
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleNavigate("search")}
                    className="flex items-center gap-1 text-[12px] font-medium text-[#55605A] hover:text-[#1E2420]"
                  >
                    View all
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {isLoadingPros ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                      <SkeletonBlock key={i} className="h-[210px]" />
                    ))}
                  </div>
                ) : proList.length === 0 ? (
                  <EmptyState
                    icon={Search}
                    title="No professionals contacted yet"
                    hint="Run a search to find someone for your next job."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {proList.map((pro) => (
                      <ProTicketCard
                        key={pro.id}
                        pro={pro}
                        onMessage={handleMessagePro}
                        onToggleFavorite={handleToggleFavoriteOnPro}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">
                    Conversations
                  </h2>
                  <button
                    type="button"
                    onClick={() => onOpenInbox?.()}
                    className="flex items-center gap-1 text-[12px] font-medium text-[#55605A] hover:text-[#1E2420]"
                  >
                    Open inbox
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {isLoadingConversations ? (
                  <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                      <SkeletonBlock key={i} className="h-[60px]" />
                    ))}
                  </div>
                ) : conversationList.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No conversations yet"
                    hint="Messages with professionals will show up here."
                  />
                ) : (
                  <div className="divide-y divide-[#E2E0D9] rounded-lg border border-[#E2E0D9] bg-white">
                    {conversationList.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleOpenConversation(c)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F7F6F2]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFEDE6] text-[12px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
                          {c.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13px] font-semibold text-[#1E2420]">
                              {c.name}
                              <span className="ml-1.5 font-normal text-[#9A9488]">
                                · {c.trade}
                              </span>
                            </p>
                            <span className="shrink-0 text-[11px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                              {c.time}
                            </span>
                          </div>
                          <p className="truncate text-[12px] text-[#55605A]">
                            {c.preview}
                          </p>
                        </div>
                        {c.unread && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#F0821E]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right: notifications, favorites, profile */}
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">
                  Notifications
                </h2>
                {isLoadingNotifications ? (
                  <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                      <SkeletonBlock key={i} className="h-[52px]" />
                    ))}
                  </div>
                ) : notificationList.length === 0 ? (
                  <EmptyState icon={Bell} title="You're all caught up" />
                ) : (
                  <div className="space-y-2">
                    {notificationList.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleOpenNotification(n)}
                        className={`flex w-full items-start gap-2.5 rounded-md border border-[#E2E0D9] bg-white px-3 py-2.5 text-left transition-opacity hover:bg-[#F7F6F2] ${
                          n.read ? "opacity-60" : ""
                        }`}
                      >
                        <span
                          className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            n.kind === "success"
                              ? "bg-[#1E7A34]"
                              : n.kind === "action"
                              ? "bg-[#F0821E]"
                              : "bg-[#9A9488]"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-[12.5px] leading-snug text-[#1E2420]">
                            {n.text}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                            {n.time}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-3 text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">
                  Saved professionals
                </h2>
                {isLoadingFavorites ? (
                  <div className="space-y-2">
                    {[0, 1].map((i) => (
                      <SkeletonBlock key={i} className="h-[52px]" />
                    ))}
                  </div>
                ) : favoriteList.length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="No saved professionals yet"
                    hint="Tap the heart on a profile to save it here."
                  />
                ) : (
                  <div className="space-y-2">
                    {favoriteList.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between rounded-md border border-[#E2E0D9] bg-white px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-[#1E2420]">
                            {f.name}
                          </p>
                          <p className="truncate text-[11.5px] text-[#55605A]">
                            {f.trade} · {f.location}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove from saved"
                          onClick={() => handleUnsaveFavorite(f)}
                          className="shrink-0"
                        >
                          <Heart className="h-4 w-4 fill-[#F0821E] text-[#F0821E]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-lg border border-dashed border-[#D8D5CB] bg-white px-4 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                    Profile
                  </p>
                  <span className="text-[11px] font-['IBM_Plex_Mono',monospace] text-[#1E2420]">
                    {profileCompletion}%
                  </span>
                </div>
                <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[#EFEDE6]">
                  <div
                    className="h-full rounded-full bg-[#1E7A34]"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="mb-3 flex items-center gap-1.5 text-[12px] text-[#55605A]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7A34]" />
                  Add your address to see closer matches
                </p>
                <button
                  type="button"
                  onClick={() => onCompleteProfile?.()}
                  className="w-full rounded-md border border-[#1E7A34] py-2 text-[12.5px] font-semibold text-[#1E7A34] transition-colors hover:bg-[#1E7A34] hover:text-white font-['Space_Grotesk',sans-serif]"
                >
                  Complete profile
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#E2E0D9] bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        {NAV_CONFIG.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const badge = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className="relative flex flex-col items-center gap-1 px-2 py-1"
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-[#1E2420]" : "text-[#9A9488]"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-[#1E2420]" : "text-[#9A9488]"
                }`}
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