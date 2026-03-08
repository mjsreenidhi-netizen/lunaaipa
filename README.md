# LunaRhythm 🌙

> AI-powered cycle tracking that syncs your work and personal life with your natural rhythms.

## Phase 1 Features

- **Google OAuth Authentication** via Supabase
- **Structured Onboarding Flow** — 3-step form collecting personal, cycle, and goal data
- **Dual Realm Dashboard** — Work and Personal realms with persistent toggle
- **Mock AI Service** — Foundation for AI insights (ready for OpenAI integration)
- **Dark Pastel Theme** — Medieval feminine aesthetic with lavender/rose accents

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom LunaRhythm theme
- **Database/Auth**: Supabase (PostgreSQL + Row Level Security)
- **UI Components**: Custom components with Radix UI primitives
- **Forms**: React Hook Form + Zod validation

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/migrations/001_initial_schema.sql`
3. Enable Google OAuth:
   - Authentication > Providers > Google
   - Add your Google OAuth credentials from Google Cloud Console
   - Add redirect URL: `http://localhost:3000/auth/callback`

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase URL and keys from your project settings.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── login/             # Google OAuth login
│   ├── auth/callback/     # OAuth callback handler
│   ├── onboarding/        # 3-step onboarding flow
│   └── dashboard/         # Main dashboard
├── components/
│   ├── auth/              # Auth components
│   ├── dashboard/         # Dashboard components
│   ├── onboarding/        # Onboarding form
│   └── ui/                # Reusable UI components
├── contexts/
│   └── RealmContext.tsx   # Work/Personal realm state
├── lib/
│   ├── ai/                # Mock AI service
│   ├── supabase/          # Supabase client utilities
│   └── utils/             # Date, timezone helpers
└── types/                 # TypeScript type definitions
```

## Realm System

LunaRhythm has two realms:

- **🌙 Personal** — Cycle tracking, wellness insights, body literacy
- **💼 Work** — Productivity alignment, career insights, energy optimization

The realm toggle persists to the database so your preference is remembered across sessions.

## AI Service

The mock AI service (`src/lib/ai/mock-service.ts`) provides:

- Cycle phase analysis based on cycle data
- Daily insights tailored to realm (work/personal)
- Productivity tips per cycle phase
- Wellness tips per cycle phase

Replace with real OpenAI integration in Phase 2 by implementing the `AIServiceInterface`.

## Database Schema

See `supabase/migrations/001_initial_schema.sql` for the full schema.

Key table: `public.users` — extends Supabase auth with cycle tracking and preferences.
# LunaAI
