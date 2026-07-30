# Repository Structure

This repository uses a small, responsibility-based structure. Prefer extending an existing folder over creating a parallel system.

```text
app/
  api/
    auth/           authentication routes
    characters/     character-owned gameplay mutations and queries
    user/           account-level profile and currency routes
  dashboard/        authenticated application pages
components/
  auth/              sign-in and registration UI
  character/         character creation and roster cards
  game/              room, combat, card, equipment, and run UI
  layout/            global navigation and account menu
  ui/                reusable presentation primitives
context/              application-wide React state
lib/
  game/              pure and stateful game-domain rules
prisma/               active database schema
tests/game/           isolated game-domain tests
docs/
  design/             game design and UX analysis
  engineering/        technical review, roadmap, and structure
  platform/           Steam and console readiness
  product/            product review and monetization direction
```

## Ownership rules

- `app/` composes routes and pages; it should not duplicate game-domain calculations.
- `components/` handles presentation and interaction; reusable controls belong in `components/ui/`.
- `context/` coordinates shared client state and server calls.
- `lib/game/` owns deterministic rules, progression calculations, combat behavior, rewards, shop inventory, and future run state.
- `app/api/characters/` is the only character API family.
- `prisma/schema.prisma` describes only active application data.

## Naming rules

- Use kebab-case file and folder names.
- Name components after their responsibility, not their visual shape alone.
- Avoid `manager`, `service`, or `helper` suffixes unless the file owns a clear domain boundary.
- Keep one source of truth for each rule and remove superseded implementations.

## Public repository rules

- Planning documents belong under `docs/`, not in the root.
- Generated output, experimental smart contracts, credentials, and abandoned prototypes do not belong on `main`.
- Keep root files limited to setup, contribution, security, and tool configuration.
- Use focused pull requests and squash merge them into `main`.
