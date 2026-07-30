# Crypt of Greed Technical Review

> Status: Current architecture summary
>
> Review date: 2026-07-30
>
> Scope: Browser prototype and migration direction

## Executive decision

The current Next.js application is suitable for validating the core combat, progression, merchant, equipment, and bank-or-risk Greed design. It is not intended to become the permanent commercial engine for desktop, console, handheld, and mobile releases.

Use the browser prototype to prove the game loop and content direction. Migrate the validated domain to a production game engine before committing to platform release work.

## Current repository state

The previous blockchain, custodial wallet, private-key, NFT, Hardhat, and smart-contract implementation has been removed from the active product.

The active repository now contains:

- Next.js 15 and React 19;
- TypeScript and Tailwind CSS;
- NextAuth credentials authentication;
- Prisma with MongoDB;
- isolated game-domain rules under `lib/game/`;
- automated tests for combat, rewards, revival, room progression, merchant inventory, equipment bonuses, and character creation;
- authenticated server-side merchant and revival behavior;
- responsive combat, room, dashboard, onboarding, navigation, and account interfaces.

The game is a development prototype and does not include a blockchain runtime dependency.

## Improvements completed after the initial audit

- Removed custodial wallet and stored-private-key behavior.
- Removed NFT custody, smart-contract, Hardhat, and generated artifact code.
- Centralized combat turns and room progression.
- Added deterministic seeded shuffling for tested flows.
- Added focused game-domain tests.
- Rebuilt merchant purchases as authenticated atomic transactions.
- Connected equipment bonuses to combat cards.
- Standardized character APIs.
- Added responsive gameplay and accessible interaction states.
- Added contribution, security, conduct, issue, and pull request guidance.

## Remaining browser-prototype gaps

### Run persistence

- The complete deck, route history, room state, and rewards are not yet persisted as one versioned run.
- Save recovery, abandon-run, and completed-run models remain incomplete.
- Save format migration and compatibility tests are not implemented.

### Core Greed identity

- Greed, Hoard, banking, extraction, card rewards, relics, and deck upgrades remain incomplete.
- The prototype needs to prove that the bank-or-risk decision creates meaningful tension before production-engine migration.

### Content and balance

- Card, enemy, event, equipment, and room content remains limited.
- Equipment and economy values require balancing.
- Content definitions need stable IDs and validation.

### Platform readiness

- Controller-first navigation is not complete.
- Audio, localization, achievements, cloud saves, native builds, and store integration are not implemented.
- Desktop, handheld, mobile, and console layouts require dedicated validation.

## Recommended production architecture

### Pure game domain

Use a plain C# assembly without Unity scene dependencies.

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

The domain owns rules, commands, state transitions, seeded random behavior, effects, combat logs, rewards, progression, and score calculation.

Presentation must not directly alter health, gold, deck, rewards, or run state. It dispatches commands and renders domain snapshots and events.

### Presentation

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

Validate keyboard, mouse, controller, touch, and 800p handheld layouts early.

### Content

Use validated content definitions with:

- stable content IDs;
- localization keys;
- tags;
- balance values;
- artwork and audio references;
- effect lists;
- unlock conditions.

Unity ScriptableObjects may be used for authoring, but exported runtime definitions should be testable without scene dependencies.

### Save system

Use a versioned save format with explicit migrations. Persist only stable content IDs and domain state required to restore a run.

Test:

- save and resume;
- interrupted writes;
- old save migration;
- missing content references;
- platform storage failures;
- cloud conflict behavior when cloud saves are introduced.

## Engine recommendation

Default recommendation: Unity 6 LTS with C# after the browser prototype validates the Greed loop.

Godot 4 remains viable for PC and mobile, but console delivery typically requires licensed middleware or a porting partner.

Before selecting the production engine, complete a focused technical spike covering:

- controller-first card navigation;
- save and resume;
- content authoring;
- 800p handheld layout;
- Steam integration;
- mobile touch adaptation;
- build size and performance.

## Migration trigger

Begin production-engine migration only after the browser prototype proves:

1. the Greed or banking decision is understandable and strategically meaningful;
2. combat and progression remain enjoyable across repeated runs;
3. the content model supports cards, enemies, rooms, rewards, relics, and upgrades without duplicated rules;
4. a complete run can be persisted and restored reliably;
5. the intended commercial scope and target platforms are confirmed.

## Current conclusion

The repository is now a cleaner, tested browser prototype with the abandoned blockchain architecture removed. The highest-value next step is not another framework refactor. It is completing and validating the distinctive Greed loop, versioned run persistence, and content pipeline before migrating proven rules into a production game engine.
