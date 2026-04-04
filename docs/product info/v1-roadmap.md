# V1 Roadmap: BankingPrep

## What V1 Means

MVP validates the core loop: do users come back to practice? V1 is the version you put on the App Store with a freemium paywall and features that justify paying. V1 should only be built after MVP has been tested with real users and the core loop is proven.

**V1 goal:** A polished, monetizable app with enough depth and gamification to retain users through a full recruiting cycle (3-6 months) and justify a subscription.

---

## Prerequisites Before Building V1

- [ ] MVP tested with 20+ real IB candidates
- [ ] Core loop validated: 30%+ day-2 retention
- [ ] Question content expanded to 300+ questions
- [ ] User feedback collected on what's missing / what's broken
- [ ] Business decision on pricing model finalized

---

## V1 Feature Set

### 1. User Accounts & Cloud Sync

**What:** Email or Apple Sign-In authentication. Progress stored in a cloud database and synced across devices.

**Why:** Required for leaderboards, cross-device usage, and paywall enforcement. Also prevents users from losing all progress if they clear their browser.

**Scope:**
- Sign up / sign in (email + password, Apple Sign-In, Google Sign-In)
- Profile: username, avatar (preset options), current level, join date
- Cloud sync of all progress data (replaces local storage as primary)
- Account settings: change password, delete account, export data

**Complexity:** Medium — requires backend (database + auth service)

---

### 2. Freemium Paywall

**What:** Free tier with limited access. Pro tier unlocks everything.

**Why:** Revenue. This is how the app makes money.

**Free Tier Includes:**
- 50 core questions across all topics (curated starter set)
- 3 practice rounds per day
- Basic progress tracking
- Ads between rounds (non-intrusive, interstitial between rounds only)

**Pro Tier Includes ($9.99/month or $79.99/year):**
- Full question bank (500+ questions)
- Unlimited practice rounds
- All difficulty levels
- No ads
- Streak freezes (2 per month included)
- Leaderboard access
- Detailed analytics dashboard
- Timed challenge mode
- Bookmark unlimited questions

**Implementation:**
- iOS: Apple In-App Purchases (required for App Store)
- Web: Stripe checkout
- 7-day free trial for Pro

**Complexity:** Medium-High — payment integration, entitlement management, receipt validation

---

### 3. Full Gamification System

**What:** Complete gamification layer beyond basic XP/streaks.

**Components:**

#### Hearts System
- Start each day with 5 hearts
- Wrong answer costs 1 heart
- Lose all hearts = wait for regeneration (1 heart per 4 hours) or use a Pro perk to refill
- Pro users get unlimited hearts
- Creates real stakes for each answer

#### Achievement Badges
- Milestone badges: "First Round," "7-Day Streak," "30-Day Streak," "100-Day Streak"
- Mastery badges: "Accounting Ace," "DCF Master," "LBO Lord," "M&A Maven"
- Performance badges: "Perfect Round," "Speed Demon" (all correct under time), "Comeback Kid" (cleared full review queue)
- Displayed on profile, satisfying unlock animations

#### Weekly Leagues
- Users placed in leagues of ~30 people based on XP earned that week
- League tiers: Bronze → Silver → Gold → Platinum → Diamond
- Top 10 promote to next tier, bottom 5 demote
- Weekly reset with rewards (bonus XP, badge)
- Pro feature only

#### Daily Challenges
- One special challenge per day (e.g., "Answer 10 Hard Accounting questions with 80%+ accuracy")
- Bonus XP + unique badge for completion
- Creates a reason to open the app every day beyond streaks

**Complexity:** Medium — mostly frontend logic + backend for leaderboards

---

### 4. Expanded Question Bank

**What:** Scale from 100-150 MVP questions to 500+ with richer content.

**Topic Expansion:**
- Core topics deepened (more Hard questions, more nuanced scenarios)
- New topics added:
  - Leveraged Buyouts (detailed)
  - Restructuring / Distressed basics
  - Industry-specific questions (TMT, Healthcare, Energy)
  - Brain teasers / market sizing
  - Behavioral questions (separate mode)

**New Question Types:**
- **Ordering/Sequencing:** "Put these steps of a DCF in order" (drag-and-drop)
- **Matching:** "Match the financial statement to where each item appears"
- **Scenario-based:** Multi-part questions with a setup ("Company A acquires Company B for $500M...") followed by 3-4 related questions
- **Speed drill:** Rapid-fire simple questions (mental math, quick definitions)

**Content Quality:**
- Every question reviewed for accuracy
- Difficulty calibrated based on MVP accuracy data
- Explanations enriched with "Common Mistake" callouts

**Complexity:** Low (technically) — content creation is the real work

---

### 5. Timed Challenge Mode

**What:** Optional timed mode that adds countdown pressure to practice rounds.

**How it works:**
- User toggles "Timed Mode" before starting a round
- Each question gets a countdown timer based on difficulty:
  - Easy: 30 seconds
  - Medium: 60 seconds
  - Hard: 90 seconds
  - Conceptual: 120 seconds
