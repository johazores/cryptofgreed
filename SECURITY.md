# Security Policy

## Supported Code

Security fixes are applied to the latest `main` branch. Crypt of Greed is an early prototype and does not currently publish supported release versions.

## Reporting a Vulnerability

Do not include exploit details, credentials, private data, or reproduction secrets in a public issue.

Preferred reporting process:

1. Use GitHub private vulnerability reporting from the repository Security tab when available.
2. Include the affected route, component, dependency, or data path.
3. Describe expected and actual behavior, reproduction steps, likely impact, and any suggested mitigation.
4. Remove real secrets and personal data from screenshots, logs, request bodies, and database examples.
5. Allow maintainers time to confirm and remediate the issue before public disclosure.

When private reporting is unavailable, open a minimal public issue requesting a private contact channel. Do not include vulnerability details in that issue.

## Sensitive Areas

Treat findings in these areas as security-sensitive:

- authentication, password handling, and sessions;
- account and character ownership checks;
- currency, revival, rewards, and equipment mutations;
- database access and Prisma queries;
- environment-variable or server-error exposure;
- dependency or build-chain compromise;
- historical wallet, NFT, private-key, or blockchain records that remain in an existing database.

## Secrets and Personal Data

Never commit:

- `.env` or `.env.local` values;
- database URLs or credentials;
- NextAuth secrets;
- passwords or password hashes;
- private keys or seed phrases;
- access tokens;
- production logs containing personal data.

If a secret is committed, rotate it immediately. Deleting it in a later commit does not remove it from Git history.

## Removed Web3 Functionality

The active application does not create cryptocurrency wallets, store blockchain private keys, expose NFT custody, or include a blockchain runtime dependency.

Any discovery of historical sensitive records should be reported privately and handled through a reviewed migration and deletion process before production deployment.
