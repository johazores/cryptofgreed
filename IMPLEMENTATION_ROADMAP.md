# Crypt of Greed — Implementation Roadmap

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.


## Roadmap Principles

Order work by dependency and player value.

1. Remove release and security risk.
2. Prove the unique mechanic.
3. Establish the production platform.
4. Build content on stable systems.
5. Add polish continuously.
6. Prepare Steam before consoles.
7. Do not automate expensive workflows before the build is stable.
8. Keep each milestone shippable and testable.

Complexity scale:

- **S:** localized, low-risk change
- **M:** multiple systems or moderate design work
- **L:** major feature or architecture change
- **XL:** migration/platform program

Player impact:

- **Critical:** game cannot be trusted or understood without it
- **High:** directly improves fun, retention, or first impression
- **Medium:** adds depth or commercial quality
- **Low:** useful but should not displace core work

## Milestone 0 — Truth, Safety, and Reproducibility

### Objective

Make the current prototype honest, safe to inspect, and stable enough to validate design.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Replace root README with real setup/product status | none | S | Medium |
| Remove unsupported 1,000-card/50-boss/infinite-build claims | none | S | High |
| Remove play-to-earn/NFT positioning from commercial path | product decision | S | Critical |
| Disable custodial wallet creation | product decision | M | Critical |
| Remove Base64 private-key storage from public flow | wallet disable | M | Critical |
| Fix double enemy turns | none | S | Critical |
| Fix floor initialization and run resets | none | M | Critical |
| Fix victory/reward accounting | combat fix | M | Critical |
| Fix or remove shop equipment purchase | NFT separation | M | High |
| Remove revival bypass and define death rule | product decision | M | High |
| Add `typecheck` and test scripts | none | S | Medium |
| Add core combat unit tests | combat fixes | M | High |
| Run clean install, lint, type-check, production build | scripts | M | Critical |
| Record runtime defects and screenshots | build | S | Medium |
| Inventory asset licenses and remove starter assets | none | M | Medium |

### Exit criteria

- no private key is created for new players
- one enemy turn per player turn
- floor and rewards are reproducible
- a clean production build result is documented
- public copy matches implementation
- core tests run locally
- no gameplay content expansion started

## Milestone 1 — Greed Loop Proof

### Objective

Prove that “bank or risk” makes the game worth playing.

### Scope

Stay in the current prototype only long enough to validate the mechanic.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Define `RunState` in one place | M0 | L | Critical |
| Add seeded RNG | RunState | M | High |
| Persist deck and route through rooms | RunState | L | Critical |
| Implement card reward: choose/skip | run persistence | M | Critical |
| Implement Hoard, banked Hoard, and Greed | RunState | L | Critical |
| Add extraction altar with Bank/Extract/Defy | Greed | M | Critical |
| Add 20–24 prototype cards | card reward | M | High |
| Add 5 enemies with two patterns each | combat engine | M | High |
| Add one elite and one boss | enemies | M | High |
| Make rest, shop, and event stateful | RunState | L | High |
| Add basic run checkpoint | RunState | M | Critical |
| Add minimal tutorial | stable loop | M | High |
| Add essential SFX/visual feedback placeholders | stable actions | M | High |
| Conduct three playtest rounds | playable act | M | Critical |

### Exit criteria

- testers explain Greed after one run
- no dominant bank/risk choice across most states
- at least 60% of qualified testers voluntarily begin a second run
- one act can be completed
- saves resume correctly
- core loop is fun without NFT, account, or permanent stat grind

### Kill criteria

If Greed does not change decisions after iteration, redesign or replace the USP before production migration.

## Milestone 2 — Production Engine Foundation

### Objective

