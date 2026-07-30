# Crypt of Greed

Crypt of Greed is an early browser-based prototype for a turn-based deckbuilding roguelite. The current goal is to validate a premium, offline-first game centered on a clear **bank-or-risk Greed mechanic** before expanding content or committing to a production engine.

The repository is not a release-ready Steam or console build. The product audit and source-of-truth plans are available in:

- `PROJECT_REVIEW.md`
- `GAME_DESIGN_DOCUMENT.md`
- `GAMEPLAY_ANALYSIS.md`
- `UI_UX_AUDIT.md`
- `TECHNICAL_REVIEW.md`
- `IMPLEMENTATION_ROADMAP.md`
- `STEAM_READINESS.md`
- `CONSOLE_READINESS.md`
- `MONETIZATION_STRATEGY.md`

## Current Technology

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- NextAuth
- Prisma with MongoDB
- Node.js built-in test runner

Custodial wallets and NFT custody are disabled. New accounts do not receive blockchain wallets or stored private keys.

## Requirements

- Node.js 22
- npm
- MongoDB connection string

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

3. Synchronize the development schema:

```bash
npx prisma db push
```

This step makes legacy wallet fields optional and allows normal non-NFT equipment records.

4. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation Commands

```bash
npm test
npm run typecheck
npm run build
```

The current game suite covers combat turns, rewards, revival, seeded shuffling, floor progression, room choices, shop inventory, equipment combat bonuses, and character-creation rules.

## Verified Core Rules

- persisted character floors initialize battle correctly
- opening combat draws one hand
- ending a turn resolves one enemy phase
- player block absorbs damage before resetting
- defeated enemies remain available for rewards
- room choices are unique and floor progression is centralized
- every fifth floor forces a rest room
- shop inventory is deterministic for the current floor
- shop purchases are authenticated and deduct gold atomically
- one equipment item is stored per slot
- weapon and defensive equipment improve relevant cards
- revival cost and ownership are enforced by the server
- character names and fighting styles are normalized and validated server-side
- starter characters use normal game equipment without NFT references

## UI and UX Improvements

### Gameplay rooms

- responsive dark-fantasy game shell across combat, rest, shop, and event rooms
- one centralized room-selection flow instead of duplicate combat navigation
- accessible card buttons with keyboard focus and disabled states
- visible enemy intent, health, block, turn, floor, energy, and reward information
- clearer loading, error, empty, purchase, and insufficient-resource states
- dialogs support Escape behavior, focus, ARIA labels, and safer non-dismissible decisions
- event choices show their cost and outcome before commitment
- mobile combat no longer relies on a large fixed overlay covering the battlefield

### Dashboard and onboarding

- responsive dashboard with roster totals, ready-character count, deepest floor, and crystal balance
- skeleton loading and a visible retry state instead of a blank full-screen spinner
- multiple characters can be created without reloading the application
- semantic fighting-style selection with a recommended first class and readable strengths
- richer character cards show floor, level, health, experience, gold, kills, and equipment count
- revive and creation actions expose their own loading and insufficient-resource states
- responsive desktop and mobile navigation with active-page indicators
- simplified account menu with only working dashboard, settings, and sign-out actions
- authentication explains that registration creates no wallet or private key
- profile changes update the active authentication session without browser-storage synchronization
- text inputs expose helper and error relationships to assistive technology

## Known Limitations

- the full deck and route history do not yet persist as one versioned run
- Greed, Hoard, banking, extraction, relics, card rewards, and deck upgrades are not implemented
- content remains limited to a small starter card and enemy set
- equipment bonuses are intentionally simple and need balancing
- no controller mapping layer, audio system, native desktop build, localization, achievements, or cloud saves exist
- existing legacy private-key records still require a reviewed one-time migration and deletion plan
- a clean production build requires configured local services and installed dependencies

## Branch and Commit Rules

- feature branches use `feat/<feature-name>`
- commits follow Conventional Commits
- do not add or modify GitHub Actions during the current stabilization phase
