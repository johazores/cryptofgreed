# Crypt of Greed — UI/UX Audit

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.

## UX Goal

The interface should make complex tactical outcomes feel obvious, fast, and satisfying on mouse, keyboard, controller, handheld, television, and later touch.

The target experience is:

- one clear primary decision at a time
- readable at handheld and television distance
- fully navigable without a pointer
- immediate feedback for every input
- no hidden costs
- no required account before play
- no color-only communication
- no tiny card text
- no repeated modal friction

## Current UX Summary

The current interface communicates “web dashboard with a game screen” rather than “premium game.”

Strengths:

- clean page structure
- basic responsive layout
- obvious card and turn areas
- enemy health is visible
- primary buttons use familiar labels
- modals and toast feedback exist

Weaknesses:

- game cards are clickable containers, not accessible controls
- card body text reaches very small sizes
- no focus indicator or focus order
- no gamepad support or controller glyphs
- no keyboard-first interaction
- no target selection
- no outcome preview
- no keyword glossary
- no battle log
- no input remapping
- no game settings
- no audio or motion settings
- fixed HUD may overlap content
- generic white dashboard panels conflict with dark fantasy cards
- profile/account navigation is more developed than gameplay navigation
- revival currency and wallet features compete with the game
- no onboarding flow
- no safe-area or television layout
- no language expansion strategy

## Information Architecture

### Recommended top-level flow

1. Splash/loading
2. Title screen
3. Continue
4. Begin Descent
5. Delver/loadout selection
6. Run map
7. Encounter
8. Reward
9. Run summary
10. Collection/settings

Account and external services must not be in the primary path.

### Title screen

Default focus:

- Continue, when a save exists
- Begin Descent, when no save exists

Secondary:

- Daily Challenge
- Collection
- Settings
- Credits
- Quit on desktop

Accessibility settings must be reachable before gameplay.

### In-run navigation

Persistent lightweight pause menu:

- Resume
- Run Overview
- Deck
- Relics
- Codex
- Settings
- Save and Quit
- Abandon Run

“Abandon Run” requires a clear destructive confirmation. “Save and Quit” must never imply save success until the atomic write succeeds.

## Combat HUD

### Layout zones

#### Top left: player state

- portrait
- current/max health
- block
- energy
- active statuses
- Greed tier

#### Top center: encounter

- enemy group
- intent
- initiative/resolution order
- hover/focus preview

#### Top right: run resources

- floor/node
- gold
- banked Hoard
- unbanked Hoard
- current reward multiplier

#### Bottom: hand and actions

- cards
- draw/discard/exhaust counts
- End Turn
- inspect controls
- undo only before information-changing random effects, if supported

### Card interaction

Mouse:

- hover raises card
- tooltip appears after a short delay
- click selects
- target preview appears
- click target or confirm plays

Controller:

- left/right changes card focus
- up moves to enemies
- confirm selects/plays
- cancel returns
- shoulder buttons inspect draw/discard and cycle enemy details
- hold inspect expands keywords

Keyboard:

- arrows or A/D navigate
- Enter/Space confirm
- Escape cancel
- E end turn
- configurable shortcuts
- number keys optional, never required

Touch:

- tap selects
- tap target confirms
- long press inspects
- large minimum touch targets
- no hover-only information

### Card visual hierarchy

1. energy cost
2. name
3. primary numerical result
4. keyword icon
5. description
6. rarity/upgraded state

Do not use MedievalSharp for body text. Use it only for headings, card names, or decorative moments.

Minimum card body size should remain readable on Steam Deck and at television distance. If all text cannot fit, redesign the card rather than shrinking it.

### Playability state

An unplayable card must communicate why:

- insufficient energy
- no valid target
- status restriction
- missing resource
- hand rule

Use icon, label, and visual treatment. Opacity alone is insufficient.

## Enemy Intent

Enemy intent is the tactical foundation.

Display:

- action icon
- final damage or block value
- hit count
- target
- status effect
- trigger condition
- order of resolution