Move the proven game into a platform-appropriate engine.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Unity versus Godot technical spike | M1 proof | L | Critical |
| Decide engine and record ADR | spike | S | Critical |
| Create pure deterministic domain | decision | XL | Critical |
| Port one complete encounter | domain | L | High |
| Build action-based input | engine | L | Critical |
| Build controller-first UI navigation | input | L | Critical |
| Implement content definitions/validation | domain | L | High |
| Implement versioned local save + backup | domain | L | Critical |
| Implement one run map and checkpoint | save | L | Critical |
| Add platform service interfaces | engine | M | Medium |
| Validate Windows, Deck-resolution, and mobile layout prototypes | UI | L | High |
| Add automated domain tests | domain | L | High |

### Exit criteria

- same seed produces same run decisions/outcomes
- one-act rules match validated prototype
- controller-only completion
- save interruption recovery
- 800p readability
- no backend required for normal play
- technical migration decision is irreversible only after evidence

## Milestone 3 — Complete Core Gameplay

### Objective

Deliver a complete three-act game loop with one deeply designed delver.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Complete Ironbound card pool | M2 | L | High |
| Create 12+ relics then expand to 25 | content system | L | High |
| Complete three acts | run system | XL | Critical |
| Add 20+ enemy patterns | combat/content | XL | High |
| Add elites and three act bosses | enemies | L | High |
| Add 25+ meaningful events | run/content | L | High |
| Add card upgrade/removal/transformation | deck system | L | High |
| Add full Greed tier behavior | Greed | L | Critical |
| Add extraction endings | narrative/run | M | High |
| Balance economy and reward pools | complete content | L | Critical |
| Add run summary and score | stable run | M | High |

### Exit criteria

- one delver supports at least three viable build families
- all room types change state
- no act is filler
- successful run fits 25–35 minute target
- player can recover from imperfect early choices
- boss losses are explainable

## Milestone 4 — Progression and Replayability

### Objective

Turn a complete run into a durable premium game.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Profile save and unlock graph | M3 | L | High |
| Codex and discovery tracking | profile | M | Medium |
| Achievements | profile/platform | M | High |
| Depth difficulty levels | balanced base | L | High |
| Contracts/challenges | stable rules | M | Medium |
| Daily seeded challenge | determinism/backend optional | L | Medium |
| Add Trickshot | stable content process | XL | High |
| Add Hexbinder | stable content process | XL | High |
| Add alternate starts/loadouts | classes | M | Medium |
| Add cosmetic unlocks | profile | M | Low |

### Exit criteria

- unlocks expand choice rather than raw power
- visible goals exist after every run
- daily challenge does not block offline play
- each class has distinct decision patterns
- Depth modifiers add rules, not only stats

## Milestone 5 — Premium UI, Accessibility, Audio, and Game Feel

### Objective

Make every interaction feel authored and platform-ready.

This milestone begins in M2 and completes here; polish is not postponed entirely.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Final visual design system | stable screens | L | High |
| Combat outcome previews | stable domain | M | Critical |
| Keyword glossary/tooltips | content | M | High |
| Input glyph switching | input | M | High |
| Remapping | input | M | High |
| UI/text scaling | UI system | M | High |
| Contrast and color-vision modes | art/UI | M | High |
| Reduced motion, shake, flash controls | VFX | M | High |
| Full audio mixer/settings | audio | M | High |
| Adaptive music by Greed/boss state | audio | L | Medium |
| Card/relic/enemy signature SFX | content | L | High |
| Haptic feedback map | input/audio | M | Medium |
| Fast animation mode | feedback | M | High |
| Controller-only and accessibility test rounds | complete UX | M | Critical |

### Exit criteria

- controller and mouse completion parity
- readable at 800p and television distance
- important information not color-only
- motion/flash can be reduced
- every core action has feedback
- no repeated animation blocks decision-making

## Milestone 6 — Steam Demo and Market Validation

### Objective

Ship a trustworthy public demo and validate commercial demand.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Steamworks integration | M2–M5 | L | High |
| Steam Cloud | save | M | Critical |
| Steam Achievements | achievements | M | Medium |
| Steam Input/default config | input | M | Critical |
| Deck performance/readability pass | UI/performance | M | Critical |
| Demo content cut | M3 | M | High |
| Store capsule/screenshots/trailer | visual identity | L | High |
| Accessibility feature page | settings | S | Medium |
| Privacy and telemetry disclosure | telemetry | S | Medium |
| Crash reporting | engine | M | Critical |
| Public playtest and feedback triage | demo | L | Critical |
| Wishlist and conversion measurement | store page | M | Medium |

