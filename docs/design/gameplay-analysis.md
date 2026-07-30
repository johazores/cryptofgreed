# Crypt of Greed — Gameplay Analysis

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.


## Current Loop

The current implemented loop is approximately:

1. register or log in
2. create/select a persistent character
3. enter a battle with a regenerated starter deck
4. fight one enemy
5. receive random gold and experience
6. choose between two random room types
7. visit battle, rest, shop, or event
8. update persistent character values through API calls
9. revive a dead character with crystals

This loop is not yet a roguelike run. It is a sequence of loosely connected pages around a persistent character.

## Core Gameplay Problems

### No run identity

There is no persistent run seed, route history, reward history, deck history, or run checkpoint. The floor counter is stored on the character, but battle initialization can start from floor one and rooms reconstruct transient state.

### No deckbuilding

The starter deck is rebuilt. There is no complete system for:

- card rewards
- card skipping
- card removal
- card upgrades
- card rarity
- deck inspection
- transformations
- class card pools
- run persistence

### Low decision density

The player can generally:

- play a card on the first enemy
- end turn
- heal or skip
- purchase generic equipment
- select one of two room labels
- choose event flavor text with no effect

The number of screens is higher than the number of meaningful decisions.

### No strategic enemy variety

Enemy intent types exist, but current enemies mostly use fixed attacks. There are no patterns that ask the player to change sequencing, target priority, deck construction, or resource management.

### Progression is mostly numerical

Gold, experience, level, max health, kills, floor, and crystals exist. These values do not currently unlock a rich set of strategic options.

### Death is confused

Death is simultaneously:

- a roguelike failure
- persistent character death
- an NFT burn event
- a crystal revival purchase
- a reversible general character update

These goals conflict.

## Recommended Core Loop

### Moment-to-moment

- read enemy intents
- inspect hand
- sequence cards
- preview outcomes
- decide whether to spend scarce resources
- execute
- react to changed state

### Encounter-to-encounter

- choose a route
- shape the deck
- acquire relics
- manage health
- spend gold
- accept or reject bargains
- manage Greed
- decide whether to bank or extract

### Run-to-run

- unlock sidegrades
- learn enemy patterns
- discover build families
- complete challenges
- raise Depth difficulty
- pursue endings
- compare seeded scores

## First-Time Experience Analysis

### Current

- account friction precedes play
- no tutorial
- character creation occurs before the player understands classes
- NFT/wallet concepts appear before the core game proves fun
- basic combat feedback is limited
- the player cannot evaluate long-term consequences

### Target

- playable within 30 seconds
- optional “recommended first delver”
- first combat teaches attack and intent
- second turn teaches block
- first reward teaches that skipping is valid
- first Greed decision appears within 10 minutes
- first run summary shows learning and one next goal

## Early Game

### Purpose

Teach the system while allowing an early build direction.

### Requirements

- enemies use one clear concept each
- starter deck has obvious weaknesses
- early rewards solve immediate problems
- no reward choice is a hidden trap
- the player sees at least two build signals
- first elite is optional
- first Greed increase is reversible through a known altar

### Failure mode to avoid

A new player should not lose because an early card looked strong but silently made later content unwinnable. Advanced tradeoffs can emerge later, but early choices need legible consequences.

## Mid Game

### Purpose

Make the player commit while preserving adaptation.

### Requirements

- mixed enemy groups
- status interactions
- competing route values
- deck consistency pressure
- Greed affixes
- shops with removal/upgrade decisions
- relics that transform priorities
- events that respond to current build or Greed

### Meaningful tension

The player should ask:

- Do I solve my current weakness or deepen my strongest synergy?
- Do I spend gold now or preserve Hoard?
- Do I take an elite for a relic?
- Do I bank and lose multiplier momentum?
- Can this deck survive the known boss pattern?

## Late Game

### Purpose

Test the build's identity, not merely its damage.

### Requirements

- enemy groups punish one-dimensional decks
- bosses have readable multi-phase rules
- high Greed changes mechanics
- card draw and consistency matter
- resource preservation matters
- extraction is still a valid ending
- final rewards are not useful only after the run is effectively over

### Failure mode to avoid

Do not introduce hard counters that invalidate a build without prior warning or alternate path.

## End Game

### Initial endgame

