# ANSARY — Multilingual Portal & Progressive Web App (PWA)

> **Knowledge, Literature, Technology & News**  
> *پوهه، ادب، ټیکنالوژي او خبرونه*  
> *دانش، ادبیات، تکنالوژی و اخبار*

ANSARY is an enterprise-grade multilingual web application and Progressive Web App (PWA) founded by **Hazrat Shah Ansary**. It combines journalism, classical literature and poetry, digital library collections, educational engineering articles, and database project showcases.

---

## Key Features

### 1. Multilingual & Dual-Direction (RTL/LTR)
- **Pashto (`ps` - RTL)**: Native Afghan typography and authentic terminology.
- **Dari (`fa` - RTL)**: Elegant Persian typography with traditional poetic formatting.
- **English (`en` - LTR)**: Clean international typography.
- **Independent Publishing**: The administrator can publish any post in whichever language they choose without mandatory translation.

### 2. Main Portal Sections
1. **Home**: Hero marquee with breaking news ticker, quick pillars, and PWA install prompt.
2. **Latest News**: Subcategories for Sports, Domestic News, International News, and Announcements.
3. **Books & Library**: Downloadable PDF books, page counters, and interactive digital folio previews.
4. **Poetry**: Classical two-hemistich strophes (*بیتونه*), ghazals, and audio recitation simulator.
5. **Videos**: Recorded lectures, database seminars, and full-screen modal player.
6. **Articles & Education**: Software architecture, distributed systems, and literature essays.
7. **Our Projects**: Professional database advertisements and portfolio showcases highlighting architecture, tech stacks, and security assurances (ensuring private databases and connection strings are never exposed).
8. **About Me**: Biography, mission, and portrait of Hazrat Shah Ansary.
9. **Contact Us**: Direct channels (`hazrat.shah.ansary@gmail.com`) and an interactive inquiry form protected with anti-spam math verification.

### 3. Content Interaction (No Account Required)
- **Likes & Dislikes**: Real-time counter updates with toggle states.
- **Comments**: Public visitors can submit comments without registration.
- **Anti-Spam Protection**: Dynamic math verification challenge.
- **Comment Moderation**: Admin moderation queue to approve, reject, or delete comments.
- **Share**: Native Web Share API with clipboard fallback.

### 4. Progressive Web App (PWA)
- Installable on **Android, iPhone/iPad, Windows, and macOS**.
- Offline reading for cached articles, books, and poetry.
- Reconnection detection and automatic data synchronization indicator.
- Custom vector emblem and compliant PNG icons (`192x192`, `512x512`, `maskable`, `apple-touch-icon`).
- Guided iOS Safari "Add to Home Screen" instructions.

### 5. Secure Administrator Dashboard & Supabase Auth
- **Access**: Click the shield icon in the top header.
- **Authentication**: Fully secured by Supabase Auth (supports password login and cryptographic magic link / OTP).
- **Zero Hardcoded Passkeys**: All credentials and sessions are authenticated via Supabase JWTs.
- **Strict Authorization**: Only the authorized administrator account (`hazrat.shah.ansary@gmail.com`) can access administrative publishing and moderation routes.
- **Live Analytics**: Real-time tracking of Total visitors, page views, likes & dislikes, comment totals, PWA installs, and active users.
- **Publishing Suite**: Add news, books, videos, poetry, and projects on any desktop or mobile device.
- **Row Level Security (RLS)**: Enforces email-bound authorization at the PostgreSQL engine level so only `hazrat.shah.ansary@gmail.com` can perform write operations.

---

## Supabase & Vercel Deployment

1. **Supabase Setup**:
   - Create a free project at [supabase.com](https://supabase.com).
   - In Supabase SQL Editor, copy and execute the SQL schema provided in the **Admin Dashboard > Supabase & SQL** tab.
   - Copy your `Project URL` and `Anon Key` into the Admin Dashboard settings.

2. **Vercel Deployment**:
   - Push this repository to GitHub.
   - Import the repository on [vercel.com](https://vercel.com).
   - Set build command to `npm run build` and output directory to `dist`.
