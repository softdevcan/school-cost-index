# Project Structure

All folder and file names are in English. UI labels remain in Turkish for the target audience.

## Directory Layout

```
src/
├── components/             # Shared UI components
│   └── map/                # Leaflet map components
│       ├── map-picker.tsx  # Location picker for submit form
│       └── school-map.tsx  # Schools on map for search
├── app/                    # Next.js App Router (routes = URL paths)
│   ├── page.tsx            # / (home)
│   ├── layout.tsx
│   ├── globals.css
│   ├── search/             # /search - school cost search
│   │   ├── page.tsx
│   │   └── school-search.tsx
│   └── submit/             # /submit - anonymous cost entry
│       ├── page.tsx
│       ├── cost-entry-form.tsx
│       └── actions.ts
├── lib/
│   ├── constants/          # Shared constants (routes, etc.)
│   ├── supabase/           # Supabase client (server, browser)
│   ├── utils/              # Pure utilities (statistics, etc.)
│   └── validations/        # Zod schemas
├── types/                  # TypeScript types
└── test/                   # Test setup
```

## Conventions

- **Routes**: Use `ROUTES` from `@/lib/constants/routes` instead of hardcoded paths
- **New features**: Add route under `app/<feature>/` (e.g. `app/compare/` for school comparison)
- **Shared components**: Use `components/` when reused across multiple routes