- Depth levels with fixed modifiers
- alternate boss phases
- class mastery challenges
- high-Greed endings
- daily seeded runs
- collection completion

### Long-term replayability

Replayability should come from interaction density, not only content quantity.

A smaller pool with strong cross-system interactions is better than hundreds of near-identical cards.

## System Recommendations

### Achievements

Use achievements to teach, celebrate, and reveal possibilities.

Categories:

- first milestones
- build expression
- Greed decisions
- mastery
- challenge clears
- discoveries
- accessibility-neutral completion

Avoid achievements requiring excessive repetitive grind or unavailable seasonal content.

### Unlockables

Unlock:

- cards
- relics
- delvers
- events
- modifiers
- cosmetics
- lore

Show unlock conditions or clear hints. Hidden unlocks should be delightful exceptions, not the majority.

### Upgrades

Run upgrades:

- card upgrades
- relic interactions
- temporary blessings
- treasure effects

Permanent upgrades:

- expand option pools
- unlock sidegrades
- unlock starting loadout alternatives

Avoid permanent damage trees that make early runs intentionally dull.

### Daily challenges

Add only after deterministic seeded runs and stable saves exist.

- one run per official score attempt
- practice mode available
- no exclusive power
- transparent scoring
- replay archive
- offline completion queues submission
- anti-cheat scope proportional to reward

### Quests and missions

Do not add a generic quest log.

Use “Contracts” as optional run modifiers:

- begin with a curse
- defeat an elite at Greed III
- extract with a specific treasure
- win without resting
- use a named build mechanic

Contracts grant cosmetics, Seals, or discovery progress.

### Collectibles

The codex tracks:

- cards
- relics
- enemies
- events
- treasures
- endings
- encountered Greed affixes

Collectibles should contain useful mechanical information after discovery.

### Combo mechanics

Combos emerge from rule interactions, not a universal combo meter.

Examples:

- Mark + multi-hit
- block retention + retaliation
- curse draw + curse consumption
- gold gain + gold-spend attack
- Doom + turn acceleration
- discarded card + Echo return

### Risk versus reward

The Greed system is the main risk-reward layer.

Other risks should reinforce it rather than create many unrelated meters:

- elites
- cursed bargains
- uncertain event outcomes
- health-for-power
- gold-for-Hoard conversion
- route scouting

### Randomness

Randomness creates problems; player tools create agency.

Required controls:

- seeded RNG
- visible odds where practical
- offer diversity rules
- duplicate protection
- rerolls with real cost
- route preview
- enemy pattern constraints
- pity or protection only where it preserves variety, not guaranteed wins

### Difficulty scaling

Scale through:

- new behavior
- new sequencing pressure
- altered resource rules
- more demanding combinations
- Greed affixes
- boss phase changes

Use health/damage increases sparingly.

### Bosses

Bosses require:

- one signature mechanic
- readable phase transition
- multiple viable responses
- build check plus tactical decisions
- no long invulnerability phase
- no hidden instant-kill threshold
- fast retry

### Events

Each event option must change game state.

Event design template:

- premise
- 2–3 options
- explicit cost where known
- deterministic or bounded outcome
- build/Greed-aware branch
- one memorable line
- no auto-continue timer
- log result

### Player choices

A choice is meaningful when:

- options differ in kind, not only amount
- consequences matter later
- the player can understand enough to form intent
- no option dominates in nearly all states
- the result changes behavior

## Economy Analysis

### Remove crystals as revive currency

The current crystal revive resembles a monetizable loss-avoidance system even if no purchase flow exists. It undermines roguelike stakes and creates economy ambiguity.

### Recommended currencies

- Gold: run spending
- Hoard: at-risk run value
- Seals: permanent earned unlock currency
- optional cosmetic-only platform DLC entitlement

No currency is sold in packs.

### Inflation controls

- run gold disappears after the run
- Hoard is converted through banking
- Seals have finite unlock sinks plus cosmetic prestige sinks
- no infinite random loot boxes
- no player marketplace

## Retention Analysis

### Healthy retention

- mastery
- discovery
- visible progress
- expressive builds
- fair failure
- short re-entry
- social seed sharing
- meaningful difficulty levels

### Unhealthy retention to avoid

- daily login loss
- expiring rewards
- paid resurrection
- stamina
- FOMO seasons
- opaque drop rates
- power-selling DLC
- endless stat grind
- blockchain speculation

