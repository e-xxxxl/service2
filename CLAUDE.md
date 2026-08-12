# 9jaTradiesPages — Project Context & Handoff

Nigerian service-provider marketplace. Two separate repos/deployables:

- **Frontend** (this repo): `C:\Users\HP\Desktop\Services\serviceprovider` — React 19 + Vite + Tailwind 4, deployed on Vercel.
- **Backend**: `C:\Users\HP\Desktop\Services\server` (sibling folder) — Express + Mongoose (MongoDB Atlas), Socket.io, deployed on Render at `https://service-server-e64r.onrender.com/api`.

Both are separate git repos. Nothing has been pushed/deployed yet as of this handoff — all work below is local, uncommitted.

**The MongoDB the backend connects to is production data.** There is no separate dev/test database. When testing locally, always use clearly-labeled disposable accounts (e.g. `phase1test.customer@example.com`) and delete them afterward via a throwaway script — see "How this project tests changes" below.

## How to run locally

Backend: `cd server && node index.js` (needs `server/.env` — see `.env.example`, real secrets already present in the actual `.env`, including working Paystack **test** keys).
Frontend: `cd serviceprovider && npm run dev`, or via the Claude Code preview tool with `.claude/launch.json` (already configured, name `"frontend"`). Needs `serviceprovider/.env.local` with `VITE_API_URL=https://service-server-e64r.onrender.com/api` (or the live Render URL) and `VITE_PAYSTACK_PUBLIC_KEY` (already set).

Kill stray `node` processes before starting a fresh one — this Windows/git-bash environment doesn't always clean up backgrounded servers (`powershell -Command "Get-Process node | Stop-Process -Force"`).

## How this project tests changes (important pattern, keep using it)

