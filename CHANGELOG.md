# Changelog

Notable product and repository changes are recorded here. Crypt of Greed is pre-release and does not yet publish stable semantic-versioned releases.

## Unreleased

### Added

- Public contribution, security, and conduct guidance.
- Structured issue and pull request templates.
- Reproducible environment and editor configuration.

### Changed

- Documentation and active source are grouped by responsibility.
- The active product is fully separated from the abandoned blockchain prototype.

## 2026-07-30

### Added

- Product audit, game-design, UX, technical, monetization, roadmap, Steam, and console documentation.
- Automated tests for combat, rewards, revival, room progression, merchant inventory, equipment bonuses, and character creation.
- Responsive gameplay-room, dashboard, onboarding, navigation, and account interfaces.

### Changed

- Centralized combat turns and room progression.
- Rebuilt merchant purchases as authenticated atomic transactions.
- Made equipment ordinary game data that affects combat cards.
- Organized public documentation and active source by responsibility.
- Standardized character APIs under `app/api/characters/`.

### Removed

- Custodial wallet creation and stored-private-key behavior.
- NFT custody, wallet UI, smart-contract, Hardhat, generated artifact, and blockchain runtime code.
- Duplicate and superseded API paths.
