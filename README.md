# Crypt of Greed

Crypt of Greed is an early browser-based prototype for a turn-based deckbuilding roguelite. The product direction is a premium, offline-first game built around one defining decision: **bank accumulated treasure safely or carry it deeper for greater rewards and greater risk**.

> **Status:** pre-alpha gameplay prototype. This repository is not a release-ready Steam or console build.

## Current Prototype

The current application includes:

- credential-based accounts and character persistence;
- three character fighting styles;
- starter decks and turn-based card combat;
- enemy intent, health, energy, block, rewards, and floor progression;
- battle, rest, merchant, and event rooms;
- deterministic room choices and merchant inventory;
- normal non-NFT equipment that affects combat cards;
- responsive gameplay, dashboard, onboarding, and account interfaces;
- isolated tests for core gameplay rules.

The next major product milestone is a versioned `RunState` with persistent decks, card rewards, Hoard, Greed, banking, extraction choices, and resumable checkpoints.

## Documentation

Start with the [documentation index](docs/README.md).

Key source-of-truth documents:

- [Project review](docs/product/project-review.md)
- [Game design document](docs/product/game-design-document.md)
- [Gameplay analysis](docs/product/gameplay-analysis.md)
- [Monetization strategy](docs/product/monetization-strategy.md)
- [UI and UX audit](docs/design/ui-ux-audit.md)
- [Technical review](docs/engineering/technical-review.md)
- [Implementation roadmap](docs/engineering/implementation-roadmap.md)
- [Repository structure](docs/engineering/repository-structure.md)
- [Steam readiness](docs/platform/steam-readiness.md)
- [Console readiness](docs/platform/console-readiness.md)

See [CHANGELOG.md](CHANGELOG.md) for notable repository changes.

## Repository Structure

```text
app/          Next.js pages, layouts, and route handlers
components/   React components grouped by product responsibility
context/      Cross-screen client state providers
lib/          Shared services, utilities, and gameplay rules
prisma/       MongoDB schema and Prisma configuration
public/       Static assets
tests/        Automated domain tests
types/        Shared TypeScript types
docs/         Product, design, engineering, and platform documentation
.github/      Pull request and issue templates
```

Detailed placement rules are documented in [repository-structure.md](docs/engineering/repository-structure.md).

## Technology

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- NextAuth
- Prisma with MongoDB
- Node.js built-in test runner

## Local Setup

Requirements:

- Node.js 22
- npm
- MongoDB connection string

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```text
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Synchronize the development schema:

```bash
npx prisma db push
```

Start the application:

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

The isolated suite covers combat turns, block timing, rewards, revival, seeded shuffling, room progression, merchant inventory, equipment bonuses, and character-creation rules.

## Security and Legacy Web3 Status

Custodial wallet creation and NFT custody are disabled.

- New accounts do not receive blockchain wallets.
- New private keys are not generated or stored.
- NFT custody endpoints return disabled responses.
- Remaining wallet and NFT files are legacy migration material and are not part of the active product direction.
- Existing legacy private-key records require a separate reviewed migration and deletion plan before production deployment.

Report sensitive findings through the process in [SECURITY.md](SECURITY.md). Never include credentials, private keys, tokens, or personal data in public issues.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Repository expectations:

- use focused feature, fix, refactor, or documentation branches;
- use Conventional Commits;
- prefer multiple meaningful commits over one mixed commit;
- keep implementation simple and documentation accurate;
- do not add wallet, NFT, cryptocurrency, or custodial-key features;
- do not modify GitHub Actions without a separate workflow and cost audit.

Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Known Limitations

- No authoritative persistent run model yet.
- No Greed, Hoard, banking, extraction, card rewards, or deck upgrades yet.
- Content is limited to a small starter card and enemy set.
- No controller mapping, audio system, native desktop build, localization, achievements, or cloud saves.
- A clean production build requires configured local services and installed dependencies.

## License

No open-source license has been declared yet. Until the repository owner adds one, the source remains all rights reserved by default and public visibility alone does not grant reuse rights.
