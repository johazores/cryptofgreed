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

Legacy blockchain prototype files may remain for migration review, but custodial wallet creation and NFT custody APIs are disabled and are not part of the commercial game path.

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

3. Apply the current Prisma schema to the development database:

```bash
npx prisma db push
```

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

`npm test` covers isolated combat, progression, reward, deterministic shuffle, and revival rules that do not require a database or browser.

## Security Status

- new registrations do not create custodial wallets
- no new private keys are generated or stored
- legacy custody fields are nullable for existing-data compatibility
- NFT deposit, withdrawal, bank, and management APIs return `410 Gone`
- the wallet page remains only as a clear disabled-state notice

Existing legacy private-key records must be handled through a separate migration and deletion plan before any production deployment.

## Verified Core Rules

- persisted character floors initialize the battle floor
- opening combat does not draw two hands
- ending a turn resolves one enemy turn
- player block absorbs the enemy attack before resetting
- defeated enemies remain available for reward calculation
- seeded shuffling is repeatable
- revival requires a dead character and sufficient crystals

## Known Limitations

- the full run/deck does not yet persist across every room
- content is limited to a small starter card and enemy set
- rest, shop, and event rooms remain prototype-level
- no controller, keyboard-first input layer, audio system, accessibility suite, or native desktop build exists
- save recovery, cloud saves, achievements, localization, and Steam integration are not implemented
- legacy blockchain models and files still require a deliberate archival or migration decision
- a clean production build still requires configured services and dependencies

## Branch and Commit Rules

- feature branches use `feat/<feature-name>`
- commits follow Conventional Commits
- do not add or modify GitHub Actions during the current stabilization phase
