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
.github/               issue and pull request templates
```

## Ownership rules

- `app/` composes routes and pages; it should not duplicate game-domain calculations.
- `components/` handles presentation and interaction; reusable controls belong in `components/ui/`.
- `context/` coordinates shared client state and server calls.
- `lib/game/` owns deterministic rules, progression calculations, combat behavior, rewards, shop inventory, and future run state.
- `app/api/characters/` is the only character API family.
- `prisma/schema.prisma` describes only active application data.
- `.github/` contains public contribution workflows, not application code or deployment automation.

## Naming and import rules

- Use lowercase kebab-case file and folder names.
- Name components after their responsibility, not their visual shape alone.
- Avoid `manager`, `service`, or `helper` suffixes unless the file owns a clear domain boundary.
- Keep one source of truth for each rule and remove superseded implementations.
- Use the `@/` alias for cross-directory imports.
- Use relative imports only for nearby files in the same domain folder.
- Avoid vague folders such as `misc`, `common`, or `helpers` when a real domain name exists.
- Avoid deep folder trees when one clear responsibility folder is enough.

## Documentation rules

- Planning documents belong under `docs/`, not in the root.
- The root README is a concise entry point, not a full design document.
- Product decisions belong under `docs/product/`.
- Game design and UX work belong under `docs/design/`.
- Architecture and delivery work belong under `docs/engineering/`.
- Distribution and certification work belong under `docs/platform/`.
- Update `docs/README.md` whenever a source-of-truth document moves or is added.
- Mark historical audit snapshots clearly rather than silently rewriting their original context.

## Public repository rules

- Generated output, experimental contracts, credentials, and abandoned prototypes do not belong on `main`.
- Keep root files limited to setup, changelog, contribution, conduct, security, license status, and tool configuration.
- Never commit secrets, personal data, production logs, or private environment values.
- Do not add blockchain, wallet, NFT, cryptocurrency, or custodial-key behavior.
- Do not change GitHub Actions without a separate workflow and cost audit.
- Do not add a software license without an explicit owner decision.

## Git history

- Use focused feature, fix, refactor, and documentation branches.
- Use Conventional Commits.
- Prefer several meaningful commits when they expose clear review stages.
- Do not manufacture formatting-only commit spam.
- Preserve a clean series of useful commits with a regular merge.
- Squash branches that contain noisy fixups or one inseparable change.
- Never force-push shared history without coordinating with contributors.
