# School-Cost Agent Context

## Project
Okul Maliyet Endeksi - Anonymous school cost sharing platform for Turkey.

## Tech Stack
- Next.js 15 (App Router)
- Supabase (PostgreSQL, Auth, Storage)
- Tailwind CSS + Shadcn UI
- Zod, Zustand

## Key Decisions
- Reference code: Yes (for user updates)
- Verification: Yes (is_verified, manual for MVP)
- Seed data: Yes
- Context7: Use for Next.js/Supabase docs when needed

## Database
- schools, costs tables
- RLS: read verified only; insert anonymous

## Context7 Library IDs
- Next.js: /vercel/next.js
- Supabase SSR: /supabase/ssr
- Supabase: /supabase/supabase
