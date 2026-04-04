# MVP PRD: BankingPrep

## 1. Overview

BankingPrep MVP is a web app (built for mobile browsers, installable as PWA) that drills investment banking technical interview questions through short, gamified practice rounds. Users pick a topic, answer 5-10 questions with instant feedback, earn XP, and track their progress over time. Weak areas resurface through spaced repetition.

**Problem:** IB candidates know they should practice technicals daily, but existing tools are laptop-bound video courses that encourage cramming over retention. There's no mobile-first, active-recall tool for IB technicals.

**MVP goal:** Validate that the core loop (pick topic → answer questions → get feedback → see progress) is engaging enough that users come back daily without being told to.

---

## 2. Goals & Success Metrics

| Goal | Success Metric |
|------|---------------|
| Users complete practice rounds and find them useful | 80%+ of started rounds are completed (not abandoned mid-round) |
| Users return without prompting | 30%+ of users return within 48 hours of first session |
| Core loop feels good on mobile | Rounds completable in under 5 minutes on a phone screen |
| Content quality validates | <10% of question feedback reports flag incorrect/unclear questions |

---

## 3. Target User

College juniors/seniors and MBA students actively preparing for IB interviews. They've already committed to the IB path and have likely purchased or explored at least one existing prep course. They want to reinforce what they've learned through active practice, especially during idle moments (commuting, waiting, between classes). They're anxious about freezing on technicals in live interviews and want the confidence that comes from daily repetition.

---

## 4. User Flows

### Flow 1: First-Time User (Onboarding)

1. User opens web app on phone
2. Sees a brief splash screen: "Practice IB technicals in 5 minutes a day"
3. Sees topic selection screen with categories: Accounting, Valuation, DCF, M&A, LBO, Enterprise Value / Equity Value
4. Each topic shows a brief description and question count
5. User taps a topic to start their first round
6. No account creation required — progress saved to local storage

### Flow 2: Practice Round (Core Loop)

1. User selects a topic from the home screen
2. Sees round configuration: "Quick Round (5 questions)" is default. Option for "Full Round (10 questions)"
3. Round starts. Question 1 appears:
   - Question text displayed prominently
   - Answer format depends on question type:
     - **Multiple choice:** 4 tappable option cards
     - **Numeric input:** Number pad with input field (e.g., "If D&A increases by $10 and tax rate is 40%, what is the change in FCF?")
     - **True/False:** Two large tappable buttons
     - **Conceptual (self-graded):** "Walk me through a DCF" — user taps "Show Answer" when ready, then self-grades: "Got it" / "Partially" / "Missed it"
4. User selects/submits answer
5. **Immediate feedback screen:**
   - Correct: Green highlight, "+10 XP" animation, brief reinforcement note ("Right — unlevered FCF strips out capital structure effects")
   - Incorrect: Red highlight, correct answer revealed, 1-2 sentence explanation of WHY
   - User taps "Next" to continue
6. Steps 3-5 repeat for remaining questions
7. **Round complete screen:**
   - Score: X/Y correct
   - XP earned this round
   - Total XP / current level
   - Topic accuracy breakdown (e.g., "Accounting: 4/5, Valuation: 1/2")
   - "Practice Again" and "Back to Home" buttons

**Edge cases:**
- If user closes app mid-round: round state is saved, resumed on next open
- If user gets all questions right: bonus XP, celebratory animation
- If user gets <50%: encouraging message + "These questions will appear again soon"

### Flow 3: Progress Review

1. From home screen, user taps "Progress" tab
2. Sees dashboard:
   - Current level + XP bar showing progress to next level
   - Current streak (consecutive days practiced)
   - Topic mastery grid: each topic shows a percentage + color (red/yellow/green)
3. User can tap a topic to see:
   - Number of questions attempted vs. available
   - Accuracy rate
   - Most-missed question areas
4. "Weakest Areas" section at bottom highlights specific question categories to revisit

### Flow 4: Spaced Repetition (Review Mode)

1. On home screen, if user has missed questions from previous sessions, a "Review" card appears at the top: "You have 8 questions to review"
2. User taps to start a review round
3. Questions are drawn from previously missed/partially-correct questions, weighted by how recently they were missed
4. Same answer flow as a normal round
5. Questions answered correctly twice in review mode are marked as "learned" and drop out of the review queue
6. Questions missed again stay in the queue with higher priority

---

## 5. Feature Requirements

### Must Have (P0) — Ship-blocking

