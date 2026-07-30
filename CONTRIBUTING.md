# Contributing to Crypt of Greed

Thanks for helping improve the prototype. Keep changes small, cohesive, and easy to review.

## Before starting

1. Read the root `README.md`.
2. Review `docs/README.md` and the relevant design or engineering document.
3. Check existing issues and pull requests to avoid duplicate work.
4. Do not commit secrets, private keys, database credentials, generated build output, or local environment files.

## Local validation

```bash
npm install
npx prisma db push
npm test
npm run typecheck
npm run build
```

A pull request must clearly state when a command could not be run and why.

## Branches and commits

- Use `feat/<name>` for feature and refactor branches during the current stabilization phase.
- Use Conventional Commits, such as `feat:`, `fix:`, `refactor:`, `docs:`, and `test:`.
- Keep each commit internally valid and related to one purpose.
- Avoid noisy formatting-only commits mixed with behavior changes.
- Pull requests are squash-merged so `main` keeps one clear commit per cohesive change.

## Architecture rules

- Keep game rules in `lib/game/` and keep React components focused on presentation and interaction.
- Put reusable primitives in `components/ui/`.
- Put feature components in their named folder under `components/`.
- Add character endpoints under `app/api/characters/`; do not create a second singular API family.
- Reuse existing managers and helpers before adding abstractions.
- Do not add blockchain, wallet custody, NFT, pay-to-earn, or stored-private-key behavior.
- Do not add or modify GitHub Actions during stabilization unless the repository owner explicitly requests it.

## Pull requests

Describe:

- what changed
- why it changed
- player or developer impact
- validation performed
- schema or deployment steps
- known limitations

Prefer one reviewable concern over a large collection of unrelated cleanup.
