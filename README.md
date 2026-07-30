# Crypt of Greed

Crypt of Greed is an early browser-based prototype for a turn-based deckbuilding roguelite. The current development goal is to validate a premium, offline-first game centered on a clear **bank-or-risk Greed mechanic** before expanding content or committing to a production engine.

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
- Prototype wallet and NFT code that is under review and is not part of the recommended Steam or console product path

## Requirements

- Node.js 22 for the built-in TypeScript test runner used by this repository
- npm
- MongoDB connection string

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with the values required by the current prototype:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ENCRYPTION_KEY=
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

The wallet-related values are still required by existing prototype modules. Do not use real funds or production private keys with the current implementation.

3. Start development:

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

`npm test` currently covers the isolated combat and run-stability rules that do not require a database or browser.

## Verified Core Rules

- persisted character floors initialize the battle floor
- opening combat does not draw two hands
- ending a turn resolves one enemy turn
- player block absorbs the enemy attack before resetting
- defeated enemies remain available for reward calculation
- seeded shuffling is repeatable

## Known Limitations

- the full run/deck does not yet persist across every room
- content is limited to a small starter card and enemy set
- rest, shop, and event rooms remain prototype-level
- no controller, keyboard-first input layer, audio system, accessibility suite, or native desktop build exists
- save recovery, cloud saves, achievements, localization, and Steam integration are not implemented
- wallet custody and NFT flows are not production-safe and are planned for removal from the commercial Steam/console path
- a clean production build still requires configured services and dependencies

## Branch and Commit Rules

- feature branches use `feat/<feature-name>`
- commits follow Conventional Commits
- do not add or modify GitHub Actions during the current stabilization phase
