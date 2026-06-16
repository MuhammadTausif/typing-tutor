# Changelog

All notable changes to this project are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [Unreleased]

## [0.1.0] — 2024-06-05

> Baseline release. Tags the complete state of the project before structured
> versioning, TDD, and formal change-tracking were introduced.

### Added — Velocity Arcade (6 games)
- `velocity-typesnake.html` — Snake controlled by typing letters; teaches key-finding
- `velocity-typejump.html` — Platformer where typing words makes the fox leap obstacles
- `velocity-typeblaster.html` — Space-invader shooter; type words to destroy enemies
- `velocity-spellcaster.html` — Spell emoji words from memory to cast spells
- `velocity-typebeat.html` — Rhythm game (Guitar Hero for typing)
- `velocity-typegarden.html` — Calm garden grower; no timer, builds confidence
- All games share 8-finger touch-typing colour scheme (`--f1`–`--f8`)
- All games track live WPM and accuracy in a HUD

### Added — Arcade Lobby (`index.html`)
- Animated cabinet cards with CSS-only mini game previews
- Skill-filter chips (key-finding / words / accuracy / spelling / rhythm / calm)
- "Surprise me" button for random game selection
- Learning-path track showing recommended play order
- Floating keycap background animation
- Responsive layout (mobile + reduced-motion support)

### Added — Professional Tutor Shell (`index1.html`)
- Sidebar navigation (dashboard, lessons, achievements, certificates, teacher, settings)
- Dashboard with progress bar, points, badges, streak counter
- Wired to gamification, lesson, and teacher-dashboard modules via `app.js`

### Added — Phase 1 · Lesson System (`professional-tutor.html/.js`)
- 30 structured lessons across 5 levels (home row → top → bottom → numbers → speed)
- 5 exercise types per lesson: key repetition, alternation, combinations, words, sentences
- Virtual keyboard with per-key colour highlighting
- Character-by-character real-time feedback (correct / incorrect / current)
- Live WPM + accuracy calculation; progress stored in localStorage

### Added — Phase 2 · Gamification (`professional-tutor.js`)
- XP system with level thresholds
- Badge tiers: bronze / silver / gold / platinum
- Daily streak tracking
- `GamificationDashboard` renderer

### Added — Phase 3 · Teacher Dashboard (`teacher-dashboard.html/.js`)
- Class analytics: total students, active today, average WPM, average accuracy
- Per-student progress view
- localStorage-backed class data (`classData`, `classAnalytics`)

### Added — Certificates (`certificates.html`)
- Certificate UI for completed lesson milestones
- `certificateManager` with localStorage persistence

### Added — App Integration (`app.js`, `app.css`)
- `appState` singleton wiring all modules behind a unified `switchView()` router
- Shared CSS variables for the professional tutor shell

---

## Commit Map

| Commit    | Version | Description |
|-----------|---------|-------------|
| `b31e220` | pre     | Initial typing tutor with statistics tracking |
| `bcf7fd7` | pre     | Refactor: improved code structure and reliability |
| `0832673` | pre     | Phase 1: core lesson system |
| `228cb19` | pre     | Phase 2: gamification system (part 1) |
| `6152b58` | pre     | Phase 2: gamification system (duplicate commit) |
| `521ad4c` | pre     | Phase 3: teacher dashboard |
| `bcb2615` | pre     | Certificates UI |
| `a6a4842` | pre     | Merge feature/certificates |
| `53a3cbe` | pre     | Professional tutor HTML + JS |
| `2f12672` | pre     | Integrated app shell (app.js, app.css) |
| `723d1a1` | 0.1.0   | Six arcade typing games |
| `66448d4` | 0.1.0   | Professional tutor sidebar shell (index1.html) |
| `61355b0` | 0.1.0   | Update arcade lobby and integration logic |