On focus, show a concise breakdown:

`8 damage × 2`
`+2 from Enraged`
`-1 per Weak stack`
`Final: 14 expected damage after current block`

Unknown intents may exist only as an explicit enemy mechanic and should still communicate the category of uncertainty.

## Greed UX

Greed must be visible and understandable without opening a menu.

### Greed meter

- five distinct segments
- icon and number
- each tier has a short title
- benefits and dangers shown together
- next-tier preview on selection of a risky choice

Example:

`GREED III — Covetous`
- `Hoard multiplier: ×1.75`
- `Rare reward chance: +12%`
- `Enemies gain one Affix`
- `Rest healing: -20%`

### Banking decision screen

Show three choices with consequence previews:

- Bank
- Extract
- Defy

Each choice includes:

- secured amount
- unbanked amount
- Greed change
- immediate reward
- run-ending status
- irreversible warning where needed

No ambiguous “Are you sure?” dialog after a well-designed consequence screen.

## Menus

### Settings categories

#### Gameplay

- tutorial hints
- confirm end turn
- fast mode
- damage previews
- screen-edge warnings
- auto-pause on focus loss
- hold vs toggle behavior

#### Controls

- remapping
- controller layout
- glyph family
- vibration strength
- cursor sensitivity
- simultaneous input support

#### Video

- resolution
- window mode
- frame cap
- VSync
- quality preset
- animation speed
- screen shake
- hit flash
- reduced motion
- high-contrast mode

#### Audio

- master
- music
- SFX
- UI
- ambience
- mute on focus loss
- dynamic range
- mono audio option

#### Accessibility

- UI scale
- text scale
- font alternative
- color-vision presets
- high contrast
- reduced motion
- screen shake off
- hold-to-press duration
- repeated input rate
- dyslexia-friendly font option
- screen reader groundwork
- subtitle/caption controls if voiced content is added

#### Language

- language
- number formatting
- locale preview

### Pause behavior

Turn-based combat allows a true pause at any time. Timed event text must not auto-advance by default.

## Onboarding Audit

The current repository has no designed tutorial. A premium tutorial should be contextual.

### Teaching order

1. select and play an attack
2. read enemy intent
3. gain block
4. end turn
5. choose a card reward
6. skip a card reward
7. choose a route
8. accept or reject Greed
9. bank Hoard
10. inspect deck and relics

### Rules

- one concept per step
- no wall of text
- no tutorial-only fake rules
- allow replay and reset
- show controls for active device
- allow experienced players to skip
- preserve discovery after basic competence

## Visual Design Direction

### Theme

“Obsidian treasury”

- charcoal and near-black surfaces
- warm parchment content panels
- tarnished gold for value
- blood red for danger
- cold cyan or violet for magic
- restrained glow
- strong silhouettes
- engraved iconography
- subtle animated dust and coin particles

### Typography

- display: a restrained fantasy serif or MedievalSharp for select headers
- body: highly readable sans serif
- numbers: tabular numerals for health, damage, and currency
- minimum contrast: 4.5:1 for standard important text
- dynamic type and UI scaling

### Color system

Color has semantic roles but is paired with shape/icon/text:

- attack: sword + angular frame
- defense: shield + square frame
- power: flame/rune + circular frame
- curse: broken seal + jagged frame
- bargain: coin/contract + split frame

### Spacing

Use an 8-point spacing system. Avoid arbitrary padding combinations. Handheld layout must preserve at least 16 px equivalent edge clearance and platform safe areas.

## Motion and Transitions

### Principles

- motion communicates cause and result
- transitions are short
- input is never blocked longer than necessary
- fast mode accelerates or skips repeated animation
- reduced-motion mode replaces movement with fades/highlights

### Core timings

Planning targets:

- focus response: under 50 ms
- card select: 100–150 ms
- card play travel: 180–250 ms
- hit freeze: 40–80 ms
- damage number: 350–600 ms
- room transition: 250–450 ms
- reward reveal: under 800 ms, skippable after first frame

