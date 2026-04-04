# Claude Code Kickoff Prompt for Feenancelingo MVP

Copy and paste the following into Claude Code from the root of your project directory.
Make sure the PRD files (product-definition.md, mvp-prd.md, v1-roadmap.md) are in the project root or a /docs folder.

---

## THE PROMPT

```
Read the files in this project: product-definition.md, mvp-prd.md, and v1-roadmap.md. These are the product definition, MVP PRD, and V1 roadmap for Feenancelingo — a Duolingo-style gamified quiz app for investment banking technical interview prep.

Your job is to build the MVP as specified in the PRD. Here's what you're building and the order to build it:

## Tech Stack
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- LocalStorage for persistence (no backend)
- PWA-ready with service worker

## Project Structure
```
src/
  components/        # Reusable UI components
    ui/              # Button, Card, ProgressBar, etc.
    questions/       # QuestionCard, MultipleChoice, NumericInput, TrueFalse, Conceptual
    rounds/          # RoundConfig, RoundProgress, RoundComplete
    navigation/      # BottomNav, Header
  pages/             # Top-level route pages
    Home.tsx
    Practice.tsx
    Review.tsx
    Progress.tsx
  hooks/             # Custom hooks
    useLocalStorage.ts
    useQuestionEngine.ts
    useXP.ts
    useStreak.ts
    useSpacedRepetition.ts
  data/              # Question bank JSON files
    accounting.json
    valuation.json
    dcf.json
    mergers-acquisitions.json
    lbo.json
    ev-equity-value.json
  types/             # TypeScript type definitions
    question.ts
    progress.ts
    round.ts
  utils/             # Helper functions
    xp.ts
    levels.ts
    storage.ts
  App.tsx
  main.tsx
```

## Build Order (follow this sequence)

### Phase 1: Foundation
1. Scaffold the project with Vite + React + TypeScript + Tailwind
2. Define all TypeScript types (Question, UserProgress, TopicProgress, QuestionHistory, Round)
3. Create the question JSON schema and add 5 sample questions per topic (30 total) as placeholder content so the app is testable
4. Build the localStorage persistence layer (useLocalStorage hook with typed get/set/clear)

### Phase 2: Question Engine
5. Build the question engine hook (useQuestionEngine) — loads questions from JSON, filters by topic/difficulty, serves questions to rounds, randomizes order
6. Build the 4 question type components:
   - MultipleChoice: 4 tappable card options, highlights correct/incorrect on answer
   - NumericInput: number input field with submit button
   - TrueFalse: two large tappable buttons
   - Conceptual: "Show Answer" button that reveals bullet points, then self-grade buttons (Got it / Partially / Missed it)
7. Build the QuestionCard wrapper that renders the right question type component based on question.type

### Phase 3: Core Loop
8. Build the practice round flow:
   - Topic selection screen (6 topics as cards showing name, description, question count, mastery %)
   - Round configuration (Quick Round 5 questions vs Full Round 10)
   - Question display with progress bar (question X of Y)
   - Answer → immediate feedback with explanation → Next button
   - Round complete screen: score, XP earned, topic breakdown, "Practice Again" / "Home" buttons
9. Build round state management: save/resume interrupted rounds, track answers per round

### Phase 4: Gamification
10. Build XP system (useXP hook): award XP per correct answer (Easy=5, Medium=10, Hard=20), persist total XP
11. Build level system: Analyst I (0 XP) → Analyst II (100) → Analyst III (250) → Associate (500) → VP (1000) → Director (2000) → MD (4000) → Partner (8000). Show level + progress bar to next level
12. Build streak tracking (useStreak hook): count consecutive calendar days with ≥1 completed round. Display on home screen. Handle timezone correctly
13. XP float animation on correct answer (+10 XP floats up and fades)

### Phase 5: Progress & Review
14. Build progress dashboard page: current level + XP bar, streak counter, topic mastery grid (6 topics showing % accuracy, color-coded red/yellow/green), total questions answered
15. Build spaced repetition system (useSpacedRepetition hook): track missed questions, assign review priority, serve review rounds. Questions exit queue after 2 correct reviews
16. Build review mode: "Review" card on home screen showing queue count, dedicated review round pulling from spaced repetition queue

### Phase 6: Navigation & Polish
17. Build bottom tab navigation: Home | Practice | Review | Progress (with icons)
18. Build home screen: greeting, streak display, daily progress summary, review queue card, quick-start topic buttons
19. Apply dark mode theme: dark navy background (#0F1419), gold accents (#FFD700), green correct (#00C853), red incorrect (#FF1744), blue interactive (#2979FF)
20. Mobile-first responsive polish: ensure one-thumb usability, no scrolling during questions, all answer options visible without scroll
21. Add micro-animations: correct answer green pulse, incorrect red shake, XP float, level-up celebration, streak milestone

## Design Requirements
- Dark mode default with the color palette above
- Clean sans-serif typography (Inter font)
- Card-based UI with subtle shadows and 12-16px rounded corners
- Bottom navigation with 4 tabs
- Tappable cards for multiple choice (full card highlights, not radio buttons)
- One-thumb reachable on mobile
- No scrolling during question display
- Instant feedback (zero loading states between answer and result)
- The vibe is "Bloomberg Terminal meets Robinhood meets Duolingo" — professional but approachable, dark but not gloomy, gamified but not childish

## Important Notes
- NO backend. Everything runs client-side with localStorage
- Question data ships as static JSON files bundled with the app
- The app must work fully offline once loaded
- Prioritize mobile experience — desktop is secondary
- Keep the code clean and well-typed. Use proper TypeScript, not `any`
- Each question in the JSON needs: id, topic, difficulty, type, question_text, options (for MC), correct_answer, explanation

Start by scaffolding the project and building Phase 1. After each phase, pause and confirm before moving to the next.
```