- **Question engine:** Serves questions by topic, tracks correct/incorrect, supports 4 question types (multiple choice, numeric input, true/false, conceptual self-graded)
- **Question bank:** Minimum 100 questions across 6 core topics (Accounting, Valuation, DCF, M&A, LBO, EV/Equity Value), tagged by topic and difficulty (Easy/Medium/Hard)
- **Practice rounds:** Configurable 5 or 10 question rounds, filtered by topic
- **Instant feedback:** Correct/incorrect indication with explanation text for every question
- **XP system:** Earn XP per correct answer (scaled by difficulty: Easy=5, Medium=10, Hard=20), accumulate toward levels
- **Level progression:** Analyst I → Analyst II → Analyst III → Associate → VP → Director → MD. Each level requires escalating XP thresholds
- **Streak tracking:** Count consecutive calendar days with at least 1 completed round. Display prominently on home screen
- **Basic progress dashboard:** Topic mastery percentages, total questions answered, accuracy rate, current streak
- **Spaced repetition queue:** Missed questions resurface in review rounds. Questions answered correctly twice exit the queue
- **Local storage persistence:** All progress saved to browser local storage. No account required
- **Mobile-responsive design:** Built for phone screens first. Must be fully usable on iPhone and Android browsers
- **PWA capability:** Installable to home screen, works offline for cached questions

### Should Have (P1) — Ship without if needed

- **Difficulty filtering:** Let users choose Easy/Medium/Hard within a topic
- **Bookmark questions:** Save specific questions for later review
- **Hearts system:** Start each day with 5 hearts. Wrong answer costs 1 heart. Lose all hearts = can't practice until hearts regenerate (every 4 hours, 1 heart regenerates). Creates stakes + future monetization hook
- **Round timer:** Optional countdown timer per question for interview pressure simulation
- **Daily goal setting:** Let user set a daily question target (e.g., 15, 30, 50 questions). Visual progress toward daily goal on home screen
- **Animations and haptics:** Satisfying micro-interactions on correct answers, level-ups, streak milestones

### Not Included (Explicitly Out of Scope for MVP)

- User accounts / authentication
- Cloud sync / cross-device progress
- Leaderboards / leagues
- Social features (sharing, comparing with friends)
- Achievement badges
- Push notifications
- Behavioral interview questions
- In-app purchases / paywalls
- Admin panel for content management
- Analytics/tracking infrastructure
- Video or audio content
- Community / forums

---

## 6. Data Model (Conceptual)

### Question
- id (unique identifier)
- topic (Accounting | Valuation | DCF | M&A | LBO | EV_Equity_Value)
- difficulty (Easy | Medium | Hard)
- type (multiple_choice | numeric | true_false | conceptual)
- question_text (the question prompt)
- options (array, for multiple choice — each with text + isCorrect flag)
- correct_answer (for numeric/true_false types)
- explanation (shown after answering — explains WHY the answer is correct)
- tags (optional sub-topic tags, e.g., "three-statement-model", "WACC", "accretion-dilution")

### UserProgress (stored locally)
- total_xp
- current_level
- current_streak (consecutive days)
- last_practice_date
- daily_questions_completed

### TopicProgress (one per topic, stored locally)
- topic_id
- questions_attempted (count)
- questions_correct (count)
- accuracy_rate (calculated)
- mastery_level (derived from accuracy + coverage)

### QuestionHistory (one per question attempted, stored locally)
- question_id
- times_seen
- times_correct
- last_seen_date
- in_review_queue (boolean)
- review_priority (higher = resurface sooner)

