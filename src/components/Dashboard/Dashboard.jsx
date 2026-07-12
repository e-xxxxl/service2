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
} from "lucide-react";

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
 */

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "search", label: "Find a pro", icon: Search },
  { id: "messages", label: "Messages", icon: MessageCircle, badge: 2 },
  { id: "favorites", label: "Saved", icon: Heart },
  { id: "notifications", label: "Alerts", icon: Bell, badge: 3 },
  { id: "profile", label: "Profile", icon: User },
];

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "AC Repair & Installation",
  "Painting",
  "Tiling",
  "Generator Repair",
  "Cleaning",
];

const STATES = ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano"];
const CITIES = ["Ikeja", "Lekki", "Wuse II", "Garki", "Port Harcourt"];

const RECENT_PROS = [
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
  },
];

const CONVERSATIONS = [
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

const NOTIFICATIONS = [
  {
    id: 1,
    text: "Chidi Okonkwo accepted your job request",
    time: "1h ago",
    kind: "success",
  },
  {
    id: 2,
    text: "New review request: rate your job with Femi Adeyemi",
    time: "1d ago",
    kind: "action",
  },
  {
    id: 3,
    text: "Suleiman Yaro sent you a quote",
    time: "2d ago",
    kind: "message",
  },
];

const FAVORITES = [
  { name: "Chidi Okonkwo", trade: "Electrician", location: "Ikeja, Lagos" },
  { name: "Blessing Nwachukwu", trade: "Cleaner", location: "Garki, Abuja" },
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

function ProTicketCard({ pro }) {
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
        <span className="shrink-0 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#9A9488]">
          {pro.id}
        </span>
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

      <button className="flex w-full items-center justify-center gap-1.5 border-t border-[#E2E0D9] py-2.5 text-[12px] font-semibold text-[#1E2420] transition-colors hover:bg-[#F7F6F2] font-['Space_Grotesk',sans-serif]">
        Message {pro.name.split(" ")[0]}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const customerName = "Ada";

  return (
    <div className="min-h-screen w-full bg-[#F5F4F0] text-[#1E2420] font-['Inter',sans-serif] pb-20 md:pb-0">
      <div className="mx-auto flex max-w-[1240px]">
        {/* Sidebar — desktop only */}
        <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col justify-between border-r border-[#E2E0D9] px-4 py-6 md:flex">
          <div>
            <div className="mb-8 flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-gradient-to-br from-[#F0B429] via-[#F0821E] to-[#1E7A34] text-[13px] font-bold text-white font-['Space_Grotesk',sans-serif]">
                9j
              </div>
              <span className="text-[14px] font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
                9jaTradiesPages
              </span>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
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
                    {item.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-['IBM_Plex_Mono',monospace] ${
                          isActive
                            ? "bg-[#F0821E] text-white"
                            : "bg-[#FBE0C4] text-[#B85E10]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1 border-t border-[#E2E0D9] pt-4">
            <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-[#55605A] hover:bg-[#EFEDE6] hover:text-[#1E2420]">
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
              <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E0D9] bg-white text-[#55605A] hover:text-[#1E2420]">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#F0821E]" />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E7A34] text-[12px] font-semibold text-white font-['Space_Grotesk',sans-serif]">
                {customerName[0]}
              </div>
            </div>
          </div>

          {/* Quick find panel */}
          <div className="mb-8 rounded-lg border border-[#E2E0D9] bg-white p-4 md:p-5">
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
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[13px] text-[#1E2420] outline-none focus:border-[#1E2420]"
              >
                <option value="">State</option>
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-md border border-[#E2E0D9] bg-[#FBFAF8] px-3 py-2.5 text-[13px] text-[#1E2420] outline-none focus:border-[#1E2420]"
              >
                <option value="">City</option>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button className="flex items-center justify-center gap-1.5 rounded-md bg-[#F0821E] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#D5720F] font-['Space_Grotesk',sans-serif]">
                <Search className="h-3.5 w-3.5" />
                Search
              </button>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left: recent pros + conversations */}
            <div className="space-y-8">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">
                    Recently contacted
                  </h2>
                  <button className="flex items-center gap-1 text-[12px] font-medium text-[#55605A] hover:text-[#1E2420]">
                    View all
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {RECENT_PROS.map((pro) => (
                    <ProTicketCard key={pro.id} pro={pro} />
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">
                    Conversations
                  </h2>
                  <button className="flex items-center gap-1 text-[12px] font-medium text-[#55605A] hover:text-[#1E2420]">
                    Open inbox
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-[#E2E0D9] rounded-lg border border-[#E2E0D9] bg-white">
                  {CONVERSATIONS.map((c) => (
                    <button
                      key={c.id}
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
              </section>
            </div>

            {/* Right: notifications, favorites, profile */}
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">
                  Notifications
                </h2>
                <div className="space-y-2">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-2.5 rounded-md border border-[#E2E0D9] bg-white px-3 py-2.5"
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
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">
                  Saved professionals
                </h2>
                <div className="space-y-2">
                  {FAVORITES.map((f) => (
                    <div
                      key={f.name}
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
                      <Heart className="h-4 w-4 shrink-0 fill-[#F0821E] text-[#F0821E]" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-dashed border-[#D8D5CB] bg-white px-4 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
                    Profile
                  </p>
                  <span className="text-[11px] font-['IBM_Plex_Mono',monospace] text-[#1E2420]">
                    80%
                  </span>
                </div>
                <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[#EFEDE6]">
                  <div className="h-full w-4/5 rounded-full bg-[#1E7A34]" />
                </div>
                <p className="mb-3 flex items-center gap-1.5 text-[12px] text-[#55605A]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7A34]" />
                  Add your address to see closer matches
                </p>
                <button className="w-full rounded-md border border-[#1E7A34] py-2 text-[12.5px] font-semibold text-[#1E7A34] transition-colors hover:bg-[#1E7A34] hover:text-white font-['Space_Grotesk',sans-serif]">
                  Complete profile
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-[#E2E0D9] bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
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
              {item.badge && (
                <span className="absolute -top-0.5 right-1 h-1.5 w-1.5 rounded-full bg-[#F0821E]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}