- Timer is visible but not punishing — running out doesn't auto-fail, just marks it as "timed out" (counts as incorrect for scoring)
- Bonus XP multiplier for correct answers under time (1.5x)
- "Speed Round" variant: 10 Easy questions, 15 seconds each — pure reflex drill

**Why:** Interview pressure is real. Knowing the answer isn't enough — you need to recall it fast. This bridges the gap between "I know this" and "I can say this in 10 seconds under pressure."

**Complexity:** Low

---

### 6. Detailed Analytics Dashboard

**What:** Deeper insight into performance beyond basic mastery percentages.

**Includes:**
- **Accuracy over time chart:** Line graph showing accuracy trend by week
- **Topic heatmap:** Visual grid of all topics × difficulty levels, color-coded by performance
- **Weakest questions list:** The specific questions you miss most often, with direct "practice now" links
- **Time per question stats:** How long you take on average, by topic
- **Streak history:** Calendar view showing practice days
- **Session history:** Log of every round with scores

**Why:** Serious prep candidates are data-driven. They want to see exactly where they're weak, not just a percentage. This is also a Pro differentiator.

**Complexity:** Medium — data aggregation and charting

---

### 7. Push Notifications (Native App)

**What:** Smart notifications to drive daily return.

**Notification Types:**
- Streak protection: "Your streak is at risk! Practice now to keep your 14-day streak alive" (sent at user's preferred time if no practice that day)
- Review reminder: "You have 12 questions in your review queue" (sent if queue grows above threshold)
- Weekly summary: "Last week: 87% accuracy, 45 questions answered, Streak: 21 days"
- League update: "You moved up to Gold League! Keep it up this week"

**Rules:**
- Max 1 notification per day
- User controls notification preferences
- No notifications in first 3 days (don't annoy new users)

**Complexity:** Low-Medium — depends on native vs. web push

---

### 8. Native iOS App (App Store Release)

**What:** Rebuild or wrap the web app as a native iOS app for App Store distribution.

**Approach Options:**
- **React Native:** Reuse significant web code, ship to iOS (and Android later). Recommended.
- **Swift/SwiftUI native:** Best performance and UX but requires rewrite. Consider for V2.
- **Capacitor/Ionic wrapper:** Quickest path to App Store but worst UX. Not recommended for a premium feel.

**App Store Requirements:**
- Apple Developer Account ($99/year)
- App Store review compliance (content guidelines, privacy policy, data handling disclosure)
- In-App Purchase integration for Pro subscription
- App Store Optimization: icon, screenshots, description, keywords

**Complexity:** High — biggest single effort in V1

---

## V1 Feature Priority Order (Build Sequence)

| Order | Feature | Reason |
|-------|---------|--------|
| 1 | Expanded Question Bank | Content is king — more questions = more value, independent of any code feature |
| 2 | User Accounts & Cloud Sync | Required dependency for leaderboards, paywall, and App Store |
| 3 | Full Gamification (Hearts, Badges, Leagues) | This is the core differentiator — what makes it Duolingo, not a quiz app |
| 4 | Timed Challenge Mode | Quick win, high perceived value, low effort |
| 5 | Detailed Analytics Dashboard | Pro differentiator, satisfies power users |
| 6 | Freemium Paywall | Only add paywall once there's enough value to justify paying |
| 7 | Native iOS App | App Store distribution — biggest effort, biggest unlock |
| 8 | Push Notifications | Only meaningful once native app exists |

---

## What's NOT in V1 (Future / V2+)

- **Android app** — iOS first, Android when iOS proves out
- **Social features** — Share scores, challenge friends, compare profiles
- **Mock interview mode** — AI-powered conversational interview simulation
- **Excel / modeling practice** — Interactive financial model building
- **Community / forums** — Discussion boards, user-submitted questions
- **B2B / university licensing** — Sell to finance clubs, career centers, prep programs
- **Content marketplace** — Let other tutors contribute question packs
- **Adaptive difficulty AI** — Automatically adjust question difficulty based on real-time performance
- **Behavioral interview prep** — Separate mode for "Tell me about a time..." questions
- **PE / Hedge Fund / Credit prep packs** — Premium topic expansions beyond IB

---

## Timeline Estimate (Solo Builder)

| Phase | Duration | Milestone |
|-------|----------|-----------|
| MVP Build | 4-6 weeks | Working web app with 100+ questions |
| MVP Beta Test | 2-3 weeks | 20+ real users, feedback collected |
| MVP Iteration | 2-3 weeks | Fix issues, improve based on feedback |
| Content Expansion | Ongoing (parallel) | Scale to 300-500 questions |
| V1 Build | 8-12 weeks | Full gamification, accounts, paywall |
| V1 Beta Test | 2-3 weeks | Test with 50+ users, paywall validation |
| App Store Submission | 1-2 weeks | Apple review + iteration |
| **Total to App Store** | **~5-7 months** | |

These are rough estimates assuming part-time work. Full-time could compress by 40-50%.
