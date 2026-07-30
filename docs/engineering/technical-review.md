# Crypt of Greed — Technical Review

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.


## Executive Decision

The current Next.js codebase is suitable as a disposable gameplay prototype and web marketing/account experiment. It is not a suitable long-term foundation for a commercial game targeting Steam, consoles, handheld PCs, and mobile.

Do not perform a large in-place framework refactor. Use the current build to validate the core Greed loop, then migrate the proven design to a production game engine.

### Recommended production engine

**Default recommendation: Unity 6 LTS with C#.**

Reasons:

- direct commercial tooling for desktop, mobile, Nintendo, PlayStation, and Xbox after approval
- mature input, audio, animation, profiling, localization, and asset pipelines
- established third-party console support ecosystem
- pure C# domain logic can be tested independently
- appropriate for a UI-heavy 2D card game

Alternative:

- Godot 4 is viable for PC/mobile and can reach consoles through licensed middleware or porting partners.
- Choose Godot only if lower engine cost and open source outweigh the expected console-porting dependency.

A two-week technical spike should verify:

- controller-first card navigation
- save/resume
- content authoring
- 800p handheld layout
- Steam integration
- mobile touch adaptation
- build size and performance

## Current Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- MongoDB
- NextAuth credentials
- ethers
- Solidity/Hardhat builder
- server API routes

## Architecture Findings

### Mixed product boundaries

Marketing, user management, game simulation, persistence, wallet custody, and blockchain transactions share one deployment and data model.

### Mutable domain objects in React

Combat managers mutate shared game state and return shallow copies. React components then create partial copies, creating stale-state and identity risks.

### Duplicated domain logic

Card play, special effects, hand draw, discard reshuffle, turn end, and combat state are implemented in more than one class.

### Duplicated navigation logic

Room selection and route generation exist in the room manager, room navigation helpers, game screen, and combat screen.

### Transient and persistent state are mixed

The database character is extended in TypeScript with deck, hand, discard, and block fields that are not database fields.

### Client authority

The client calculates progression and submits final values to a general update endpoint.

### Incomplete data contracts

Shop equipment omits fields required by the API. Database and contract equipment slot enums differ.

### No deterministic simulation

`Math.random()` is used in multiple locations, including array sorting. Runs cannot be replayed, debugged, shared, or verified.

### No test layer

No meaningful unit, integration, save migration, or end-to-end tests were detected.

### Build quality gaps

- default Next.js README
- empty Next config
- permissive `allowJs`
- `skipLibCheck`
- obsolete `next lint` script for current Next versions may require validation
- no explicit type-check script
- no test script
- no asset validation
- no release packaging

## Critical Defects

### Combat

- enemy turn can execute twice
- victory state reads mutated/empty enemy arrays
- initial battle floor can reset
- special effects are implemented in one manager and placeholders in another
- card target is hardcoded to first enemy
- enemy intents do not update
- block timing is duplicated
- shuffle is not deterministic
- starter card arrays use shared object references through `Array.fill`
- equipment stats are not integrated into combat
- powers are not resolved

### Run flow

- deck resets
- route choices are generated in several places
- floor updates can occur before room resolution
- page routing and in-memory room state conflict
- no run checkpoint
- no save recovery
- no abandon-run transaction
- no run completion model

### Economy

- reward calculation is client-side
- revive UI bypasses crystal deduction endpoint
- shop purchase contract is invalid
- purchased shop stock remains visible
- no transaction joins equipment creation and gold deduction
- level curve and health restore are hidden in generic update route

### Security

- private keys are Base64 encoded
- encryption key is unused
- custodial wallets are created by default
- password minimum is weak for a financial account context
- no evident rate limiting
- death route ownership is incorrect
- NFT burn call uses incompatible arguments
- external calls occur inside a database transaction
- contract operation and database state cannot be atomic
- NFT discovery is a placeholder
- public environment variable naming exposes configuration intent
- blockchain configuration contradicts runtime-config requirements

## Recommended Production Architecture

## 1. Pure game domain

