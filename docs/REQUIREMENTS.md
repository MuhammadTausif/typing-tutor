# Requirements

Structured record of all requirements by module, phase, and status.
Each requirement maps to the commit(s) that implement it.

---

## REQ-000 · Project Standards

| ID       | Requirement | Status |
|----------|-------------|--------|
| REQ-000-1 | All features developed on dedicated `feature/*` branches | ✅ Active |
| REQ-000-2 | Every feature branch merged via PR into `develop`, never directly to `main` | ✅ Active |
| REQ-000-3 | `main` is always production-ready; only `develop` merges into it | ✅ Active |
| REQ-000-4 | CHANGELOG.md updated for every release | ✅ Active |
| REQ-000-5 | Tests written before implementation (TDD) for all new features | ✅ Active |
| REQ-000-6 | Semantic versioning: MAJOR.MINOR.PATCH | ✅ Active |

---

## REQ-001 · Core Typing Engine

| ID       | Requirement | Status | Commit |
|----------|-------------|--------|--------|
| REQ-001-1 | Character-by-character input validation | ✅ Done | `bcf7fd7` |
| REQ-001-2 | Real-time WPM calculation | ✅ Done | `bcf7fd7` |
| REQ-001-3 | Real-time accuracy percentage | ✅ Done | `bcf7fd7` |
| REQ-001-4 | Error count tracking | ✅ Done | `bcf7fd7` |
| REQ-001-5 | Visual highlighting: correct (green), incorrect (red), current (cyan), pending (grey) | ✅ Done | `bcf7fd7` |
| REQ-001-6 | Auto-scroll reference text during typing | ✅ Done | `bcf7fd7` |
| REQ-001-7 | Results shown on test completion | ✅ Done | `bcf7fd7` |

---

## REQ-002 · Lesson System (Phase 1)

| ID       | Requirement | Status | Commit |
|----------|-------------|--------|--------|
| REQ-002-1 | 30 structured lessons in 5 levels | ✅ Done | `0832673` |
| REQ-002-2 | Level 1: Home row keys (asdf jkl;) | ✅ Done | `0832673` |
| REQ-002-3 | Level 2: Top row keys | ✅ Done | `0832673` |
| REQ-002-4 | Level 3: Bottom row keys | ✅ Done | `0832673` |
| REQ-002-5 | Level 4: Numbers and symbols | ✅ Done | `0832673` |
| REQ-002-6 | Level 5: Full keyboard speed | ✅ Done | `0832673` |
| REQ-002-7 | 5 exercise types per lesson (repetition, alternation, combinations, words, sentences) | ✅ Done | `0832673` |
| REQ-002-8 | Virtual keyboard with highlighted keys per lesson | ✅ Done | `0832673` |
| REQ-002-9 | Progress bar (0–30 lessons completed) | ✅ Done | `0832673` |
| REQ-002-10 | Best WPM and average accuracy stored per lesson | ✅ Done | `0832673` |
| REQ-002-11 | Lesson data persisted in localStorage | ✅ Done | `0832673` |

---

## REQ-003 · Gamification (Phase 2)

| ID       | Requirement | Status | Commit |
|----------|-------------|--------|--------|
| REQ-003-1 | XP awarded per lesson completion | ✅ Done | `228cb19` |
| REQ-003-2 | Level thresholds calculated from cumulative XP | ✅ Done | `228cb19` |
| REQ-003-3 | Badge system with tiers: bronze / silver / gold / platinum | ✅ Done | `228cb19` |
| REQ-003-4 | Daily streak tracking (consecutive days practised) | ✅ Done | `228cb19` |
| REQ-003-5 | `GamificationDashboard` UI renderer | ✅ Done | `228cb19` |
| REQ-003-6 | Gamification state persisted in localStorage | ✅ Done | `228cb19` |
| REQ-003-7 | `getStats()` returns structured summary for dashboard | ✅ Done | `228cb19` |

---

## REQ-004 · Teacher Dashboard (Phase 3)

