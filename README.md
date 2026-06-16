# Velocity — Typing Tutor Arcade

![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)
![No Dependencies](https://img.shields.io/badge/runtime_deps-0-brightgreen?style=flat-square)
![Tests](https://img.shields.io/badge/tests-Playwright_E2E-purple?style=flat-square)

Six arcade-style typing games in one browser-based app. No installation, no accounts, no build step — open the file and play.

---

## Games

| Game | Skill | Description |
|------|-------|-------------|
| 🐍 TypeSnake | Key finding | Steer a snake by typing the letter that matches the food |
| 🦊 TypeJump | Words + Speed | Help a fox leap obstacles by typing words in time |
| 🚀 TypeBlaster | Accuracy + Words | Destroy descending word-enemies in deep space |
| 🧙 Spell Caster | Spelling | Spell emoji words from memory to cast spells |
| 🎧 TypeBeat | Rhythm | Hit falling keys on the beat — Guitar Hero for typing |
| 🌻 Type Garden | Calm start | Grow a garden by typing words, no timer, no pressure |

Recommended learning order: Garden → Snake → Jump → Blaster → Spell Caster → TypeBeat

---

## Quick Start

```bash
git clone https://github.com/MuhammadTausif/typing-tutor.git
cd typing-tutor/web-app
```

Then open `index.html` in Chrome. All six game files must be in the same folder.

To run with a local server (required for E2E tests):

```bash
npm install
npm run serve          # serves web-app/ at http://localhost:3000
```

---

## Project Structure

```
typing-tutor/
├── web-app/                        # All browser files
│   ├── index.html                  # Arcade lobby (entry point)
│   ├── index1.html                 # Professional tutor shell (sidebar nav)
│   ├── velocity-typesnake.html
│   ├── velocity-typejump.html
│   ├── velocity-typeblaster.html
│   ├── velocity-spellcaster.html
│   ├── velocity-typebeat.html
│   ├── velocity-typegarden.html
│   ├── professional-tutor.html     # Lesson-based tutor
│   ├── professional-tutor.js
│   ├── teacher-dashboard.html      # Teacher analytics
│   ├── teacher-dashboard.js
│   ├── certificates.html
│   ├── app.js                      # Shared navigation/dashboard logic
│   └── app.css                     # Shared styles for tutor shell
├── tests/
│   └── e2e/                        # Playwright end-to-end tests
│       ├── arcade-lobby.spec.js
│       ├── professional-tutor.spec.js
│       └── games/
│           ├── typesnake.spec.js
│           ├── typejump.spec.js
│           ├── typeblaster.spec.js
│           ├── spellcaster.spec.js
│           ├── typebeat.spec.js
│           └── typegarden.spec.js
├── docs/
│   └── REQUIREMENTS.md             # All requirements by phase/module
├── CHANGELOG.md                    # Version history
├── package.json
└── playwright.config.js
```

---

## Testing

Tests use [Playwright](https://playwright.dev). Run against a live local server:

```bash
npm install
npx playwright install              # download browser binaries (first time only)
npm test                            # run all E2E tests
npm run test:report                 # open HTML report
```

Tests cover:
- Arcade lobby loads, shows 6 cabinets, filter chips work, Surprise Me navigates
- Each game loads without console errors, shows HUD and start overlay
- Professional tutor sidebar navigation and view switching

---

## Development Workflow

```
main          ← stable, tagged releases only
  └── develop ← integration branch
        ├── feature/arcade-games
        ├── feature/professional-tutor
        ├── feature/teacher-dashboard
        └── feature/gamification
```

1. Branch from `develop`: `git checkout -b feature/my-feature develop`
2. Write failing tests first (TDD)
3. Implement until tests pass
4. Open a PR into `develop`
5. After review, merge `develop` → `main` and tag a release

See [CHANGELOG.md](CHANGELOG.md) for version history and [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) for the full requirements register.

---

## Tech Stack

- Pure HTML5 / CSS3 / Vanilla JS — no frameworks, no build tools
- Google Fonts (Bungee, Outfit, Fredoka, JetBrains Mono, and more)
- Web Storage API for persistence
- Playwright (dev dependency) for E2E testing

## License

MIT — see [LICENSE](LICENSE)
