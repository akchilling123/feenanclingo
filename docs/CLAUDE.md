# CLAUDE.md

## Project: Feenancelingo

Duolingo-style gamified quiz app for investment banking technical interview prep. Mobile-first web app (PWA), no backend.

## Tech Stack
- React 18 + TypeScript + Vite + Tailwind CSS
- React Router for navigation
- localStorage for persistence (no backend, no database)
- Question content stored as static JSON files

## Architecture
- All state is client-side. No API calls, no auth, no server
- Questions load from `/src/data/*.json` at build time
- User progress persists in localStorage
- App must work fully offline once cached

## Key Design Decisions
- Dark mode default (#0F1419 background)
- Mobile-first — all layouts designed for phone screens
- Tappable card UI for answer selection (not radio buttons)
- Instant feedback after every answer (no loading states)
- XP system: Easy=5, Medium=10, Hard=20 per correct answer
- Levels: Analyst I → Analyst II → Analyst III → Associate → VP → Director → MD → Partner
- Spaced repetition: missed questions resurface, exit queue after 2 correct reviews

## Code Style
- Strict TypeScript — no `any` types
- Functional components with hooks
- Custom hooks for business logic (useXP, useStreak, useQuestionEngine, etc.)
- Tailwind for all styling — no CSS files
- Component files use PascalCase, hooks use camelCase with `use` prefix

## Reference Docs
- `docs/product-definition.md` — Vision, target user, business model
- `docs/mvp-prd.md` — Full MVP spec with user flows and data model
- `docs/v1-roadmap.md` — Post-MVP feature roadmap