These are tuning ranges, not rigid requirements.

## Feedback Matrix

| Action | Visual | Audio | Haptic | Information |
|---|---|---|---|---|
| Focus card | raise, outline | soft tick | none | tooltip hint |
| Play card | travel/trail | card-specific whoosh | light | resource cost |
| Deal damage | hit flash, number | impact | scaled pulse | health delta |
| Block damage | shield crack | metallic impact | short pulse | absorbed value |
| Trigger relic | relic flare | signature chime | optional | named trigger |
| Gain Greed | meter fills, scene tint | coin/whisper rise | medium | risk/benefit delta |
| Bank Hoard | coins lock into vault | resolved chord | confirmation pulse | secured total |
| Invalid input | focused shake/outline | low error tick | none | reason text |
| Save complete | subtle seal icon | soft stamp | none | timestamp |

## Controller and Steam Deck Requirements

For Steam Deck Verified intent:

- all content available through default controller configuration
- glyphs match active device
- no mouse/keyboard-only launcher
- on-screen keyboard for naming
- readable 800p UI
- default settings maintain at least 30 FPS
- cloud saves support Deck-to-PC continuation
- game can be suspended and resumed safely

Use an action-based input layer, not hardcoded buttons.

## Accessibility Requirements

Baseline for first public demo:

- remappable controls
- controller and keyboard parity
- visible focus
- UI scale
- text scale
- color-independent card categories
- reduced motion
- screen shake toggle
- hit flash toggle
- vibration control
- readable intent breakdown
- pause anywhere
- no time-limited reading
- difficulty assists separated from accessibility labels

Before 1.0:

- contrast presets
- font option
- mono audio
- captioning for meaningful audio cues
- screen narration feasibility review
- accessible feature documentation on store and website

## Localization Readiness

Do not concatenate translated strings.

Requirements:

- externalized text
- stable string IDs
- plural rules
- variable placeholders
- flexible layout
- 30–40% text expansion allowance
- CJK font fallback
- right-to-left feasibility assessment
- localized input glyphs and achievement text
- no text baked into art

Initial localization priority should be decided from wishlists, demo geography, and budget rather than copying competitor language lists.

## UX Acceptance Tests

### Controller-only run

A tester must be able to:

- launch
- start a run
- name/select a character
- complete all room types
- change settings
- save and quit
- resume
- finish or abandon
- inspect run summary

without touching a mouse or keyboard.

### Readability

- card text readable at 800p handheld
- important text meets contrast target
- no critical information conveyed by color alone
- UI scale does not clip major screens
- long localized strings do not overlap

### Error recovery

- failed save presents actionable recovery
- controller disconnect pauses and explains
- lost network does not interrupt single-player
- invalid action explains why
- destructive choices show consequences
- corrupted primary save loads backup or offers safe recovery

## Priority Recommendations

### P0

- replace card `div` interactions with semantic/focusable controls
- create one focus and action-navigation system
- remove tiny text
- add outcome previews
- redesign settings as game settings
- remove account/wallet from first-play path
- remove unsupported marketing claims
- add reduced motion and screen shake controls with the first VFX

### P1

- implement controller glyph switching
- build Greed meter and banking screen
- add keyword glossary and tooltips
- add battle event log
- add deck/relic inspect screens
- create tutorial
- validate 800p and television layouts

### P2

- screen reader feasibility
- advanced contrast presets
- localization polish
- touch adaptation
- custom controller layouts
- accessibility documentation and external testing

## Research References

- Steam Deck compatibility checklist: https://partner.steamgames.com/doc/steamhardware/compat
- Steam Input developer guide: https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_devs
- Xbox Accessibility Guidelines: https://learn.microsoft.com/en-us/xbox/accessibility/guidelines
- Xbox input guidance: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107
- Xbox contrast guidance: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/102
- Xbox UI focus guidance: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/113
- Xbox visual motion guidance: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117