A plain C# assembly without Unity scene dependencies.

Responsibilities:

- rules
- commands
- state transitions
- seeded random
- effect resolution
- combat log
- reward generation
- run progression
- score calculation

Example modules:

```text
Game.Domain/
  Cards/
  Combat/
  Enemies/
  Runs/
  Rewards/
  Greed/
  Content/
  Random/
  Saves/
```

Avoid one class per tiny concept. Organize around cohesive features.

## 2. Presentation

Unity scenes/UI consume snapshots and domain events.

```text
Game.Presentation/
  Screens/
  Combat/
  Map/
  Rewards/
  Collection/
  Settings/
  Feedback/
```

Presentation cannot directly alter gold, health, or deck state. It dispatches commands.

## 3. Content

Use ScriptableObjects for authoring and export validated runtime definitions.

Each definition has:

- stable content ID
- localization keys
- tags
- balance values
- icon/art references
- effect list
- unlock conditions
- version/deprecation status

A small internal content validator checks:

- duplicate IDs
- missing localization
- invalid references
- impossible upgrade path
- missing art/audio
- unsupported effect
- balance bounds

Do not create an Admin CMS unless remote live configuration becomes a proven requirement. For a premium offline game, version-controlled content assets are the single source of truth.

## 4. Platform services

Interfaces isolate:

- achievements
- cloud save
- input glyphs
- rich presence
- leaderboard
- user identity
- DLC entitlements
- telemetry
- storage paths

The game domain does not import Steamworks, console SDKs, or mobile APIs.

## 5. Optional backend

Not required for base gameplay.

Potential uses:

- daily challenge seed
- leaderboard submission
- opt-in telemetry
- remote crash symbols
- news/version message

The game remains playable offline.

## State Model

### RunState

```text
runId
schemaVersion
seed
contentVersion
delverId
act
node
routeHistory
deck
relics
health
gold
bankedHoard
unbankedHoard
greedTier
statusEffects
discoveredInformation
rngPosition
checkpointTimestamp
```

### CombatState

```text
turn
phase
energy
block
hand
drawPile
discardPile
exhaustPile
playerStatuses
enemies
pendingEvents
combatResult
```

### ProfileSave

```text
schemaVersion
settings
unlocks
achievements
statistics
codex
completedDepths
cosmetics
activeRunReference
```

## Command/Event Pattern

Commands:

- `PlayCard`
- `SelectTarget`
- `EndTurn`
- `ChooseReward`
- `ChooseRoute`
- `BankHoard`
- `ExtractRun`
- `AcceptBargain`

Events:

- `CardPlayed`
- `EnergySpent`
- `DamageDealt`
- `BlockGained`
- `StatusApplied`
- `EnemyIntentChanged`
- `EnemyDefeated`
- `GreedChanged`
- `HoardBanked`
- `RunEnded`

This is not event sourcing infrastructure. It is a simple ordered result list used for animation, logs, tests, and replay debugging.

## Determinism

Requirements:

- seeded PRNG owned by the run
- never use global random for rules
- stable content ordering
- record RNG position
- deterministic shuffle
- deterministic reward generation
- deterministic enemy patterns
- deterministic score

Benefits:

- reproducible bugs
- daily challenges
- seed sharing
- balance analysis
- compact run validation
- replayable tests

## Save System

### Requirements

- local, offline-first
- versioned schema
- atomic write to temporary file then replace
- rolling backup
- checksum for corruption detection
- save after each resolved node and critical settings change
- active-run checkpoint
- migration tests
- platform-specific path adapter
- Steam Cloud conflict strategy
- no secrets in save
- safe behavior on storage failure
- clear timestamp and build version

### Cloud conflict

Show:

- local timestamp/progress
- cloud timestamp/progress
- recommended choice
- backup creation before replacement

Never silently overwrite a newer save.

## Input Architecture

Define game actions:

- Navigate
- Confirm
- Cancel
- Inspect
- EndTurn
- OpenDeck
- OpenDiscard
- Pause
- QuickInfo
- TabLeft
- TabRight

