# Repository Structure

This document defines where files belong and how the repository should stay organized as Crypt of Greed grows.

## Top-Level Directories

```text
app/          Next.js routes, layouts, pages, and HTTP route handlers
components/   Reusable React presentation and interaction components
context/      React context providers for cross-screen client state
lib/          Framework-independent rules, services, and shared utilities
prisma/       Database schema and Prisma configuration
public/       Static assets served without transformation
tests/        Automated tests organized by domain
types/        Shared application and domain type definitions
docs/         Product, design, engineering, and platform documentation
.github/      Pull request and issue templates
```

Only repository entry files and public project policies should remain at the root.

## Application Routes

`app/` follows Next.js App Router conventions. Route folders should describe URL structure, not business-domain layering.

- Keep page, layout, loading, and route-handler files inside their route folder.
- Do not move route handlers outside `app/api/`.
- Extract reusable rules from route handlers into `lib/`.
- Extract reusable visual components from pages into `components/`.
- Keep route-specific components colocated only when they are not reused elsewhere.

## Components

```text
components/
  auth/        Sign-in, registration, and authentication entry controls
  character/   Character creation, selection, and roster interactions
  game/        Combat, rooms, cards, equipment, and run presentation
  layout/      Global navigation and account layout controls
  nft/         Legacy NFT prototype UI; not part of the active product path
  ui/          Reusable buttons, dialogs, inputs, loaders, and form controls
  wallet/      Legacy wallet prototype UI; not part of the active product path
```

Component rules:

- Use lowercase kebab-case file names.
- Group by product responsibility before grouping by component type.
- Keep generic primitives in `components/ui/`.
- Avoid barrel files unless they remove meaningful repetition without hiding dependencies.
- Avoid deep folder trees when one clear domain folder is enough.
- Do not place active product components inside legacy wallet or NFT folders.

## Game and Shared Logic

`lib/game/` owns deterministic gameplay rules that can be tested without React or Next.js.

- React components render state and dispatch actions; they should not duplicate rules.
- Route handlers validate authentication and persistence boundaries, then call shared logic.
- Pure helpers should accept explicit inputs and return values without hidden global state.
- Add or update tests in `tests/game/` whenever a gameplay rule changes.

## Documentation

```text
docs/
  product/      Product review, game design, gameplay, and monetization
  design/       UI, UX, accessibility, and visual-system documentation
  engineering/  Architecture, roadmap, security, and repository conventions
  platform/     Steam, console, and distribution readiness
```

The root `README.md` is an entry point. Detailed documents belong under `docs/` and are indexed by `docs/README.md`.

## Naming and Imports

- Use the `@/` alias for cross-directory imports.
- Use relative imports only for nearby files inside the same domain folder.
- Prefer named domain language over generic names such as `helpers`, `misc`, or `common`.
- Keep one primary responsibility per file.
- Rename files when their responsibility changes.

## Git History

- Use `feat/<name>`, `fix/<name>`, `refactor/<name>`, or `docs/<name>` branches.
- Use Conventional Commits.
- Prefer several focused commits over one large mixed commit.
- Do not split one logical edit into meaningless formatting-only commit spam.
- Preserve useful commits when merging repository-maintenance work.
- Do not modify GitHub Actions without a separate workflow and cost audit.

## Legacy Web3 Code

Custodial wallet creation and NFT custody are disabled. Remaining wallet and NFT files are retained only for migration review and should not receive new product features.

Before production release:

1. confirm no active imports depend on legacy UI;
2. migrate or delete legacy private-key records;
3. archive or remove disabled API and component folders;
4. remove unused blockchain dependencies after a clean build confirms they are unnecessary.
