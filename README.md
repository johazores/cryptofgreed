# Crypt of Greed

Crypt of Greed is an early browser-based prototype for a turn-based deckbuilding roguelite. The current goal is to validate a premium, offline-first game centered on a clear **bank-or-risk Greed mechanic** before expanding content or committing to a production engine.

> This repository is a development prototype, not a release-ready Steam or console build.

## Documentation

Start with the [documentation index](docs/README.md).

Key references:

- [Project review](docs/product/project-review.md)
- [Game design document](docs/design/game-design-document.md)
- [Implementation roadmap](docs/engineering/implementation-roadmap.md)
- [Technical review](docs/engineering/technical-review.md)
- [Repository structure](docs/engineering/repository-structure.md)
- [Changelog](CHANGELOG.md)

## Current Technology

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- NextAuth
- Prisma with MongoDB
- Node.js built-in test runner

The active application has no wallet creation, private-key storage, NFT custody, smart-contract builder, or blockchain runtime dependency.

## Repository Structure

```text
app/                 pages and API routes
components/
  auth/              sign-in and registration
  character/         creation and roster UI
  game/              combat and room UI
  layout/            navigation and account menu
  ui/                reusable controls
context/             shared client state
lib/game/            game-domain rules
prisma/              active data model
tests/game/          isolated game tests
docs/                product, design, engineering, and platform plans
.github/             issue and pull request templates
```

See [Repository Structure](docs/engineering/repository-structure.md) for ownership, naming, import, documentation, and Git-history rules.

## Requirements

- Node.js 22
- npm
- MongoDB connection string

The supported Node version is also recorded in `.nvmrc`.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the safe environment template:

```bash
cp .env.example .env.local
```

Then provide local values for:

```text
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

3. Synchronize the development schema:

```bash
npx prisma db push
```

The active Prisma schema no longer includes historical wallet, private-key, NFT bank, or NFT equipment fields. Existing MongoDB records containing old fields require a separately reviewed data-cleanup plan before production use.

4. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm test
npm run typecheck
npm run build
```

The isolated suite covers combat turns, rewards, revival, seeded shuffling, floor progression, room choices, shop inventory, equipment combat bonuses, and character-creation rules.

## Verified Core Rules

- persisted character floors initialize battle correctly;
- opening combat draws one hand;
- ending a turn resolves one enemy phase;
- block absorbs damage before resetting;
- defeated enemies remain available for rewards;
- room choices are unique and floor progression is centralized;
- every fifth floor forces a rest room;
- shop inventory is deterministic for the current floor;
- purchases are authenticated and deduct gold atomically;
- one equipment item is stored per slot;
- equipment improves relevant combat cards;
- revival cost and ownership are enforced server-side;
- character names and fighting styles are validated server-side.

## Current UX Coverage

- responsive combat, rest, merchant, event, dashboard, and onboarding screens;
- keyboard-accessible cards, room choices, forms, menus, and dialogs;
- visible enemy intent, health, block, turn, floor, energy, and rewards;
- explicit loading, error, empty, purchase, and insufficient-resource states;
- responsive desktop and mobile navigation.

## Known Limitations

- the full deck and route history do not yet persist as one versioned run;
- Greed, Hoard, banking, extraction, relics, card rewards, and deck upgrades are not implemented;
- content is limited to a small starter card and enemy set;
- equipment bonuses need balancing;
- controller mapping, audio, native desktop builds, localization, achievements, and cloud saves are not implemented;
- a clean production build still requires configured services and installed dependencies.

## Contributing and Security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report sensitive vulnerabilities according to [SECURITY.md](SECURITY.md).

Repository expectations:

- use focused feature, fix, refactor, or documentation branches;
- use Conventional Commits;
- prefer multiple meaningful commits when they expose clear review stages;
- do not manufacture commit spam;
- preserve clean commit history with an appropriate merge method;
- do not add blockchain, wallet, NFT, cryptocurrency, or custodial-key behavior;
- do not add or modify GitHub Actions without an explicit workflow and cost audit.

## License

No open-source license has been declared. Until the repository owner adds one, public visibility alone does not grant permission to copy, modify, or redistribute the source.
