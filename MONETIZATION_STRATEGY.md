# Crypt of Greed — Monetization Strategy

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.


## Principles

Crypt of Greed should monetize as a premium game.

The model must:

- sell a complete, enjoyable base game
- avoid pay-to-win
- avoid paid revives
- avoid randomized paid rewards
- avoid cryptocurrency and NFT speculation
- avoid daily pressure and FOMO
- keep balance updates and accessibility improvements free
- make DLC value obvious
- preserve offline play

## Recommended Product Model

### Base game

Target list price after content validation:

- **$12.99–$14.99** for a focused, polished deckbuilding roguelite
- consider **$9.99–$12.99** if launching with materially less than the 1.0 content targets
- launch discount: 10%
- demo: free and permanently available

Do not finalize price until:

- full-run length is measured
- content count is audited
- replayability is proven
- competitor pricing is checked near launch
- wishlist conversion testing is available

Balatro's current standard price demonstrates that a tightly designed premium card roguelite can support a $14.99 position. Vampire Survivors demonstrates a different strategy: unusually low price paired with broad replay value and paid expansions. Crypt of Greed should not copy the low-price model unless scope and production costs support it.

### Early Access

Use Early Access only if:

- the first complete act is already fun
- saves are reliable
- the content roadmap is credible
- weekly or biweekly public communication is sustainable
- major rule changes can be migrated safely

Do not use Early Access to discover the core identity. Validate Greed before launch.

Potential Early Access price:

- $9.99–$12.99
- announce that price may rise at 1.0
- do not discount immediately after supporters purchase

## DLC Strategy

### Expansion packs

Best fit.

Each expansion should include a coherent package:

- new delver
- new act or alternate route
- new cards and relics
- new bosses/events
- new Greed interaction
- free compatibility/balance update for all players

Target range:

- $4.99–$7.99 for a substantial mechanical expansion
- $9.99 only for a major content expansion with a new act and class

### Soundtrack

- $4.99–$9.99 depending on track count and production
- lossless and common formats
- included separately or in a soundtrack bundle

### Supporter pack

Optional cosmetic-only pack:

- alternate card backs
- portrait frames
- UI theme
- digital artbook
- soundtrack discount
- supporter badge in local profile

Target:

- $3.99–$5.99

No gameplay stats, cards, relics, currency, or unlock speed.

### Cosmetic content

Cosmetics are acceptable when:

- sold directly
- previewed clearly
- not randomized
- not time-limited
- do not reduce visual readability
- do not fragment core art quality

For a small team, cosmetic production may cost more than it earns. Prioritize expansions and soundtrack.

## Seasonal Content

Do not operate a battle pass.

Use occasional free themed challenges or community seeds:

- anniversary challenge
- Halloween visual modifier
- community-designed daily seed
- charity event

Archive gameplay content after the event. Avoid permanently missable achievements.

## Community Events

Possible low-cost events:

- seed of the week
- highest-Hoard challenge
- “bank early” versus “never bank” community split
- class mastery weekend
- developer run commentary
- card/relic design vote with final design control retained by the team

Rewards should be:

- profile cosmetics
- concept art
- community recognition
- unlocked lore

No tradable value.

## Mod Support

Mod support is desirable after 1.0 if the production architecture allows it.

Initial scope:

- custom cards
- relics
- encounters
- localization
- challenge modifiers

Requirements:

- versioned mod API
- safe data validation
- separate modded save/profile
- disable official leaderboard submission
- clear crash attribution
- no arbitrary native code in simple content mods
- Steam Workshop only after local mod loading is stable

Mod support should not delay core release.

## Bundles and Promotions

Recommended:

- base + soundtrack
- base + first expansion
- franchise/genre bundles when eligible
- 10% launch discount
- measured seasonal discounts after launch
- avoid deep discounting too early

Price integrity matters for supporter trust.

## No Blockchain Monetization

Do not monetize through:

- NFTs
- token sales
- tradable items
- gas fees
- staking
- speculative scarcity
- player marketplace fees

Reasons:

- conflicts with Steam's current distribution rules for blockchain apps that issue or exchange crypto/NFTs
- adds legal, custody, security, tax, and platform risk
- requires online infrastructure
- damages the premium offline value proposition
- shifts design incentives from fun to financial extraction
- complicates console approval

The “Greed” theme should critique and dramatize risky value decisions inside the fiction, not reproduce them in the player's wallet.

## Revenue Roadmap

### Pre-launch

- free demo
- wishlists
- playtests
- no founder token
- no paid closed alpha
- optional soundtrack preview

### Launch

- complete premium game
- 10% discount
- soundtrack
- supporter bundle
- no day-one gameplay DLC carved from base content

### 3–6 months

- free QoL and balance updates
- community challenge support
- first expansion announcement only after retention and sentiment review

### 6–12 months

- first paid expansion
- workshop/mod beta if feasible
- console editions when quality gates are met

## Player Trust Rules

- publish exact DLC contents
- publish save compatibility notes
- never sell power
- do not nerf base-game content to make DLC attractive
- accessibility fixes are always free
- bug fixes are always free
- paid expansion cards can interact with base systems without making base builds obsolete
- no forced online connection
- no account requirement for purchased single-player content

## Commercial Metrics

Track:

- demo downloads to wishlists
- demo completion
- second-run rate
- wishlist conversion
- refund reasons
- review sentiment
- median playtime
- completion and Depth participation
- DLC attach rate
- crash-free sessions
- controller and Deck usage
- localization performance

Do not optimize solely for hours played. A satisfying 25-hour premium experience can be commercially healthy.

## Research References

- Balatro Steam page: https://store.steampowered.com/app/2379780/Balatro/
- Vampire Survivors Steam page: https://store.steampowered.com/app/1794680/Vampire_Survivors/
- Luck Be A Landlord Steam page: https://store.steampowered.com/app/1404850/Luck_be_a_Landlord/
- Cult of the Lamb Steam DLC structure: https://store.steampowered.com/app/1313140/Cult_of_the_Lamb/
- Steam onboarding rules: https://partner.steamgames.com/doc/gettingstarted/onboarding
