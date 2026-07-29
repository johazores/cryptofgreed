# Crypt of Greed — Console Readiness

> Status: Source of truth
> Audit snapshot: 2026-07-30
> Repository baseline: `main` at `d6c8f26281a17fc2997ac13273a277620588a4a3`
> Scope: Static repository audit and current-market research. No live build, controller lab, storefront backend, or console devkit validation was performed in this phase.


## Current Status

**Not console-ready.**

The current web application has no console build target, controller-first navigation, platform save abstraction, suspend/resume design, certification testing, devkit workflow, or native performance profile.

Console preparation must influence architecture now, but actual porting should begin only after the PC vertical slice and save system are stable.

## Platform Strategy

Recommended order:

1. Windows + Steam Deck
2. Nintendo platform feasibility
3. Xbox
4. PlayStation
5. mobile adaptation

The order may change with publisher support, platform approval, wishlists, and porting resources.

Do not promise a console date before:

- production engine is chosen
- platform-holder approval is obtained
- devkits are available
- port budget is known
- certification gap analysis is complete

## Engine Implications

### Unity

Unity provides a direct commercial path to Nintendo, PlayStation, and Xbox after platform-holder approval and appropriate licensing. This reduces engine-port risk but does not remove certification work.

### Godot

Godot supports desktop/mobile directly, but non-Deck console export generally requires licensed middleware, a porting provider, or internal platform work under NDA.

### Next.js/browser

The current application is not a practical console shipping architecture. A browser wrapper would still leave major problems in input, storage, suspension, performance, platform APIs, and certification.

## Controller-First Requirements

- every screen has deterministic focus
- focus is visible
- no hover-only information
- no pointer requirement
- no tiny target
- no keyboard-required naming
- remapping
- glyphs per active device
- controller reconnect
- controller user reassignment
- hold actions configurable
- vibration configurable
- safe default layout
- no launcher

The Xbox Accessibility Guidelines specifically emphasize input choice, UI focus, contrast, objective clarity, motion controls, and accessible feature documentation. Use them as design guardrails even for other platforms.

## Save and User Model

Console saves must account for:

- signed-in user
- user switching
- storage quota
- storage unavailable
- suspend/resume
- cloud synchronization
- conflict
- delete/reinstall
- multiple profiles
- guest restrictions
- achievement ownership
- DLC ownership changes

Never identify a save solely by a custom email account.

## Suspend and Resume

At any moment:

- domain state is serializable
- active animation can be reconstructed or skipped
- no network transaction is required to continue
- timers use game time, not wall-clock time unless explicitly designed
- daily challenge submission tolerates delayed connection
- audio resumes correctly
- controller focus returns predictably

Save at resolved boundaries. For mid-combat suspend, store the exact deterministic combat snapshot and RNG position.

## Safe Areas and Television Readability

Requirements:

- safe-area layout
- UI scale
- readable 1080p television distance
- 4K scaling
- high contrast
- no critical details at screen edge
- large focus indicators
- tabular numbers
- no reliance on 8–10 px web text
- subtitle/caption safe placement if voice is added

## Performance

Target profiles:

### Handheld console

- 60 FPS target
- 30 FPS fallback only if stable and justified
- low-power particle and post-processing settings
- memory budget per act
- fast suspend/resume
- no online dependency

### Home console

- 60 FPS target
- 1080p baseline
- 4K UI scaling
- minimal loading between nodes
- correct HDR strategy only if genuinely supported

A turn-based card game should prioritize stable input latency and clarity over expensive visual effects.

## Platform Services

Abstract:

- achievements/trophies
- cloud storage
- user identity
- save storage
- DLC entitlement
- rich presence/activity
- on-screen keyboard
- invitations, if future multiplayer exists
- error dialogs
- system language
- safe area
- haptics

No platform SDK enters game-domain code.

## Certification-Oriented Quality

Exact platform checklists are confidential after approval. Public preparation should still include:

- no crash/hang
- correct controller disconnect handling
- correct user change handling
- clear network failure behavior
- reliable save indicators
- no save corruption
- correct suspend/resume
- correct DLC ownership behavior
- correct system language
- no inaccessible external link required
- legal notices
- privacy policy for online data
- age ratings
- consistent terminology and platform glyphs
- patch compatibility
- clean shutdown

## Accessibility

Baseline:

- remappable controls where platform permits
- alternative input layouts
- text/UI scaling
- high contrast
- color-independent information
- reduced motion
- screen shake/flash controls
- vibration control
- pause anywhere
- difficulty assists
- readable objective/run overview
- audio cue alternatives
- accessible documentation before purchase

Use Xbox Accessibility Guidelines as a broad public checklist:

- text display
- contrast
- redundant visual/audio channels
- subtitles
- audio
- input
- difficulty
- objective clarity
- haptics
- UI navigation/focus
- errors and destructive actions
- time limits
- motion and photosensitivity

## Nintendo Preparation

Public Nintendo guidance indicates:

- individuals and companies may register
- Switch access requires an additional request
- platform information and SDKs require portal access/NDA
- games are submitted for review
- developers control price and release date

Preparation:

- strong portable/handheld UX
- instant suspend/resume
- low memory profile
- offline behavior
- touch as optional enhancement
- local user/save clarity
- age rating
- publisher/porting decision

Do not assume approval.

## Xbox Preparation

- register through the applicable Xbox developer program
- use GDK documentation after approval
- implement platform identity/storage correctly
- review Xbox Accessibility Guidelines early
- validate Quick Resume behavior when available
- handle controller and user association
- prepare achievement and store metadata
- test multiple console performance tiers as required

## PlayStation Preparation

- apply through PlayStation Partners
- obtain SDK/devkit access under NDA
- implement trophies, users, storage, activities where required
- validate suspend/resume
- test controller-specific glyphs/haptics
- prepare platform-specific store and legal assets
- maintain a platform compliance issue tracker

No private certification requirement should be copied into public repository documentation.

## Porting Ownership

Choose one model before console production:

### Internal port

Pros:

- control
- shared code knowledge
- long-term patch capability

Cons:

- approvals, devkits, expertise, and time
- certification learning curve
- parallel-platform maintenance

### Porting partner

Pros:

- platform experience
- certification support
- reduced setup risk

Cons:

- cost
- scheduling dependency
- handoff quality
- patch coordination

### Publisher

Pros:

- funding
- approvals/relationships
- QA/marketing
- port management

Cons:

- revenue share
- control
- milestone obligations

For a small team, a porting partner or publisher is the likely path after strong Steam evidence.

## Console Readiness Milestones

### C0 — Architecture

- platform service interfaces
- deterministic domain
- versioned saves
- controller-first UI
- safe-area system
- localization

### C1 — PC/Deck proof

- native build
- stable controller run
- suspend/resume simulation
- 800p and television layout
- performance profile

### C2 — Partner/approval

- pitch deck
- gameplay trailer
- project plan
- legal entity
- platform applications
- port budget

### C3 — First devkit build

- boots reliably
- input
- save
- suspend
- audio
- platform user
- basic platform services

### C4 — Certification hardening

- platform QA matrix
- compliance issue tracking
- localization
- ratings
- store assets
- patch/recovery plan

### C5 — Submission

- release candidate
- known-issue review
- day-one patch decision
- support process
- rollback build
- launch monitoring

## Console Go/No-Go Gate

Proceed only when:

- Steam reviews and sales justify cost, or publisher funding exists
- save loss is not a known issue
- controller UI is mature
- content is stable
- production engine path is proven
- platform approval exists
- porting owner is contracted
- localization budget exists
- post-launch patch capacity exists

## Research References

- Nintendo registration: https://developer.nintendo.com/register
- Nintendo process: https://developer.nintendo.com/the-process
- Nintendo FAQ: https://developer.nintendo.com/faq
- Xbox Accessibility Guidelines: https://learn.microsoft.com/en-us/xbox/accessibility/guidelines
- Unity console development: https://unity.com/solutions/console
- Godot console support: https://docs.godotengine.org/en/4.4/tutorials/platform/consoles.html