### Exit criteria

- no blockchain/NFT issue/exchange
- no account required
- demo has one complete act
- crash-free target above 99.5%
- cloud save passes PC/Deck matrix
- controller-only players complete demo
- store claims are auditable
- feedback supports pricing and scope

## Milestone 7 — Version 1.0 Production

### Objective

Complete content, localization, QA, and commercial release.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Final content targets | M3–M4 | XL | High |
| Balance and telemetry passes | content | L | Critical |
| Localization framework/content | stable text | XL | High |
| Final achievements | content | M | Medium |
| Save migration from demo/EA | save | L | Critical |
| Performance optimization | final content | L | High |
| License/legal review | assets/product | M | Critical |
| Full QA matrix | RC | XL | Critical |
| Release branches and rollback process | stable build | M | Critical |
| Support knowledge base | known issues | M | Medium |
| Launch build and hotfix plan | RC | M | Critical |

### Exit criteria

- no known save-loss defect
- no P0/P1 crash
- complete offline game
- localized store metadata matches game
- performance budgets met
- rollback build available
- support and patch ownership assigned

## Milestone 8 — Console Readiness

### Objective

Prepare and port only after PC product-market evidence or publisher funding.

### Tasks

| Task | Dependency | Complexity | Player impact |
|---|---|---:|---:|
| Platform applications | strong PC build | M | Low |
| Porting partner/publisher decision | applications | L | Medium |
| Devkit acquisition | approval | M | Low |
| First platform build | SDK | XL | High |
| User/save/suspend integration | platform build | L | Critical |
| Platform services | SDK | L | Medium |
| Safe-area/TV pass | UI | M | High |
| Certification gap analysis | platform build | L | Critical |
| Ratings and store assets | content lock | M | Medium |
| Submission and fixes | RC | XL | Critical |

### Exit criteria

- platform approval
- stable devkit build
- certification checklist closed
- save/suspend reliable
- patch pipeline tested
- post-launch support funded

## Milestone 9 — Mobile Adaptation

### Objective

Adapt, not merely shrink, the proven premium game.

### Tasks

- touch interaction prototype
- portrait versus landscape decision
- card readability
- long-press inspect
- battery/memory profile
- app lifecycle save
- platform cloud/achievements
- premium pricing
- no ad model
- no energy/stamina
- no paid revives
- store compliance
- device matrix

Mobile is after PC balance because touch UI and business pressure must not distort the core design.

## Milestone 10 — Post-Launch

### Objective

Grow trust and replayability without turning the game into a live-service obligation.

### Options

- free QoL and balance patches
- first mechanical expansion
- soundtrack/supporter pack
- community seeds
- mod support
- Steam Workshop
- additional localization
- alternate bosses
- console patches
- anniversary challenge

### Rules

- no FOMO
- no power-selling
- no save-breaking silent update
- public patch notes
- beta branch for risky migrations
- community feedback informs but does not replace design ownership

## First Implementation Slice After Documentation

Create branch:

`feat/core-run-stability`

Scope only:

1. fix double enemy turn
2. establish one combat turn owner
3. fix persisted floor initialization
4. fix victory reward accounting
5. add deterministic shuffle utility
6. add tests for turn, victory, and shuffle
7. update README with verified setup and known limitations

Do not include:

- new class
- new cards beyond test fixtures
- UI redesign
- engine migration
- Steam integration
- blockchain expansion

This is the safest next PR because it makes later Greed prototyping measurable.

## Roadmap Governance

Update this document when:

- a milestone changes scope
- a dependency is discovered
- playtest evidence rejects an assumption
- a platform policy changes
- a milestone completes

For every completed task, link:

- issue
- PR
- test evidence
- playtest finding where relevant

Do not mark work complete because a screen exists. Mark it complete when its exit criteria pass.
