# JanMitra AI — Build Plan

A premium, startup-style SaaS for AI-powered civic issue reporting. Built on TanStack Start + Lovable Cloud (Supabase) + Lovable AI (Gemini Vision).

## Phase 1 — Foundation
- Enable **Lovable Cloud** (database, auth, storage)
- Provision **Lovable AI Gateway** key for Gemini Vision + complaint generation
- Set up design system in `src/styles.css`:
  - Saffron gradient primary (`oklch` deep orange → amber)
  - Indigo blue secondary
  - Emerald green accent
  - Off-white / near-black backgrounds, dark mode toggle
  - Glassmorphism utility classes, premium shadows, rounded cards
- Add **Framer Motion**, **React Leaflet**, **Lucide**, **Sonner** (toasts), **next-themes**-style theme provider
- Dark mode toggle (persisted)

## Phase 2 — Auth
- Supabase email/password + Google OAuth (managed via `lovable.auth.signInWithOAuth`)
- Email verification gate
- Pages: `/auth/signup`, `/auth/login`, `/auth/verify`, `/auth/forgot-password`, `/auth/reset-password`
- Password strength meter, zod validation, toast errors
- `_authenticated` layout gates `/app/*` routes (also checks `email_confirmed_at`)

## Phase 3 — Database (migrations)
- `profiles` (id → auth.users, full_name, avatar_url, created_at) + auto-create trigger
- `reports` (id, user_id, image_url, issue_type, severity, description, authority, location lat/lng, address, status, subject, complaint_body, created_at)
- `community_support` (id, report_id, user_id, created_at, unique pair)
- RLS: users CRUD own reports; everyone reads reports for community map; support own row
- Storage bucket `report-images` (public read)

## Phase 4 — Landing Page (`/`)
- Glass navbar (Home, Features, Community Pulse, About, Login, Get Started)
- Hero with animated gradient orb, floating issue cards
- Features grid (AI Vision, Smart Complaint, Authority Routing, Community Map)
- How It Works (6-step animated pipeline)
- Testimonials, footer

## Phase 5 — Dashboard Shell (`/app`)
- Sidebar (Dashboard, Report Issue, My Reports, Community Pulse, Profile, Settings) — collapsible
- Top navbar: search, notifications, theme toggle, profile menu
- `/app` home: welcome, 4 stat cards, recent activity, quick actions, charts (recharts)

## Phase 6 — Report Issue Flow (`/app/report`)
6-step wizard with progress bar + framer-motion transitions:
1. Upload image (dropzone, preview)
2. Location (Leaflet map, geolocation / manual pin)
3. AI Analysis — server fn calls Gemini Vision (`google/gemini-2.5-flash`) returns issue_type, severity, description
4. Authority detection (rule-based map of category → Telangana authority: GHMC, HMWSSB, TSSPDCL, Traffic Police, etc.)
5. Complaint generation — Gemini text gen; editable; regenerate / translate (Hindi/Telugu) / copy
6. Submit → upload image to storage, insert report, success animation, redirect to /app/reports

## Phase 7 — My Reports (`/app/reports`)
- Card grid; filter (All/Pending/Resolved), search, status badges, detail dialog

## Phase 8 — Community Pulse (`/app/community`)
- Full-screen Leaflet map, color-coded markers, popup with image/support button
- Realtime updates via Supabase channel
- Public preview also at `/community` (read-only)

## Phase 9 — Profile & Settings
- Avatar, name edit, stats, badge grid, theme + notification settings, sign-out

## Phase 10 — Polish
- Skeleton loaders, empty states, error boundaries, 404 page
- SEO meta on every public route
- `sitemap.xml`, `robots.txt`

## Technical notes
- All AI calls in `createServerFn` handlers, calling Lovable AI Gateway (`google/gemini-2.5-flash`)
- Image upload via Supabase storage from server fn (signed); client gets public URL
- Leaflet loaded client-only (`<ClientOnly>` wrapper) to avoid SSR window errors
- All routes typed; design tokens only (no raw color classes)

Ready to build — this will be a large multi-step implementation. Shall I proceed?
