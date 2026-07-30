# Contributing to Crypt of Greed

Thanks for helping improve the prototype. Keep changes cohesive, simple, and easy to review.

## Before starting

1. Read the root `README.md`.
2. Review `docs/README.md` and the relevant design or engineering document.
3. Check existing issues and pull requests to avoid duplicate work.
4. Do not commit secrets, private keys, database credentials, generated build output, or local environment files.

## Local setup and validation

```bash
npm install
npx prisma db push
npm test
npm run typecheck
npm run build
```

A pull request must clearly state when a command could not be run and why.

## Branches

Use a focused branch name:

```text
feat/<feature-name>
fix/<bug-name>
refactor/<scope-name>
docs/<topic-name>
```

## Commits

Use Conventional Commits:

```text
feat: add card reward selection
fix: prevent duplicate room advancement
refactor: organize shared form controls
docs: update gameplay roadmap
test: cover greed threshold rules
```

Commit expectations:

- Keep each commit internally valid and related to one purpose.
- Prefer several meaningful commits when a change has clear reviewable stages.
- Do not create formatting-only or artificial commit spam solely to increase the commit count.
- Separate moves, import migrations, behavior changes, tests, and documentation when that improves reviewability.
- Do not mix unrelated cleanup into a feature commit.

The merge method should preserve useful history:

- use a regular merge for a clean sequence of focused commits;
- use squash merge when the branch contains noisy fixups or one inseparable change;
- use rebase merge only when it preserves clarity and does not rewrite shared work unexpectedly.

## Architecture rules

- Keep game rules in `lib/game/` and keep React components focused on presentation and interaction.
- Put reusable primitives in `components/ui/`.
- Put feature components in their named folder under `components/`.
- Add character endpoints under `app/api/characters/`; do not create a second singular API family.
- Reuse existing managers and helpers before adding abstractions.
- Do not add blockchain, wallet custody, NFT, pay-to-earn, or stored-private-key behavior.
- Do not add or modify GitHub Actions during stabilization unless the repository owner explicitly requests it.

## Documentation placement

- Product decisions: `docs/product/`
- Game design and UX: `docs/design/`
- Architecture and implementation: `docs/engineering/`
- Steam and console preparation: `docs/platform/`

Use lowercase kebab-case file names and update `docs/README.md` whenever a source-of-truth document is added or moved.

## Pull requests

Describe:

- what changed;
- why it changed;
- player or developer impact;
- validation performed;
- schema or deployment steps;
- known limitations;
- screenshots for visible UI changes.

Keep unrelated changes in separate pull requests.

## Security

Do not open public issues containing secrets or exploitable vulnerability details. Follow `SECURITY.md` instead.
