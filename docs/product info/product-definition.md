# Product Definition Summary: BankingPrep (Working Name)

## Elevator Pitch

BankingPrep is a mobile-first quiz app that lets investment banking interview candidates practice technical questions on the go through gamified, bite-sized rounds — like Duolingo for finance — which is better than existing prep courses (Wall Street Prep, BIWS) because those require sitting at a laptop with 8-hour video courses, while real retention comes from daily spaced repetition you can do anywhere.

---

## Target User

### Primary User: The IB Recruit

- College juniors/seniors and MBA students actively recruiting for investment banking summer analyst or full-time analyst positions
- They've already decided IB is the path — they don't need convincing, they need drilling
- Currently prepping with a patchwork of: Wall Street Oasis forums, BIWS/WSP video courses, personal notes, peer mock interviews
- Pain point: they KNOW they should be practicing technicals daily but the existing tools require laptop + long sessions, so they cram instead of building durable knowledge
- Emotional driver: anxiety about blanking on a "walk me through a DCF" question in a live interview. They want confidence that the material is locked in.
- Lives on: Reddit (r/financialcareers), Wall Street Oasis forums, LinkedIn, finance TikTok/YouTube

### Secondary User: Career Switchers

- Professionals pivoting into IB from consulting, accounting, or other finance roles
- Similar needs but potentially rustier on fundamentals
- Same app, just might start at a lower difficulty level

---

## Core Loop

**Open app → Start a practice round (5-10 questions) → Answer questions with instant feedback → See score + XP earned → Weak areas flagged for repeat → Come back tomorrow to protect streak**

Each round takes 3-5 minutes. Satisfying on its own. No dependencies on other features.

---

## What Makes It Different

### Competitive Landscape

| Product | Format | Price | Gap |
|---------|--------|-------|-----|
| Wall Street Prep | Video courses + Excel models | $200-500 | Passive learning, laptop-required, no active recall |
| Breaking Into Wall Street | Video courses + guides | $200-500 | Same issues as WSP |
| Wall Street Oasis | Forums + paid guides | Free-$30/mo | Unstructured, no drilling system |
| Mergers & Inquisitions | Blog + courses | $200-500 | Content-heavy, no practice mode |
| Peak Frameworks | Video + community | $150-400 | Course-based, not drill-based |

### Our Differentiation

1. **Active recall vs. passive consumption** — You answer questions, you don't watch someone explain them
2. **Mobile-first, bite-sized** — 3-5 minute rounds, not 8-hour courses
3. **Gamification drives retention** — Streaks, XP, leagues, and progression make daily practice a habit, not a chore
4. **Spaced repetition** — Weak areas resurface automatically. The app remembers what you don't.
5. **Price accessibility** — Freemium model at a fraction of existing course prices

The closest analog is LeetCode for software engineers or Duolingo for languages. Nobody has built this for IB technicals.

---

## Business Model

### Revenue Model: Freemium

- **Free tier:** Limited question bank (e.g., 50 core questions), basic progress tracking, daily practice with ads or limited hearts
- **Pro tier ($9.99-14.99/month or $79.99/year):** Full question bank (500+ questions), unlimited hearts, all topics unlocked, detailed analytics, streak freezes, leaderboard access
- **Potential add-ons later:** Mock interview mode, behavioral question bank, premium topic packs (PE, credit, restructuring)

### Why This Works

- The target user is already spending $200-500 on prep — $10-15/month is a no-brainer if it works
- Recurring subscription during a defined prep window (3-6 months of active recruiting)
- Content is the moat — curated by someone who actually tutors IB candidates and knows what gets asked

### Monetization Timeline

- MVP: Completely free. Focus on validating the core loop and getting feedback.
- V1: Introduce freemium paywall after proving retention. Need enough content to justify paid tier.

---

## The Vibe

### Personality: Competitive, Clean, Confident

- **Duolingo's gamification energy** — streaks, XP, levels, satisfying animations on correct answers
- **But more mature/professional** — this isn't childish. Users are future bankers. Think dark mode, sharp typography, financial aesthetic
- **Confidence-building tone** — "You're getting sharper" not "Good job!" The voice respects their intelligence
- **Visual direction:** Dark mode default. Clean sans-serif type. Accent colors (green for correct, red for wrong, gold for achievements). Think Bloomberg Terminal meets Duolingo
- **Brand voice:** Direct, slightly competitive, knowledgeable. Like a sharp senior analyst who's helping you prep, not a cartoon owl

### Reference Products (Vibe, Not Function)

- **Duolingo** — gamification system, streak psychology, daily habit loop
- **LeetCode** — topic categorization, difficulty progression, interview-specific framing
- **Robinhood** — clean financial UI, dark mode, satisfying micro-interactions
- **Strava** — social competition through leaderboards without being a social network

---

## Open Questions

1. **App name** — "BankingPrep" is a working title. Need something catchable. (Not blocking — can launch MVP with any name)
2. **Content scope for MVP** — How many questions needed for launch? Recommendation: 100-150 across core topics
3. **User accounts at MVP** — Do we need accounts for MVP or can we start with local-only progress? Recommendation: Local-only for MVP, accounts for V1
4. **Leaderboards feasibility for V1** — Requires a backend and user accounts. Likely a V1 feature, not MVP
5. **App Store pricing strategy** — Need to research what IB prep users actually pay for app subscriptions vs. one-time purchases

---

## Recommended Next Steps

1. ✅ Product Definition (this document)
2. → **MVP PRD** — Exact feature spec for what gets built first
3. → **V1 Roadmap** — What comes after MVP
4. → **Technical Spec** — Architecture, tech stack, data model
5. → **Design Spec / Wireframes** — Screen-by-screen UI
6. → **Build MVP** — Code it
7. → **Beta test** — Get it in front of 10-20 real IB candidates
8. → **Iterate → V1 → App Store**
