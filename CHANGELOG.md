# Changelog

Notable repository and product changes are recorded here. The project is pre-release and does not yet have stable semantic-versioned releases.

## Unreleased

### Added

- Organized public documentation under `docs/`.
- Repository structure and contribution guidance.
- Security and conduct policies.
- GitHub pull request and issue templates.

### Changed

- Grouped shared React components by authentication, character, layout, and UI responsibility.
- Clarified that wallet and NFT code is legacy and outside the active product path.

### Removed

- Duplicate top-level component files after import migration.
- Unused settings and wallet button components.

## 2026-07-30

### Added

- Product audit, design documentation, technical review, commercial strategy, and platform-readiness plans.
- Automated tests for combat, rewards, revival, progression, merchant inventory, equipment bonuses, and character creation.
- Responsive gameplay-room, dashboard, onboarding, navigation, and account interfaces.

### Changed

- Centralized room progression and combat turn ownership.
- Rebuilt merchant purchases as authenticated atomic transactions.
- Made normal equipment independent of NFT identifiers.
- Improved authentication, profile updates, character creation, and revival integrity.

### Security

- Disabled custodial wallet creation.
- Disabled NFT custody endpoints.
- Stopped generating or storing private keys for new accounts.
