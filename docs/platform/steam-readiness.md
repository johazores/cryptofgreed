# Crypt of Greed — Steam Readiness

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.


## Current Status

**Not ready for Steam submission.**

Primary blockers:

- blockchain/NFT issuance positioning
- mandatory web account flow
- browser/SaaS architecture
- no native desktop build
- no controller input layer
- no Steam Input integration
- no save/cloud strategy
- no achievements integration
- no audio/settings/accessibility suite
- no tested offline mode
- inaccurate store-style claims
- no complete commercial gameplay loop

## Store Eligibility Decision

Steam's current onboarding rules list applications built on blockchain technology that issue or allow exchange of cryptocurrency or NFTs among content that should not be published.

Therefore the Steam build must:

- issue no NFTs
- exchange no NFTs
- issue no cryptocurrency
- exchange no cryptocurrency
- require no wallet
- create no custodial wallet
- contain no play-to-earn functionality
- use ordinary local/platform entitlements for DLC and cosmetics

Rename or remove web3 metadata before creating a Steam store page.

## Recommended Steam Product

- native premium single-player game
- Windows at minimum
- Steam Deck target
- Linux/Proton validation
- optional macOS based on measured demand and support capacity
- no launcher
- no third-party account required
- offline-first
- Steam account used only for platform services
- optional online daily challenge

## Steamworks Features

### Required for target quality

- Steam Input or robust native controller support
- Steam Cloud
- Steam Achievements
- supported language metadata
- controller glyph switching
- Steam Deck compatibility validation
- overlay-safe behavior
- clean install/update/uninstall behavior
- crash reporting
- depots and branches
- build version display

### Recommended

- rich presence
- leaderboards for daily challenge
- remote play compatibility review
- trading cards only after stable launch and eligibility
- Workshop after mod system is mature
- soundtrack app
- demo app with compatible saves where appropriate

## Steam Deck Checklist

Valve's compatibility guidance requires or strongly expects:

- all content accessible with default physical controls
- controller enabled without changing settings
- matching controller glyphs
- automatic on-screen keyboard for text input
- readable text at Deck resolution
- default playable performance
- no unsupported-device warnings
- no mouse/keyboard-only launcher
- clouded saves for moving between Deck and PC

Internal target:

- 1280×800 validation
- 60 FPS target
- 30 FPS hard floor
- 16:10 layout without clipping
- UI scale default suitable for handheld
- suspend/resume safe
- touch optional
- no required internet after installation
- battery-friendly quality preset

## Build and Depot Plan

### Applications

- base game
- demo
- soundtrack
- DLC packages as needed

### Branches

- default/public
- internal
- playtest
- release-candidate
- previous-stable rollback branch

Do not create expensive automated CI in the current project phase. Builds can be manual and documented until production stability justifies automation.

### Versioning

Use semantic product version plus build number:

`1.0.0+steam.1234`

Show:

- version
- content version
- save schema
- run seed

in diagnostics.

## Save and Cloud

### Local save

- atomic
- versioned
- backup
- corruption recovery
- per-platform user path
- no secrets
- active run separate from profile
- deterministic content version

### Steam Cloud

Test:

- PC to Deck
- Deck to PC
- offline changes
- conflicting timestamps
- reinstall
- multiple machines
- beta branch save compatibility
- DLC removed
- old version rollback

Never silently resolve a destructive conflict.

## Achievements

Achievement design should cover:

- onboarding
- first clear
- class mastery
- Greed milestones
- build expression
- challenge levels
- discoveries
- special endings

Guidelines:

- 30–50 at 1.0
- localized names/descriptions
- offline unlock queue
- idempotent synchronization
- no unobtainable seasonal achievements
- no excessive grind
- developer reset/testing process

Global achievement statistics can also reveal where progression or difficulty is failing.

## Input

Steam Input quality target:

- action-based bindings
- correct device glyphs
- simultaneous mouse/keyboard/controller
- official default configuration
- menu action set
- gameplay action set
- no forced controller type
- full remapping
- text entry integration
- reconnect handling
- controller order handling

## Store Page

Do not publish a Coming Soon page until the identity and visual direction are stable.

Required truthful assets:

- capsule art
- screenshots showing actual gameplay
- short description centered on Greed
- trailer with first 5–10 seconds of gameplay
- feature list
- accessibility summary
- system requirements
- languages
- controller support
- demo
- privacy disclosure for telemetry/online features

Suggested short description:

> Build a ruthless deck, bargain with a living crypt, and decide when to bank your treasure before Greed takes everything.

Avoid:

- “1,000+ cards” before verified
- “infinite builds”
- “50+ bosses” before verified
- NFT/web3/play-to-earn terms
- pre-rendered visuals that imply unimplemented gameplay

## Demo Strategy

The demo should contain:

- tutorial
- one complete act
- one delver
- several build paths
- Greed and banking
- one boss
- run summary
- settings/accessibility
- save/resume
- clear wishlist call to action

Target 30–60 minutes of meaningful replayable content, not a one-time 10-minute tutorial.

Demo save migration into the full game is optional. If supported, only profile unlocks should migrate unless run content is identical.

## Localization

Before store launch:

- externalize all strings
- decide launch languages from market data
- localize store page and achievements
- verify CJK fonts
- verify controller glyph wording
- test text expansion
- document partial/full language support accurately

Steam supports localized achievement data and store content. Do not claim a language until the in-game scope matches the store checkbox.

## Accessibility Disclosure

Publish an accessible feature list covering:

- remapping
- controller support
- UI/text scale
- color modes
- reduced motion
- screen shake
- hit flash
- vibration
- pause
- difficulty assists
- audio controls
- captions if applicable

## QA Matrix

### Systems

- Windows 10/11
- Steam Deck
- Proton
- common aspect ratios
- integrated graphics minimum target
- controller families
- mouse/keyboard
- offline mode
- cloud conflict
- overlay
- achievement sync
- low storage
- interrupted update

### Run integrity

- save at every node type
- power loss during save
- app termination
- suspend/resume
- update mid-run
- DLC change mid-run
- localization switch
- controller disconnect

## Release Gates

### Store page gate

- USP validated
- visual identity approved
- truthful screenshots
- blockchain removed
- native build path confirmed

### Demo gate

- one complete act
- save reliability
- controller parity
- Deck readability
- tutorial
- crash-free target
- no P0 combat defects

### Early Access gate

- complete satisfying loop
- public roadmap
- migration policy
- feedback process
- regular update capacity

### 1.0 gate

- three-act target or equivalent complete scope
- content balance
- achievements
- localization
- cloud saves
- accessibility
- Deck review submission
- performance budgets
- no known save-loss defect
- legal/license review
- stable rollback build

## Research References

- Steam onboarding: https://partner.steamgames.com/doc/gettingstarted/onboarding
- Steam Deck compatibility: https://partner.steamgames.com/doc/steamhardware/compat
- Steam Deck recommendations: https://partner.steamgames.com/doc/steamdeck/recommendations
- Steam Input developer guide: https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_devs
- Steam achievements: https://partner.steamgames.com/doc/features/achievements
- Steam localization: https://partner.steamgames.com/doc/store/localization