There's no staging environment. The pattern used throughout this work:
1. Write a **temporary** seed script in `server/scripts/` that creates disposable test accounts/data using the real models directly (not through signup+email verification, which can't be automated here).
2. Run it, capture the returned IDs/JWTs.
3. Boot the backend, exercise the real HTTP/Socket.io endpoints with curl or a small throwaway Node script (`socket.io-client` is only in the frontend's `node_modules`, so socket test scripts must live under `serviceprovider/` and use `.cjs` extension since the frontend `package.json` has `"type": "module"`).
4. Write and run a **temporary** cleanup script that deletes exactly what was created.
5. **Delete the temporary scripts themselves** when done — none should be committed.

This is how the Paystack payment flow (real test-key API calls + a correctly HMAC-signed synthetic webhook) and the Socket.io real-time flow were verified end-to-end in earlier sessions. Reuse it for Phase 3.

## Architecture quick reference

- **Auth**: JWT (`config/jwt.js`, no hardcoded fallback — fails hard if `JWT_SECRET` missing). `middleware/auth.js` exports `protect`/`authorize`. Admin is a separate `Admin` model/collection, not `User`.
- **Real-time**: `server/socket.js`. REST controllers are the *only* place that ever writes a message/notification — sockets are broadcast-only. Two shared helpers, always use these instead of raw `Notification.create()` / manual socket emits:
  - `services/notificationService.js` → `notifyUser(userId, {text, kind, relatedConversation})` — persists + pushes `notification:new` live.
  - `socket.js` → `emitNewMessage({conversationId, recipientUserId, message, senderName})` — pushes `message:received` (to the conversation room) + `message:notification` (to the recipient's user room).
  - Frontend: `src/hooks/useSocket.js`, one connection per dashboard, passed down as `socket`/`socketConnected` props into the chat components.
- **Locations**: Nigerian states/LGAs are canonical in `server/data/nigeriaLocations.js` (single source of truth — do not hardcode location lists anywhere else). Served via `/api/locations/*`. Frontend fetches once via `src/hooks/useLocations.js` (sessionStorage-cached).
- **Payments**: Real Paystack integration in `server/controllers/paymentController.js`. Customer pays the full quote `totalAmount`; a **15% platform commission is taken from the workmanship portion only** (not materials/other costs) and the provider's wallet is credited `providerPayout = totalAmount - commission`. Webhook (`POST /api/payment/webhook`, raw body, HMAC-verified) and `/api/payment/verify/:reference` both flow through one idempotent `fulfillPayment()` — atomic `findOneAndUpdate` on `Transaction.status: 'pending' → 'success'` is what guarantees no double-crediting.
- **Contact info**: Never returned by search/profile endpoints (`.select('-phone -email')` at the query level). Only unlocked per-conversation after payment, via `conversation.contactUnlocked` + a dedicated reveal endpoint (`GET /:role/messages/:conversationId/contact`).
- **Jobs currently live inside `Conversation` documents**, not a separate `Job` collection — see `models/Conversation.js`: `bookingStatus` (`none/quote_sent/quote_accepted/pending_payment/active/in_progress/completed/cancelled/disputed`) and `job: {deadline, startedAt, completedAt}`. `providerController.startJob` / `completeJob` (routes: `POST /api/provider/jobs/:conversationId/start` / `/complete`) transition it. **This will need to change for Phase 3 — see below.**
- **Support/complaints**: Real two-way chat (`models/SupportThread.js`, `controllers/supportController.js`), not the old fake one-off report. Customer/provider: `GET/POST /api/support/thread`. Admin: `/api/admin/support/threads*`. Frontend shared component: `src/components/support/SupportChat.jsx`, used by both dashboards.
- **Design tokens**: `src/index.css` `:root` — reconciled palette (`--color-primary` etc.), Inter/Space Grotesk/IBM Plex Mono now actually loaded in `index.html` (previously referenced everywhere but never loaded).

## What's been completed (chronological)

**Phase 1** — Security hardening (rate limiting wired up, JWT hardening, login lockout, mass-assignment fix, forgot/reset-password flow), Nigerian location system, backend-enforced contact protection, real Paystack payment + wallet, design tokens, chat/quote/payment UI pass, responsiveness pass.

**Phase 2** — Real-time chat over Socket.io (was connected but completely unused before this): live messages, typing indicators, read receipts, live notification bell, connection/reconnect UI. Consolidated the two divergent message-write paths (REST vs. socket) down to one (REST).

**Batch fixes round** (most recent, see git status for exact file list) — in no particular order: replaced the LGA dataset with a user-provided canonical list; fixed a "Welcome Pro" loading-flash bug; fixed customer profile fullName/state/city never actually persisting (User model didn't even have state/city fields); fixed a Google OAuth timing bug (AuthContext not refreshed after redirect) and a dead-end for new provider signups; 5-min rate limit cooldown; renamed quote fields Labour→Workmanship, Fee→Other costs (optional), added the 15% commission; added `startJob`/`completeJob` (single-step, provider-only — **superseded by the two-step flow requested below**); desktop quote popup redesign; provider dashboard mobile responsiveness + hamburger drawer (logout was completely unreachable on mobile before); added Help tab to provider dashboard; admin dashboard today's-revenue + ongoing-jobs stat cards + modal; rebuilt admin "Reports" as the real two-way `SupportThread` chat; fixed a provider notification stored under the wrong ID (ServiceProvider id instead of User id); fixed availability toggle not reverting on failed save.

## Known bugs to fix in Phase 3 (diagnosed, not yet fixed)

**Provider dashboard "Active Jobs" card is broken.** Root cause confirmed: `server/controllers/providerController.js` `getDashboard()` hardcodes `activeJobs: []` (line ~413) — it was never wired up to real data. The frontend (`ProviderDashboard.jsx`, `DashboardView` → `JobCard` around line 2474) is *also* stale: `JobCard` renders `job.title`/`job.description`/`job.location` with Accept/Decline buttons — that's leftover shape from the old stubbed job-posting concept, not the current paid-conversation model. Fix needs both sides:
- Backend: query `Conversation.find({professional: provider._id, bookingStatus: {$in: ['active','in_progress']}})` and map to a real shape (customer name, service type, amount, status, deadline, conversationId).
- Frontend: redesign `JobCard` to match (no accept/decline — that's not a thing anymore; instead a "View conversation" / status display, matching the job-lifecycle UI already built into `MessagesView`'s chat header).

## Phase 3 scope (requested, not yet started)

1. **Customer-facing job list + progress view.** Customers currently have no way to see "my jobs" outside of digging through conversations. Needs a dedicated view (new tab in `Dashboard.jsx`, mirroring the provider wallet/jobs pattern) listing their paid/active/completed jobs with status and progress (quote sent → accepted → paid/active → in_progress → completed).
2. **Fix the broken "Active Jobs" card** on the provider dashboard (see above — root cause already diagnosed).
3. **Add a dedicated "Jobs" tab to the provider dashboard** (distinct from the dashboard-home card) listing all their jobs (active/in_progress/completed), and make completed-job data actually reflect on the provider's public profile (`ProviderProfileModal.jsx` / `customerController.getProviderProfile`) — `completedJobs` count and years of experience are already fields on `ServiceProvider`, but verify they're actually being incremented/displayed correctly end-to-end (the old `completeJob` incremented `completedJobs` — confirm this survives whatever the two-step completion flow below becomes).
4. **Two-step job completion** (this changes the existing single-step flow from the last batch): provider clicks "mark job completed" → job enters a new intermediate state (e.g. `pending_completion`, *not* `completed` yet) → customer gets notified and must confirm/accept before it's actually finalized to `completed`. This needs:
   - A new `bookingStatus` value (or reuse `job.completedAt` as "provider marked, awaiting confirmation" vs. a new `job.customerConfirmedAt`).
   - Backend: modify `providerController.completeJob` to set the pending state instead of finalizing; add a new customer-side endpoint (e.g. `POST /api/customer/jobs/:conversationId/confirm-completion`) that finalizes it, increments `ServiceProvider.completedJobs` at *that* point (not when the provider marks it), and notifies the provider.
   - Frontend: provider's job UI shows "Awaiting customer confirmation" after clicking complete; customer's job view/chat shows a "Confirm job completed" action.
   - Decide (ask the user if unclear) whether the customer can *reject* the completion claim, and what happens then (dispute? back to in_progress?) — the `disputed` bookingStatus value already exists in the schema for this.

## Conventions established this session (keep following these)

- Never mutate `Notification`/message-sending logic without going through `notifyUser`/`emitNewMessage`.
- New location data goes only in `server/data/nigeriaLocations.js`.
- Always validate state/LGA combinations server-side (see `isValidState`/`isValidLga` usage pattern in `models/User.js`, `models/ServiceProvider.js`, `authController.updateProfile`, `providerController.setupProfile`).
- Never trust frontend-reported payment status — server-side Paystack verify/webhook only.
- Delete dead/duplicate code when found rather than leaving it (several instances of this already cleaned up — check for more before adding new features on top of old stubs).
- Run `npx eslint <changed files>` and `npm run build` after frontend changes; `node -c <file>` for backend syntax checks. The codebase has ~30 pre-existing lint errors (mostly `react-hooks/set-state-in-effect`, empty blocks, "cannot access variable before declared") that are **not** regressions — baseline noise, don't chase them, just make sure you haven't added new `no-undef` errors.
- No screenshot capability in this environment's Browser pane (pane doesn't composite) — verify UI changes via `read_page`/`get_page_text`/`read_console_messages`/`read_network_requests` instead of screenshots.
