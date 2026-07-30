# Crypt of Greed — Project Review

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.

## Executive Summary

Crypt of Greed is currently a browser-based Next.js prototype that combines a basic turn-based card combat loop with user accounts, MongoDB persistence, custodial cryptocurrency wallets, NFT equipment, and a lightweight marketing site.

It is not yet a commercially viable game. The main blocker is not visual polish; it is that the product does not have a complete, coherent run loop. Combat state is duplicated, progression resets between rooms, non-combat rooms have little or no mechanical consequence, saves are not run-safe, controller/audio systems are absent, and several critical economy and NFT paths are broken or insecure.

The current public positioning also promises substantially more than the repository implements. The landing page advertises more than 1,000 cards, more than 50 bosses, procedural dungeons, and effectively unlimited builds. The implementation contains a small starter set, one normal enemy, one elite, one boss, and no persistent deck-building loop.

The recommended commercial direction is:

> **A premium, single-player, turn-based deckbuilding roguelite in which the player repeatedly chooses whether to bank accumulated treasure or carry it deeper for larger rewards and greater danger.**

The unique product hook should be the **Greed system**, not blockchain ownership. Blockchain and NFT issuance should be removed from the commercial Steam build. Steam's current onboarding rules explicitly exclude applications built on blockchain technology that issue or allow exchange of cryptocurrency or NFTs.

## Audit Method

The audit reviewed the indexed repository structure and the key files that govern:

- application bootstrapping and build configuration
- authentication and persistence
- character data
- cards and combat state
- enemy generation
- room selection
- battle, shop, rest, and event screens
- death, revival, wallet, NFT, and equipment flows
- visual styling and metadata
- documentation and public assets

The audit is static. A local production build, runtime profiling session, end-to-end playtest, accessibility test, and device matrix were not available in this phase. These are required in Milestone 0.

## Current Product Inventory

### Implemented foundations

- Next.js application with React and TypeScript
- credential authentication through NextAuth
- MongoDB persistence through Prisma
- character creation and selection
- three named fighting styles
- starter deck generation
- turn-based energy, hand, draw pile, discard pile, block, healing, and damage
- basic enemy intent data
- normal, elite, and boss flags
- battle, rest, shop, and event room screens
- experience, level, gold, floor, health, and kill counters
- custodial wallet creation
- ERC-721 smart contract prototype
- external wallet and NFT management screens
- responsive Tailwind-based layouts

### Prototype-only or incomplete

- only a handful of distinct card definitions
- only one normal enemy, one elite, and one boss
- no complete card reward or deck editing loop
- no persistent run model
- no deterministic run seed
- no real dungeon map
- no meaningful event outcomes
- no shop stock lifecycle
- no equipment stat integration into combat
- no power/relic resolution system
- no complete boss behavior
- no permanent progression design
- no achievements, quests, challenges, or collections
- no tutorial
- no audio
- no gamepad or keyboard-first input layer
- no save recovery, migration, backup, or cloud strategy
- no graphics, audio, gameplay, or accessibility settings
- no test suite
- no analytics or balance telemetry
- no release packaging for Steam or consoles

## Critical Findings

### 1. The core loop does not persist through a run

A new game manager is created when new rooms and battles are initialized. This regenerates the starter deck and transient piles. There is no first-class `RunState` containing the chosen route, acquired cards, relics, pending rewards, RNG seed, room history, and checkpoint.

**Impact:** The product cannot deliver the basic fantasy of a deckbuilding roguelite.

**Decision:** Introduce one authoritative run model before adding content.

### 2. Combat has duplicated ownership and a double-turn defect

`GameManager` and `CombatManager` both implement card play, draw/discard, block reset, and turn transitions. The combat UI explicitly processes the enemy turn and then calls an `endTurn` method that processes it again.

**Impact:** Players may take double damage; behavior differs depending on which manager is used; bugs become hard to reproduce.

**Decision:** Keep one pure combat engine. UI dispatches commands and renders immutable snapshots.

### 3. The battle screen is a monolith

The main combat component owns initialization, enemy generation, input, persistence, reward calculation, death, revival, room selection, routing, modals, and rendering.

**Impact:** High regression risk, stale React state, difficult tests, duplicated room logic, and poor portability.

**Decision:** Split by responsibility, not by arbitrary abstraction:
- combat domain
- run coordinator
- persistence adapter
- presentation components
- platform input and feedback

### 4. Rewards and progression are not trustworthy

The client calculates rewards and sends final gold, experience, floor, health, and kill counts to a general update API. The server accepts those values. In an online economy this is easy to manipulate.

Victory accounting also reads enemy arrays after the combat manager has removed defeated enemies, which can produce incorrect rewards and kill counts.

**Decision:** For the premium offline game, make local saves authoritative and remove blockchain value. For online daily leaderboards, verify seeded run summaries separately rather than making every action server-dependent.

### 5. Shop purchases are broken

