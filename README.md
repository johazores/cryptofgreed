# Crypt of Greed

[![License: MIT](https://img.shields.io/badge/code%20license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-prototype-orange.svg)](docs/engineering/implementation-roadmap.md)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](package.json)

Crypt of Greed is a browser-based prototype for a turn-based deckbuilding roguelite centered on a clear **bank-or-risk Greed mechanic**.

The current goal is to validate the combat, progression, economy, and Greed loop before expanding content or moving the proven game domain into a production engine.

> **Status:** Development prototype. This is not a release-ready Steam, console, handheld, or mobile build.

## Current technology

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- NextAuth
- Prisma with MongoDB
- Node.js built-in test runner

The active application has no wallet creation, private-key storage, NFT custody, smart-contract builder, or blockchain runtime dependency.

## Current capabilities

- Turn-based card combat
- Seeded card shuffling for tested flows
- Enemy intent, health, block, turn, floor, energy, and reward states
- Room choices and floor progression
- Rest rooms, merchants, events, and combat rooms
- Authenticated atomic merchant purchases
- Equipment slots and combat bonuses
- Character creation and roster management
- Revival rules enforced server-side
- Responsive desktop and mobile navigation
- Keyboard-accessible cards, forms, menus, room choices, and dialogs
- Explicit loading, error, empty, purchase, and insufficient-resource states

## Verified core rules

- Persisted character floors initialize battles correctly.
- Opening combat draws one hand.
- Ending a turn resolves one enemy phase.
- Block absorbs damage before resetting.
- Defeated enemies remain available for reward resolution.
- Room choices are unique and floor progression is centralized.
- Every fifth floor forces a rest room.
- Shop inventory is deterministic for the current floor.
- Purchases are authenticated and deduct gold atomically.
- One equipment item is stored per slot.
- Equipment improves relevant combat cards.
- Revival cost and ownership are enforced server-side.
- Character names and fighting styles are validated server-side.

## Requirements

- Node.js 22
- npm
- MongoDB connection string

The supported Node.js version is also recorded in `.nvmrc`.

## Installation

```bash
npm install
cp .env.example .env.local
```

Configure:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Synchronize the development schema:

```bash
npx prisma db push
```

Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

Existing development records containing removed wallet, private-key, NFT bank, or NFT equipment fields require a separately reviewed cleanup before production use.

## Project structure

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
docs/                product, design, engineering, platform, and licensing docs
.github/             issue and pull request templates
```

Read [repository structure](docs/engineering/repository-structure.md) for ownership, naming, import, documentation, and Git-history rules.

## Validation

```bash
npm test
npm run typecheck
npm run build
```

The isolated suite covers combat turns, rewards, revival, seeded shuffling, floor progression, room choices, shop inventory, equipment combat bonuses, and character-creation rules.

## Known limitations

- The full deck, route history, room state, and rewards do not persist as one versioned run.
- Greed, Hoard, banking, extraction, relics, card rewards, and deck upgrades are incomplete.
- Content is limited to a starter card, enemy, room, event, and equipment set.
- Equipment and economy values require balancing.
- Controller mapping, audio, native builds, localization, achievements, and cloud saves are not implemented.
- A clean production build still requires configured services and installed dependencies.

## Production direction

The browser application is intended to validate the game loop, not serve as the permanent multi-platform engine.

The current technical recommendation is to migrate proven game-domain behavior to Unity 6 LTS with C# after the Greed loop, versioned run persistence, and content pipeline are validated.

Read the [technical review](docs/engineering/technical-review.md) and [implementation roadmap](docs/engineering/implementation-roadmap.md).

## Documentation

- [Documentation index](docs/index.md)
- [Project review](docs/product/project-review.md)
- [Game design document](docs/design/game-design-document.md)
- [Gameplay analysis](docs/design/gameplay-analysis.md)
- [UI and UX audit](docs/design/ui-ux-audit.md)
- [Implementation roadmap](docs/engineering/implementation-roadmap.md)
- [Technical review](docs/engineering/technical-review.md)
- [Steam readiness](docs/platform/steam-readiness.md)
- [Console readiness](docs/platform/console-readiness.md)
- [Asset license](docs/assets-license.md)
- [Repository metadata](docs/repository-metadata.md)
- [Changelog](CHANGELOG.md)

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report sensitive vulnerabilities according to [SECURITY.md](SECURITY.md).

Repository expectations:

- use focused feature, fix, refactor, or documentation branches;
- use Conventional Commits;
- preserve clean, meaningful history;
- do not add blockchain, wallet, NFT, cryptocurrency, or custodial-key behavior;
- do not add or modify GitHub Actions without an explicit workflow and cost audit.

## License

The source code is available under the [MIT License](LICENSE).

Original game artwork, music, audio, narrative content, logos, trademarks, and other identified creative assets remain All Rights Reserved unless a separate license is provided. See [asset license](docs/assets-license.md).

## Author

Created and maintained by [Johanssen Azores](https://github.com/johazores).
