# Crypt of Greed — Game Design Document

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.

## One-Sentence Pitch

**Crypt of Greed is a fast, turn-based deckbuilding roguelite where every treasure makes the next room richer and more dangerous, forcing the player to decide when to bank their haul and when greed is worth the risk.**

## Product Identity

### Genre

- premium single-player deckbuilding roguelite
- turn-based tactical combat
- push-your-luck economy
- dark-fantasy dungeon crawl
- optional seeded challenges and leaderboards

### Target audience

Primary:

- players who enjoy Slay the Spire, Balatro, Luck Be A Landlord, Backpack Hero, and Peglin
- players who want short tactical sessions and high replayability
- PC and handheld players who value readable systems and build experimentation

Secondary:

- players who enjoy the escalation and unlock cadence of Vampire Survivors
- players attracted by dark fantasy, expressive characters, and “one more run” progression
- strategy players who prefer low mechanical execution requirements

### Player fantasy

The player is a treasure hunter descending into a living crypt that feeds on desire. The crypt offers increasingly unfair bargains. The player becomes powerful by exploiting its economy without becoming trapped by it.

The fantasy is not “own an NFT.” It is:

- discover a broken combination
- read the enemy correctly
- accept a dangerous bargain
- carry a fortune one room farther
- escape at the last possible moment
- unlock a new possibility for the next run

### Unique selling proposition

Most deckbuilding roguelites ask, “Which route and card should I take?”

Crypt of Greed adds a persistent question:

> **Do I bank what I have now, or increase my Greed to multiply future rewards while making the run more dangerous?**

This choice must affect combat, routes, events, shops, audiovisual feedback, and the ending. It cannot be a passive score multiplier.

## Design Pillars

### 1. Greed is a meaningful choice

Greed increases potential reward and immediate power, but also:

- adds enemy affixes
- strengthens boss phases
- alters event outcomes
- increases shop prices or changes stock
- introduces curse cards
- reduces safe extraction opportunities
- changes the ending and score

The player always knows the current risk and expected benefit.

### 2. Combat is readable before it is difficult

The player should lose because of a decision, not hidden rules.

- enemy intent is explicit
- damage previews include modifiers
- card keywords have tooltips
- status durations are visible
- target and outcome previews update before confirmation
- unavoidable damage is rare and clearly telegraphed

### 3. Builds become delightfully unfair

The game should allow strong combinations, but each build must have a weakness.

Examples:

- block converted into damage, vulnerable to block removal
- repeated low-cost attacks, vulnerable to thorns
- curse consumption, vulnerable to hand clog
- delayed spell detonation, vulnerable to fast enemies
- gold-spending attacks, powerful but undermining extraction value

### 4. Runs respect the player's time

- tutorial action begins within 30 seconds
- first meaningful reward within 3 minutes
- failed early run returns to play in under 15 seconds
- full successful run target: 25–35 minutes
- suspend and resume after every resolved node
- no forced account login
- no unskippable repeated dialogue
- no grind required to make the base combat enjoyable

### 5. Progression expands choice

Permanent progression unlocks:

- cards
- relics
- classes
- events
- challenge modifiers
- cosmetic presentation
- lore entries

It should not primarily provide permanent raw damage or health. Skill and build knowledge remain relevant.

## Core Loop

1. Choose a delver and starting loadout.
2. Enter the crypt with a small deck and zero Greed.
3. Choose between two or three visible room options.
4. Resolve combat, event, shop, shrine, or extraction.
5. Take one reward and optionally reject or transform it.
6. Decide whether to bank unbanked treasure.
7. Increase Greed by carrying treasure deeper or accepting bargains.
8. Defeat the act boss or extract.
9. Convert banked treasure and milestones into unlock progress.
10. Review run summary, discoveries, and the next visible goal.
11. Start again with new options.

## The Greed System

### Resources

#### Gold

Run-only currency used in shops, bribes, rerolls, and some cards.

#### Hoard

Unbanked value collected during the run. Hoard contributes to score and unlock progress only if banked or extracted.