The shop submits equipment without the required NFT ID and contract address. The equipment API and database require both fields.

**Decision:** Remove NFT requirements from ordinary equipment. Equipment should be local game content with a stable content ID. Platform entitlements and cosmetic DLC must be separate from combat inventory.

### 6. Death and revival are unsafe and inconsistent

The UI revival flow directly updates character state and bypasses the endpoint that deducts crystals. The death endpoint does not properly verify that the character belongs to the current user and calls the NFT burn method with the wrong argument order and missing decrypted key.

**Decision:** Remove paid-currency revival from the commercial design. Death ends the run. A rare in-run relic may prevent one death, but it must be earned within the run and clearly communicated.

### 7. Custodial key storage is unacceptable

Private keys are encoded with Base64, not encrypted. An environment key is required but not used. The system creates custodial wallets at registration and stores reversible private keys.

**Decision:** Disable and remove custodial wallet creation before any public test. Do not carry this system into the commercial edition.

### 8. Blockchain conflicts with Steam distribution

Steam's published onboarding guidelines list blockchain applications that issue or exchange cryptocurrency or NFTs among content that should not be published.

**Decision:** The Steam/console product must be fully off-chain. A separate experimental web build could exist only if it has a distinct product identity, infrastructure, legal review, and no shared progression that compromises the premium game.

### 9. No shipping input strategy exists

No gamepad abstraction, keyboard navigation model, focus system, action map, glyph switching, or text-entry strategy was found.

**Decision:** Design controller-first UI from the beginning of the production implementation. Mouse is an additional input, not the structural assumption.

### 10. No audio or complete game-feel layer exists

There is no music manager, sound effect catalog, mixer, dynamic music state, haptics, hit-stop, camera feedback, or feedback settings.

**Decision:** Add game feel during the vertical slice, not at the end. Every core action needs an audiovisual response contract.

### 11. Documentation and marketing are inaccurate

The root README is still the default Next.js starter. The marketing site contains unsupported quantity claims and web3/play-to-earn metadata. Starter assets remain in the public directory.

**Decision:** Documentation must describe the actual product. Marketing claims require an auditable content count.

## Architecture Assessment

### Current architecture

The repository combines four products in one application:

1. a marketing website
2. an account dashboard
3. a card-game prototype
4. a custodial blockchain/NFT service

This creates coupling without delivering value to the player. A page transition can trigger database writes; combat relies on React state and mutable classes; account infrastructure is required before a player can try the game; and core game concepts are mixed with NFT lifecycle concepts.

### Recommended architecture

#### Product boundary

- **Shipping game:** offline-first premium title
- **Optional online services:** daily seed, leaderboard, cloud reconciliation, crash reporting
- **Marketing site:** independent web property
- **No blockchain dependency:** no wallet, gas, contract, NFT, or custody requirement

#### Production technology

The current web prototype can be used briefly to validate the Greed mechanic. It should not become the console codebase.

Preferred production path:

- **Unity 6 LTS + C#** if console releases are a real commitment
- **Godot 4** only if PC/mobile are primary and third-party console porting is accepted

Unity is the default recommendation because it provides an established path to Windows, macOS, Linux, mobile, Nintendo, PlayStation, and Xbox after platform-holder approval. This recommendation must be validated with a short technical spike before migration.

#### Domain shape

- `RunState`
- `CombatState`
- `PlayerState`
- `EnemyState`
- `CardDefinition`
- `RelicDefinition`
- `EncounterDefinition`
- `RewardDefinition`
- `RunCommand`
- `CombatEvent`
- seeded RNG service
- save serializer with schema version

The domain must be deterministic and independent of rendering. Presentation consumes events such as `CardPlayed`, `DamageResolved`, `EnemyDefeated`, and `RewardGranted`.

## UX Assessment

### Current strengths

- primary actions are visually obvious
- the game can be understood as a card battler
- enemy health and cards are separated into clear zones
- responsive CSS exists
- basic toast and modal feedback exists

### Current weaknesses

- tiny card text
- clickable `div` cards rather than accessible controls
- no visible focus system
- no keyboard/gamepad navigation
- no input glyphs
- no tooltip or keyword glossary
- no targeting preview
- no animation settings
- no battle log
- no damage breakdown
- no intent variety
- fixed bottom HUD risks overlap and handheld readability issues
- mixed typography and generic web-dashboard styling
- profile settings are presented as “Settings,” but no game settings exist
- account login is a barrier before first play

## Content Assessment

The content problem is not merely low quantity. Existing content lacks distinct behaviors.

A commercially useful vertical slice should prove variety with a deliberately small set:

- 1 playable class
- 30–40 cards
- 12 relics
- 8 normal enemies
- 2 elites
- 1 boss
- 8 events
- 1 complete act
- 3 Greed tiers
- 2–3 viable build families

Do not scale to hundreds of cards before telemetry and playtests show that the first set creates meaningful decisions.