### Round (ephemeral, stored during active round)
- questions (ordered list of question IDs)
- current_index
- answers (user's responses)
- score
- xp_earned
- started_at
- completed_at

**Relationships:**
- A Round contains 5-10 Questions
- UserProgress aggregates across all TopicProgress records
- QuestionHistory drives the spaced repetition queue (review_priority determines order)
- XP feeds into UserProgress.total_xp which determines current_level

---

## 7. Design & UX Direction

### Visual Direction
- **Dark mode default.** Dark navy/charcoal background (#0F1419 range), not pure black
- **Accent colors:** Gold (#FFD700) for XP/achievements, Green (#00C853) for correct, Red (#FF1744) for incorrect, Blue (#2979FF) for interactive elements
- **Typography:** Clean sans-serif (Inter or SF Pro). Large, readable question text. No decorative fonts
- **Cards and surfaces:** Subtle elevation with soft shadows. Rounded corners (12-16px). No harsh borders
- **Aesthetic reference:** Bloomberg Terminal cleanliness meets Robinhood's approachability

### Interaction Patterns
- **Tappable cards** for multiple choice (not radio buttons — full card highlights on tap)
- **Swipe or tap "Next"** to advance between questions (tap is primary, swipe is optional enhancement)
- **Bottom tab navigation:** Home | Practice | Review | Progress
- **Minimal modals** — prefer full-screen transitions between states
- **Feedback animations:** Correct answer gets a brief green pulse + XP float animation. Incorrect gets a subtle red shake. Keep animations under 500ms — snappy, not slow

### UX Requirements
- **One-thumb usable:** All primary interactions reachable with one thumb on a phone
- **No scrolling during questions:** Question + all answer options must fit on screen without scrolling
- **Instant feedback:** Zero loading states between answer submission and feedback display
- **Session resumability:** If user leaves mid-round, exact state is preserved

---

## 8. Technical Considerations

### Platform
- Web app (React or Next.js), mobile-first responsive design
- PWA with service worker for offline capability and home screen installation
- Future: React Native or native iOS app for App Store distribution (not MVP)

### Tech Stack (Recommended)
- **Frontend:** React + TypeScript + Tailwind CSS
- **State management:** Local storage for persistence, React state for session
- **Build tool:** Vite
- **Hosting:** Vercel or Netlify (free tier sufficient for MVP)
- **Content:** Question bank stored as JSON files bundled with the app (no backend needed for MVP)

### No Backend Required for MVP
- All data lives in the browser (local storage)
- Question content is static JSON shipped with the app
- No user accounts = no auth = no database = no server costs
- This is a deliberate choice to minimize build complexity and cost for validation

### Known Constraints
- **Local storage limits:** ~5-10MB depending on browser. More than sufficient for progress data, but not for large media files. Questions should be text-only for MVP
- **No cross-device sync:** Progress is locked to one browser on one device. Acceptable for MVP; users can be warned on first use
- **Offline support:** Service worker can cache the app shell + question bank JSON for offline use. Progress syncs to local storage regardless of network state
- **PWA limitations on iOS:** Push notifications don't work for PWAs on iOS. Fine for MVP (no notifications planned). Install-to-homescreen works

### Content Pipeline
- Questions authored in a structured format (JSON or Markdown with frontmatter)
- Each question requires: text, type, options/answer, explanation, topic tag, difficulty tag
- Initial target: 100-150 questions, ~15-25 per topic
- Content is the bottleneck, not code — start writing questions immediately in parallel with development

---

## 9. Analytics & Tracking (MVP — Lightweight)

For MVP, implement basic anonymous analytics to validate the core loop. No user-identifying data.

| Event | What It Tells You |
|-------|-------------------|
| round_started | Are users initiating practice? Which topics? |
| round_completed | Are users finishing rounds or abandoning? |
| round_abandoned | Where in the round do users drop off? |
| question_answered | Accuracy rates by topic/difficulty — is content well-calibrated? |
| app_opened | Return rate — are users coming back? |
| streak_day_logged | Is the streak mechanic driving retention? |
| review_round_started | Are users engaging with spaced repetition? |

**Implementation:** Plausible Analytics or simple custom event logging to a free tier service. No cookies, no PII, GDPR-friendly.

---

## 10. Open Questions & Assumptions

| Question | Current Assumption | Resolution |
|----------|-------------------|------------|
| How many questions needed for MVP to feel substantial? | 100-150 across 6 topics | Test with 10 beta users — do they run out of questions too fast? |
| Should conceptual questions (self-graded) count toward accuracy stats? | Yes, with lower XP weight | Monitor if users abuse self-grading (always marking "Got it") |
| How aggressive should spaced repetition be? | Missed questions reappear within 2-3 sessions | Tune based on user feedback |
| Is PWA good enough or will users want a "real" app from day 1? | PWA is fine for validation | Track install-to-homescreen rate and user feedback |
| What XP thresholds per level? | Exponential: 100, 250, 500, 1000, 2000, 4000, 8000 | Tune so casual users level up every 1-2 weeks |
| Should wrong answers show the explanation immediately or let user try again? | Show immediately (one attempt per question) | Test both in beta |
| Working name "BankingPrep" — keep it? | Placeholder. Doesn't need to be resolved for MVP | Brainstorm before App Store launch |
