# Security Policy

## Supported Versions

Crypt of Greed is currently an early prototype. Security fixes are applied only to the latest `main` branch unless a maintained release branch is announced.

## Reporting a Vulnerability

Do not disclose exploitable vulnerability details, credentials, private keys, database contents, or personal information in a public issue.

Preferred reporting process:

1. Use GitHub private vulnerability reporting from the repository Security tab when available.
2. Include the affected path, impact, reproduction steps, and a minimal proof of concept.
3. Remove real secrets and personal data from screenshots, logs, and request bodies.
4. Allow maintainers time to confirm and remediate the issue before public disclosure.

When private vulnerability reporting is unavailable, open a public issue that contains only a request for private contact. Do not include vulnerability details in that issue.

## Sensitive Areas

Please treat findings in these areas as security-sensitive:

- authentication and session handling;
- account ownership checks;
- character and currency updates;
- database access and Prisma queries;
- environment-variable exposure;
- legacy wallet, NFT, and private-key records;
- disabled custody endpoints that unexpectedly become reachable;
- dependency or build-chain compromise.

## Legacy Web3 Notice

Custodial wallet creation and NFT custody are disabled. Remaining legacy wallet and NFT code exists only for migration review. New private keys must never be generated, stored, logged, or transmitted by this project.

Any discovery of exposed legacy private keys or reachable custody behavior should be reported privately and treated as high severity.

## Secrets

Never commit:

- `.env` or `.env.local` values;
- database credentials;
- NextAuth secrets;
- wallet private keys or seed phrases;
- access tokens;
- production logs containing personal data.

If a secret is committed, rotate it immediately. Deleting the file in a later commit does not remove it from Git history.