## Research Synthesis

### What successful games repeatedly do

- create a short, legible core loop
- make rewards frequent but choices constrained
- allow dramatic power growth
- keep losses quick to restart
- expose long-term discovery goals
- let rules interact in surprising ways
- use strong audiovisual feedback
- support controller and handheld play
- add content that changes decisions

### Repeated player complaints

- excessive RNG with little recovery
- false choices
- grind replacing depth
- samey content
- weak save reliability
- controller/menu friction
- poor readability
- too many unrelated systems
- slow starts
- unclear tooltips
- content bloat
- shallow combat hidden by strong art

## Comparative Product Research Matrix

The following review combines official store descriptions, current Steam review themes, community discussions, and design-analysis videos/articles. Community comments are qualitative signals, not statistically representative surveys.

| Game | Why players return | Strong pattern to borrow | Repeated frustration to avoid | Application to Crypt of Greed |
|---|---|---|---|---|
| Vampire Survivors | constant micro-rewards, unlock chains, explosive power curve, simple controls | fast first input and obvious growth every few minutes | visual overload, samey late content, eye strain | keep planning readable; use strong payoff bursts and reduced-effects options |
| Balatro | familiar poker foundation, rule-breaking Jokers, critical shop choices, visible collection | simple rules that combine into surprising multipliers | high-stake RNG, unlock grind, cross-device progression complaints | make Greed unpredictable but agency-rich; keep unlock conditions visible |
| Brotato | short runs, immediate build identity, many character modifiers | fast experimentation and compact sessions | false weapon choices, difficulty spikes, controller/menu friction | keep offers differentiated and navigation controller-native |
| Luck Be A Landlord | roughly ten-minute runs, absurd synergy payoffs, easy restart | readable symbolic interactions and low onboarding cost | sameness, weak meta progression, content dilution | make every new card alter decisions; use finite discovery tracks |
| Slay the Spire | informed enemy-intent decisions, deck restraint, route planning | intent UI and card skipping make knowledge more important than quantity | trap choices, knowledge burden, RNG blamed when recovery is low | preview outcomes, teach through play, provide recovery tools |
| Peglin | tactile pachinko resolution, satisfying chain reactions, novel build space | physical-feeling resolution can make numbers emotionally legible | narrow viable pools, balance swings, thin content/value concerns | invest in feel while ensuring multiple viable Greed builds |
| Hades | failure advances relationships and story, rapid restart, strong polish | death can deliver narrative and new motivation | repeated-run fatigue for players who do not connect with combat | keep post-run scenes concise and skippable; show progress immediately |
| Dead Cells | responsive controls, discovery, mastery, flexible difficulty tools | accessibility/customization can widen audience without removing mastery | hidden paths, backtracking, difficulty friction | separate intended challenge from unnecessary UI/input barriers |
| Dave the Diver | alternating dive and restaurant loops, strong character moments | secondary loop can refresh pacing and convert resources meaningfully | feature bloat, interruptions, sluggish controls, unfocused identity | do not add a management layer unless it directly reinforces Greed |
| Dome Keeper | clear mine-versus-defend risk loop, atmospheric presentation | one strong tension can support the full product | save issues, low variation, unclear onboarding, thin base value | Greed must have enough encounters and reliable saves to sustain it |
| Enter the Gungeon | mastery, weapon discovery, dense secrets, strong identity | expressive content and immediate action feedback | demanding onboarding and visual/projectile noise | preserve readable tactical state and fast retries |
| Loop Hero | “one more loop” escalation, indirect planning, resource extraction | route continuation itself can be the risk decision | grind, slow starts, unclear tooltips, repetitive finales | make banking fast, transparent, and impactful each act |
| Cult of the Lamb | memorable theme, colony fantasy, progression variety | cohesive art and character identity can broaden roguelite appeal | shallow combat, chore pressure, system overload, save/crash complaints | keep the card game primary; avoid mandatory upkeep between runs |
| Backpack Hero | spatial inventory creates visible build expression | player can understand a build at a glance | save corruption, balance issues, locked content frustration | prioritize save integrity and make deck/relic synergies inspectable |

## Research Conclusions

### Add

- one high-clarity USP
- fast first play
- frequent but constrained rewards
- visible unlock conditions
- dramatic build escalation
- deterministic seeds
- controller-first navigation
- robust save recovery
- accessibility settings at first public demo
- a concise post-run summary
- strong signature audio and animation