| ID       | Requirement | Status | Commit |
|----------|-------------|--------|--------|
| REQ-004-1 | Class-level analytics: total students, active today | ✅ Done | `521ad4c` |
| REQ-004-2 | Average WPM and accuracy across class | ✅ Done | `521ad4c` |
| REQ-004-3 | Per-student progress view | ✅ Done | `521ad4c` |
| REQ-004-4 | Class data persisted in localStorage | ✅ Done | `521ad4c` |
| REQ-004-5 | Teacher view accessible from sidebar navigation | ✅ Done | `2f12672` |

---

## REQ-005 · Certificates

| ID       | Requirement | Status | Commit |
|----------|-------------|--------|--------|
| REQ-005-1 | Certificate issued on lesson milestone completion | ✅ Done | `bcb2615` |
| REQ-005-2 | Certificate UI showing student name, level, date | ✅ Done | `bcb2615` |
| REQ-005-3 | Certificates stored and retrieved via localStorage | ✅ Done | `bcb2615` |

---

## REQ-006 · Velocity Arcade (6 Games)

| ID       | Requirement | Status | Commit |
|----------|-------------|--------|--------|
| REQ-006-1 | TypeSnake: steer snake by typing the matching letter | ✅ Done | `723d1a1` |
| REQ-006-2 | TypeJump: type words to make fox jump over obstacles | ✅ Done | `723d1a1` |
| REQ-006-3 | TypeBlaster: type words to destroy falling enemies | ✅ Done | `723d1a1` |
| REQ-006-4 | SpellCaster: spell emoji words from memory | ✅ Done | `723d1a1` |
| REQ-006-5 | TypeBeat: hit falling keys on the beat | ✅ Done | `723d1a1` |
| REQ-006-6 | TypeGarden: grow a garden by typing words (no timer) | ✅ Done | `723d1a1` |
| REQ-006-7 | All games show live WPM and accuracy in HUD | ✅ Done | `723d1a1` |
| REQ-006-8 | Touch-typing finger colour groups in all games | ✅ Done | `723d1a1` |
| REQ-006-9 | All games are self-contained HTML files (no external JS deps) | ✅ Done | `723d1a1` |
| REQ-006-10 | Each game has a start overlay and a game-over overlay | ✅ Done | `723d1a1` |

---

## REQ-007 · Arcade Lobby

| ID       | Requirement | Status | Commit |
|----------|-------------|--------|--------|
| REQ-007-1 | Show all 6 game cards with name, description, skill tags | ✅ Done | `61355b0` |
| REQ-007-2 | Skill filter chips: Everything / Key finding / Words / Accuracy / Spelling / Rhythm / Calm | ✅ Done | `61355b0` |
| REQ-007-3 | Filter dims non-matching cards and highlights matching ones | ✅ Done | `61355b0` |
| REQ-007-4 | "Surprise me" navigates to a random game | ✅ Done | `61355b0` |
| REQ-007-5 | Learning-path section shows recommended play order (1–6) | ✅ Done | `61355b0` |
| REQ-007-6 | Fully responsive (mobile + tablet + desktop) | ✅ Done | `61355b0` |
| REQ-007-7 | Respects `prefers-reduced-motion` | ✅ Done | `61355b0` |
| REQ-007-8 | Zero dependencies — single HTML file, no npm, no build step | ✅ Done | `61355b0` |

---

## REQ-008 · Non-Functional

| ID       | Requirement | Status |
|----------|-------------|--------|
| REQ-008-1 | Works fully offline after first load | ✅ Done |
| REQ-008-2 | No user accounts or data sent to any server | ✅ Done |
| REQ-008-3 | Runs in Chrome, Firefox, Edge, Safari (latest 2 versions) | ✅ Done |
| REQ-008-4 | All pages load without JavaScript console errors | ⬜ Verified via E2E tests |
| REQ-008-5 | E2E test suite covers all pages (Playwright) | ✅ Done — `feature/project-setup` |

---

## Backlog (future)

| ID       | Requirement | Priority |
|----------|-------------|----------|
| REQ-009-1 | Multiplayer / race mode | Medium |
| REQ-009-2 | Multiple language word sets | Medium |
| REQ-009-3 | Custom text upload | Low |
| REQ-009-4 | Advanced statistics charts | Low |
| REQ-009-5 | Sound effects and haptic feedback | Low |
| REQ-009-6 | PWA / service worker for offline install | Low |
