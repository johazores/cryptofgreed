# Security Policy

## Supported code

Security fixes are applied to the latest `main` branch. The project is an early prototype and does not currently publish supported release versions.

## Reporting a vulnerability

Do not include exploit details, credentials, private data, or reproduction secrets in a public issue.

Use GitHub private vulnerability reporting or a private security advisory when that option is available. When private reporting is unavailable, open a minimal public issue asking the maintainer for a private contact channel without disclosing the vulnerability itself.

Include, privately:

- the affected route, component, or dependency
- expected and actual behavior
- reproduction steps
- likely impact
- any suggested mitigation

## Sensitive data

Never commit `.env` files, database URLs, authentication secrets, passwords, private keys, access tokens, or production logs containing personal data.

The active application does not create cryptocurrency wallets, store blockchain private keys, or expose NFT custody features. Any discovery of historical sensitive records should be reported privately and handled through a reviewed migration and deletion process.