#### Seals

Permanent, non-purchasable progression currency earned from banked Hoard, first-time milestones, challenges, and achievements.

#### Greed

A run-level risk tier from 0 to 5.

### Increasing Greed

Greed rises when the player:

- skips an extraction altar while holding Hoard
- accepts a cursed bargain
- steals from an elite vault
- takes a premium reward instead of a safe reward
- uses certain gold-consuming cards
- rerolls a room path beyond the free allowance

### Greed benefits

- Hoard multiplier
- improved card rarity odds
- stronger relic offers
- bonus room choice
- increased elite reward
- special “corrupted” card variants
- higher final score

### Greed dangers

- enemy affixes
- more complex intents
- curses added to reward pools or deck
- reduced healing
- expensive shops
- locked room options
- boss phase changes
- loss of unbanked Hoard on death

### Banking

Extraction altars appear at known checkpoints and occasionally through rare events.

At an altar, the player can:

- **Bank:** secure current Hoard, reduce Greed by one, continue
- **Extract:** end the run and secure all banked and current Hoard
- **Defy:** gain one Greed and receive a premium reward

Banking must never be a trivial always-correct answer. Some unlocks and endings require deeper Greed, while reliable progression favors banking.

## Run Structure

### Launch scope

- 3 acts
- 6–8 resolved nodes per act
- 1 boss per act
- optional final vault for high-Greed runs
- 25–35 minute successful run
- 8–15 minute typical failed run

### Room types

#### Battle

Standard tactical encounter with one or more enemy roles.

#### Elite

Hard encounter with a unique rule and premium reward.

#### Shop

Buy cards, relics, services, and information. Stock is generated from a deterministic seed and removed after purchase.

#### Rest site

Choose one:

- heal
- upgrade a card
- remove a basic card at a health cost
- scout upcoming rooms
- reduce Greed with a sacrifice

Only two or three options appear at a time to preserve identity and replayability.

#### Event

Narrative choice with explicit or discoverable tradeoffs. Events change resources, cards, relics, Greed, route, or enemy state.

#### Shrine

Specialized deck transformation or bargain.

#### Extraction altar

Bank, extract, or defy.

#### Boss

Multi-phase test of the act's lessons, not simply a health sponge.

## Combat System

### Turn flow

1. Start-of-turn effects resolve.
2. Player draws to hand size.
3. Enemy intents are visible.
4. Player spends energy to play cards.
5. Player ends turn.
6. End-of-player-turn effects resolve.
7. Enemy actions resolve in a displayed order.
8. End-of-round effects resolve.
9. Next turn begins.

The engine emits an ordered event log. Presentation may animate events, but animation cannot change rules.

### Baseline values

- 3 energy
- draw 5
- hand limit 10
- block normally expires at start of next player turn
- card reward: choose 1 of 3 or skip
- deck removal is scarce and valuable

### Card families

#### Attack

Direct damage, multi-hit, execute, retaliation, gold-powered attacks.

#### Skill

Block, draw, movement in initiative, debuff, cleanse, resource conversion.

#### Power

Persistent rule changes for the current combat.

#### Bargain

High-impact card with a Greed, curse, Hoard, or delayed cost.

#### Curse

Usually harmful, but some builds consume or exploit curses.

### Keyword principles

- no keyword exists for only one card unless it is a named signature mechanic
- keywords are short and composable
- every keyword has a controller-accessible tooltip
- card text describes final values after upgrades
- color is never the only signal

## Playable Delvers

Build and balance one complete delver before producing all three.

### The Ironbound

Fantasy: survive impossible hits, turn defense into punishment.

Mechanics:

- Guard: retain a portion of block
- Riposte: deal damage after blocking
- Burden: powerful armor cards that add weight or reduce draw

Builds:

- fortress
- retaliation
- self-damage armor

### The Trickshot

Fantasy: prepare targets, chain precise attacks, spend fewer cards for larger turns.

Mechanics:

- Mark
- Echo Shot
- Ammo
- discard manipulation

Builds:

- many small hits
- critical single shots
- discard engine

### The Hexbinder

Fantasy: accept curses, delay consequences, consume corruption for power.

Mechanics:

- Hex
- Doom countdown
- curse consumption
- health-for-energy bargains

Builds:

- curse engine
- delayed burst
- life conversion

## Enemies

Enemy design uses roles and pattern grammar rather than isolated stat blocks.

### Roles

- attacker
- defender
- scaler
- disruptor
- summoner
- punisher
- support
- greed hunter

### Pattern requirements

Each enemy must have:

- a readable role
- at least two possible intents
- one interaction that changes player priorities
- an audiovisual tell
- a counterplay window
- Greed-tier variants when appropriate

### Boss philosophy

A boss should test a learned concept:

- Act 1: sequencing and defense
- Act 2: deck consistency and target priority
- Act 3: Greed management and resource conversion

Bosses cannot rely on hidden immunity or unavoidable one-turn kills.

## Rewards

### Card rewards

- 3 offers
- skip always available
- one free inspect/compare
- rarity weighted by act, Greed, and unlock pool
- no duplicate offer unless explicitly caused by a modifier

### Relics

Relics alter rules and encourage builds. Relics should be comprehensible in one sentence and create a visible feedback event when triggered.

### Treasure

Treasure increases Hoard and may carry a passive benefit while unbanked, creating a temptation to keep it at risk.

### Reward pacing

Every room should provide at least one of:

- power
- information
- safety
- route control
- progress
- story discovery

A room that only consumes time should be removed.

## Permanent Progression

### Unlock philosophy

Unlocks are sidegrades and new possibilities.

Avoid:

- permanent +50% damage trees
- compulsory daily login rewards
- time-gated crafting
- paid revive currency
- randomized paid rewards
- limited-time power

### Unlock tracks

- delver mastery
- card discovery
- relic collection
- enemy codex
- Greed endings
- challenge seals
- achievements
- cosmetics

### Visible goals

After every run, show no more than three relevant next goals:

- one near-term unlock
- one mastery goal
- one discovery hint

## Difficulty and Endgame

### Base difficulty

Designed to be winnable by a learning player after several runs without permanent stat grinding.

### Depth levels

After the first clear, unlock escalating modifiers:

- stronger enemy patterns
- reduced healing
- altered shops
- added Greed rules
- boss phases
- more demanding route decisions

Each level is fixed and documented. Avoid arbitrary percentage inflation without a new decision.

### Custom mode

Players can enable discovered modifiers, seeded runs, and accessibility assists. Custom runs may have separate leaderboard eligibility but still grant non-competitive achievements where reasonable.

### Daily challenge

- same seed and modifiers for all players
- offline play allowed
- submission when online
- score breakdown visible
- no exclusive power reward
- archive recent daily seeds for practice

## First-Time Experience

### First 30 seconds

- title screen
- “Begin Descent” is the default focus
- optional settings and accessibility available before play
- no account requirement
- first combat begins after one short choice

### Guided first combat

- one attack card highlighted
- damage preview shown
- enemy intent explained
- player plays defense
- end turn
- reward choice introduced

The tutorial should teach through required meaningful actions, not a sequence of text pages.

### First 10 minutes

The player experiences:

- two combats
- one reward
- one non-combat choice
- one Greed decision
- one visible unlock goal
- either an early boss preview or mini-elite

## Narrative

### Premise

The Crypt is a sentient treasury created by a fallen kingdom. It rewards desire because every accepted bargain gives it more control over the delver.

### Tone

- dark fantasy
- dry humor
- concise character writing
- unsettling bargains
- no generic lore dumps

### Delivery

- event vignettes
- boss introductions
- relic descriptions
- run summaries
- codex discoveries
- ending variations based on Greed and extraction history

Narrative must not interrupt repeat runs. Previously seen text can be accelerated or skipped.

## Session and Retention Model

### Session lengths

- micro-session: 5–10 minutes to complete several nodes
- normal failed run: 8–15 minutes
- successful run: 25–35 minutes
- daily challenge: 20–30 minutes