## Performance Assessment

The repository is small, but there is no performance architecture.

Risks include:

- React rerenders around mutable manager objects
- repeated API round trips during runs
- remote font dependency
- client-side random generation without reproducibility
- no asset budget
- no object pooling or VFX budget
- no target frame-time or memory budget
- no low-power handheld profile
- no offline behavior

Targets for the production title:

- 60 FPS target on recommended PC and handheld
- 30 FPS hard floor on Steam Deck at 800p default settings
- instant controller response
- battle transition under 500 ms after assets are warm
- save operation under 100 ms in normal conditions
- graceful offline launch
- no required launcher

## Documentation Assessment

Existing documentation does not explain:

- product identity
- setup beyond default Next.js steps
- gameplay rules
- content authoring
- save format
- security
- deployment
- balance philosophy
- platform targets
- accessibility
- release process

The nine audit documents introduced in this branch become the project source of truth. The root README should later become a concise entry point that links to them.

## Prioritized Work Checklist

### P0 — Stop shipping risk

- [ ] Remove or disable custodial wallet creation
- [ ] Remove Base64 private-key storage
- [ ] Separate or remove NFT routes from the commercial build
- [ ] Remove unsupported marketing claims
- [ ] Add a truthful root README
- [ ] Fix double enemy turns
- [ ] Fix victory/reward accounting
- [ ] Fix floor initialization and run resets
- [ ] Replace general client-controlled stat updates
- [ ] Fix or remove death/revival economy
- [ ] Fix broken shop purchases
- [ ] Add minimum unit tests for combat and saves
- [ ] Run a clean install, lint, type-check, and production build
- [ ] Record all current runtime failures

### P1 — Prove the game

- [ ] Implement one authoritative `RunState`
- [ ] Add deterministic seeded RNG
- [ ] Build the Greed/cash-out mechanic
- [ ] Add card rewards and deck removal/upgrades
- [ ] Build one complete act
- [ ] Add meaningful rest, shop, and event choices
- [ ] Add distinct enemy patterns and readable intent
- [ ] Add run checkpoint and recovery
- [ ] Add first-time tutorial
- [ ] Add keyboard and gamepad action maps
- [ ] Add foundational SFX, music, hit feedback, and reduced-motion controls
- [ ] Conduct at least three external playtest rounds

### P2 — Build commercial depth

- [ ] Add two more classes after the first class is balanced
- [ ] Add meta unlocks based on sidegrades
- [ ] Add challenge levels
- [ ] Add achievements and collections
- [ ] Add daily seeded challenge
- [ ] Add localization framework
- [ ] Add full accessibility settings
- [ ] Add Steam Cloud, achievements, input, and Deck support
- [ ] Add analytics with privacy-respecting opt-out
- [ ] Build store assets, trailer capture workflow, demo, and press kit

### P3 — Expand platforms

- [ ] Complete production-engine migration
- [ ] Validate save, suspend/resume, user switching, and controller disconnect behavior
- [ ] Register with platform holders
- [ ] Obtain devkits
- [ ] Perform certification gap analysis under NDA
- [ ] Optimize for console memory, safe areas, text size, and storage
- [ ] Complete ratings and localization
- [ ] Plan mobile UI and touch adaptation after PC balance stabilizes

## What Should Be Removed

- mandatory account creation for single-player
- custodial wallets
- NFT equipment as a gameplay dependency
- paid-currency revival
- duplicate combat managers
- duplicate room-routing implementations
- generic SaaS dashboard patterns inside gameplay
- unsupported content-count claims
- “play to earn” positioning
- unused starter assets
- broad client-controlled character update endpoint
- complexity that exists only to support blockchain ownership

## What Should Be Preserved

- the dark fantasy “Crypt of Greed” name and theme
- three fighting-style concepts
- readable enemy intent as a design goal
- turn-based card combat
- room-based progression
- gold, shops, rest sites, events, elites, and bosses
- responsive presentation knowledge from the prototype
- existing card and enemy concepts as design references, not production architecture
- simple data-driven content definitions

## Definition of Audit Completion

This audit phase is complete when:

- all nine source-of-truth documents exist
- the product identity is explicit
- commercial blockers are documented
- Steam and console requirements are separated from prototype assumptions
- the roadmap is ordered by player value and dependency
- no major gameplay implementation is started before review of the roadmap

## Research References

- Steamworks onboarding rules: https://partner.steamgames.com/doc/gettingstarted/onboarding
- Steam Deck compatibility: https://partner.steamgames.com/doc/steamhardware/compat
- Steam Input developer guide: https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_devs
- Xbox Accessibility Guidelines: https://learn.microsoft.com/en-us/xbox/accessibility/guidelines
- Nintendo developer process: https://developer.nintendo.com/the-process
- Unity console development: https://unity.com/solutions/console
- Godot console support: https://docs.godotengine.org/en/4.4/tutorials/platform/consoles.html