Presentation maps actions to active screens. Device-specific glyphs are resolved separately.

Support simultaneous mouse, keyboard, and controller input.

## Audio Architecture

Mixers:

- Master
- Music
- SFX
- UI
- Ambience
- Voice

Systems:

- event-to-sound map
- pooled one-shots
- music state machine
- dynamic intensity based on Greed and boss phase
- haptic event map
- accessibility alternatives for essential sound cues

## Performance Budgets

### PC/Deck

- 60 FPS target
- 30 FPS minimum at 800p default on Deck
- UI input response under one frame
- no network request on normal combat action
- no per-frame allocation in domain simulation
- bounded VFX count
- async scene/asset preload
- save under 100 ms typical

### Memory

Set budgets during engine spike:

- base UI
- current act art
- audio
- localization
- effects
- backups

Load only current act/encounter content where practical.

## Testing Strategy

### Unit

- card effects
- enemy patterns
- turn order
- damage/block
- status timing
- Greed modifiers
- rewards
- banking
- score
- save migration
- deterministic seed replay

### Integration

- full encounter
- room-to-room run
- boss clear
- death
- extraction
- save/resume
- cloud conflict
- controller disconnect
- DLC unavailable
- localization fallback

### Automated content tests

- every card can load
- every enemy has legal pattern
- every reward pool has valid options
- every localization key exists
- no encounter references removed content
- no achievement is impossible under current rules

### Manual

- controller-only
- Deck 800p
- 4K television
- low-end PC
- offline
- slow storage
- interrupted save
- suspend/resume
- multiple user profiles
- reduced motion
- high UI scale

## Observability

For development builds:

- run seed
- content version
- command log
- event log
- save path/version
- current scene
- performance counters

For release:

- privacy-respecting crash reports
- opt-in anonymous balance telemetry
- no wallet or financial identifiers
- no raw personal data in logs

## Migration Plan

### Stage 0 — Stabilize prototype

Only critical fixes:

- double enemy turn
- state reset
- reward accounting
- broken shop
- death/revive bypass
- remove wallet custody from new accounts
- truthful copy
- basic tests

### Stage 1 — Validate Greed in current prototype

Build one act with minimal art. Do not invest in platform packaging.

Exit criteria:

- testers understand Greed
- meaningful second-run rate
- core combat is fun without meta progression
- session length target is credible

### Stage 2 — Engine spike

Implement:

- one combat
- controller navigation
- save
- one Greed decision
- one platform integration stub

Choose Unity or Godot based on measured results.

### Stage 3 — Production migration

Port rules and content deliberately. Do not port web/API abstractions that no longer serve the product.

Archive the web prototype or retain it as a public demo/marketing experiment.

## Configuration Strategy

### Version-controlled content

Administrator-changeable game balance does not justify environment variables.

Store:

- cards
- enemies
- relics
- encounters
- economy
- unlock rules
- accessibility defaults

in validated content assets committed to the project.

### Environment/secrets only

Use build/secure settings for:

- telemetry endpoint
- signing credentials
- platform app IDs
- crash reporting token
- optional backend URL

Secrets never enter client content files.

### Remote config

Add only if required for:

- disabling a broken daily challenge
- minimum supported version
- service status

Remote config must not silently rebalance offline single-player runs.

## Technical Definition of Done for Steam Demo

- deterministic domain
- versioned save and backup
- controller/keyboard/mouse parity
- Steam Deck 800p pass
- Steam Input or robust native input
- Steam Cloud test
- achievements test
- offline launch
- no blockchain/NFT issue or exchange
- no required account
- crash reporting
- performance budgets met
- clean uninstall/reinstall save behavior
- license and asset audit complete

## Research References

- Unity console support: https://unity.com/solutions/console
- Godot console support: https://docs.godotengine.org/en/4.4/tutorials/platform/consoles.html
- Steam Input: https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_devs
- Steam Deck compatibility: https://partner.steamgames.com/doc/steamhardware/compat
- Steam onboarding: https://partner.steamgames.com/doc/gettingstarted/onboarding