### Retention drivers

- visible mastery
- new build possibilities
- close-call banking decisions
- deterministic challenges
- collection completion
- escalating Depth levels
- rare event discovery
- strong run summary
- social sharing of seeds and builds

No retention system should rely on anxiety, expiring rewards, or daily punishment.

## Content Targets

### Vertical slice

- 1 delver
- 36 cards
- 12 relics
- 8 enemies
- 2 elites
- 1 boss
- 8 events
- 1 act
- 3 Greed tiers
- 1 tutorial
- 6 achievements

### Early Access candidate

- 2 delvers
- 90–120 cards
- 35 relics
- 24 enemies
- 6 elites
- 3 bosses
- 30 events
- 3 acts
- 10 Depth levels
- daily challenge
- 30–40 achievements

### Version 1.0 target

- 3 delvers
- 150–180 carefully differentiated cards
- 60 relics
- 36–45 enemies
- 9 elites
- 6 bosses including alternates/final variants
- 50 events
- 20 Depth levels
- complete codex and endings
- localization and full platform feature set

These are planning targets, not marketing claims. Quality gates can reduce counts.

## Anti-Goals

Crypt of Greed is not:

- a play-to-earn product
- a live-service economy
- a multiplayer-first game
- a collectible card pack marketplace
- an idle game
- a content quantity contest
- a story-heavy RPG with long mandatory dialogue
- a permanent-stat grind
- a clone of Slay the Spire

## Success Metrics

### Prototype

- 80% of playtesters understand enemy intent without explanation after two turns
- 70% can explain the Greed tradeoff after one run
- 60% voluntarily start a second run
- first meaningful choice in under 3 minutes
- no top-five issue caused by unclear UI

### Demo

- median session above 20 minutes
- at least 30% of qualified players complete two runs
- strong qualitative recall of the Greed mechanic
- crash-free session rate above 99.5%
- controller completion parity with mouse
- save recovery succeeds in fault-injection tests

## Competitive Lessons

- **Vampire Survivors:** simple input, constant reward cadence, explosive power growth, visible unlock chains.
- **Balatro:** familiar base rules transformed by rule-breaking modifiers; shop decisions are as important as rounds.
- **Brotato:** fast build expression, but avoid false choices and controller/menu friction.
- **Luck Be A Landlord:** short runs and readable synergy; avoid sameness and thin long-term progression.
- **Slay the Spire:** enemy intent creates informed tactics; every card is not automatically a reward.
- **Peglin:** tactile resolution and novelty; avoid narrow viable pools and content-light repetition.
- **Hades:** narrative makes failure feel like progress; repeated play needs fast re-entry.
- **Dead Cells:** responsive feel and difficulty customization; avoid hiding essential knowledge.
- **Dave the Diver:** alternating loops can refresh pacing, but adding too many systems weakens identity.
- **Dome Keeper:** a strong risk/resource loop needs sufficient variation, onboarding, and reliable saves.
- **Enter the Gungeon:** strong weapon discovery and mastery; avoid overwhelming visual noise and punishing onboarding.
- **Loop Hero:** “one more loop” risk escalation; avoid slow starts and grind.
- **Cult of the Lamb:** strong theme and hybrid appeal; avoid shallow secondary systems and chore pressure.
- **Backpack Hero:** spatial build expression; save stability and balance are foundational trust requirements.

## Research References

- Balatro official FAQ: https://www.playbalatro.com/faq
- Balatro Steam page: https://store.steampowered.com/app/2379780/Balatro/
- Vampire Survivors Steam page: https://store.steampowered.com/app/1794680/Vampire_Survivors/
- Luck Be A Landlord Steam page: https://store.steampowered.com/app/1404850/Luck_be_a_Landlord/
- Slay the Spire interface design: https://arstechnica.com/video/watch/war-stories-slay-the-spire-war-stories
- Slay the Spire data balancing: https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder
- Xbox Accessibility Guidelines: https://learn.microsoft.com/en-us/xbox/accessibility/guidelines
