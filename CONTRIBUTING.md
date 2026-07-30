# Contributing to Crypt of Greed

Thank you for helping improve Crypt of Greed. This repository is an early gameplay prototype, so contributions should prioritize correctness, simplicity, and a coherent player experience.

## Before You Start

1. Read the root `README.md`.
2. Review the documentation index in `docs/README.md`.
3. Check `docs/engineering/implementation-roadmap.md` for current priorities.
4. Check existing issues and pull requests before starting overlapping work.

## Local Setup

```bash
npm install
npx prisma db push
npm run dev
```

Create `.env.local` with:

```text
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Never commit secrets, private keys, production connection strings, or personal data.

## Development Principles

- Prefer less code and fewer abstractions.
- Keep gameplay rules outside React when practical.
- Reuse existing components before adding new variants.
- Keep folders shallow and responsibilities clear.
- Preserve Next.js route conventions under `app/`.
- Do not add new wallet, NFT, cryptocurrency, or custodial-key functionality.
- Do not modify GitHub Actions without a separate workflow and cost review.
- Update documentation when implementation behavior changes.

## Branches

Use a focused branch name:

```text
feat/<feature-name>
fix/<bug-name>
refactor/<scope-name>
docs/<topic-name>
```

## Commits

Use Conventional Commits and keep each commit reviewable:

```text
feat: add card reward selection
fix: prevent duplicate room advancement
refactor: organize shared form controls
docs: update gameplay roadmap
```

Prefer multiple meaningful commits over one mixed commit. Do not create formatting-only commit spam solely to increase the commit count.

## Validation

Run the relevant checks before opening a pull request:

```bash
npm test
npm run typecheck
npm run build
```

When a check cannot run because a required service is unavailable, explain that clearly in the pull request.

## Pull Requests

A pull request should include:

- what changed;
- why it changed;
- player or developer impact;
- important implementation decisions;
- validation performed;
- known limitations or follow-up work;
- screenshots for visible UI changes.

Keep unrelated changes in separate pull requests.

## Documentation Placement

- Product decisions: `docs/product/`
- UI, UX, and accessibility: `docs/design/`
- Architecture and implementation: `docs/engineering/`
- Steam and console preparation: `docs/platform/`

Use lowercase kebab-case file names and update `docs/README.md` when adding a source-of-truth document.

## Security

Do not open public issues containing secrets or exploitable vulnerability details. Follow `SECURITY.md` instead.