### Improve

- enemy intents
- reward agency
- non-combat room consequences
- route planning
- build identity
- failure explanation
- progression goals
- input parity
- content differentiation
- balance telemetry

### Remove

- blockchain ownership from the commercial loop
- mandatory login
- paid-currency revival
- generic persistent-stat leveling as the primary progression
- empty flavor-only rooms
- unsupported quantity marketing
- duplicate combat and navigation logic
- auto-advance event timers
- tiny text and pointer-only interactions

### Redesign

- character persistence into profile plus active run
- floor counter into deterministic route state
- gold/crystals/NFTs into Gold, Hoard, Greed, and earned Seals
- shop equipment into cards, relics, services, and treasure
- death into a clear run ending
- “procedural dungeon” into a readable seeded route
- marketing around “web3” into the bank-or-risk fantasy

## Representative Community and Video Sources

- Vampire Survivors design discussion: https://www.reddit.com/r/gamedev/comments/sitab0/
- Roguelite onboarding discussion: https://www.reddit.com/r/roguelites/comments/1880ir0/
- Slay the Spire design analysis video: https://www.youtube.com/watch?v=DnF8Yt3tNMU
- Slay the Spire UI/intent design: https://arstechnica.com/video/watch/war-stories-slay-the-spire-war-stories
- Slay the Spire design/data discussion: https://www.gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder
- Deckbuilding design interviews: https://www.gamedeveloper.com/design/designing-for-deck-building-in-video-games
- Reddit discussion on tutorial text and fair failure: https://www.reddit.com/r/gamedev/comments/1k841qm/
- Reddit discussion on accessible roguelite entry points: https://www.reddit.com/r/roguelites/comments/1880ir0/

## Steam Research Pages

- Vampire Survivors: https://store.steampowered.com/app/1794680/Vampire_Survivors/
- Balatro: https://store.steampowered.com/app/2379780/Balatro/
- Brotato: https://store.steampowered.com/app/1942280/Brotato/
- Luck Be A Landlord: https://store.steampowered.com/app/1404850/Luck_be_a_Landlord/
- Slay the Spire: https://store.steampowered.com/app/646570/Slay_the_Spire/
- Peglin: https://store.steampowered.com/app/1296610/Peglin/
- Hades: https://store.steampowered.com/app/1145360/Hades/
- Dead Cells: https://store.steampowered.com/app/588650/Dead_Cells/
- Dave the Diver: https://store.steampowered.com/app/1868140/DAVE_THE_DIVER/
- Dome Keeper: https://store.steampowered.com/app/1637320/Dome_Keeper/
- Enter the Gungeon: https://store.steampowered.com/app/311690/Enter_the_Gungeon/
- Loop Hero: https://store.steampowered.com/app/1282730/Loop_Hero/
- Cult of the Lamb: https://store.steampowered.com/app/1313140/Cult_of_the_Lamb/
- Backpack Hero: https://store.steampowered.com/app/1970580/Backpack_Hero/

## Playtest Plan

### Round 1 — Paper/system prototype

Questions:

- Is banking versus carrying understandable?
- Is one option obviously dominant?
- Does Greed change decisions?
- Is combat readable?

### Round 2 — Graybox vertical slice

Measure:

- time to first choice
- tutorial completion
- invalid inputs
- card inspect frequency
- Greed tier distribution
- bank/extract/defy rate
- deaths by encounter
- immediate replay rate

### Round 3 — External demo

Segment:

- deckbuilder experts
- strategy players unfamiliar with deckbuilders
- controller-only players
- handheld players
- players using accessibility settings

### Balance telemetry

Record anonymized:

- seed
- class
- route
- reward offers
- chosen/skipped cards
- deck at each boss
- damage taken
- Greed history
- bank/extract choices
- death cause
- run duration

Telemetry supplements playtest observation; it does not replace it.

## Gameplay Definition of Done for Vertical Slice

- one complete act
- deterministic runs
- save/resume
- one class with three build families
- meaningful card rewards
- deck inspection and skip
- Greed banking loop
- battle, elite, shop, rest, event, altar, boss
- controller and keyboard parity
- essential audio/game feel
- tutorial
- at least 20 automated domain tests
- external testers voluntarily start another run
