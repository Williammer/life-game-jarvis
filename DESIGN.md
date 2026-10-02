---
name: "Jarvis — daily workspace and original variants"
description: "Accepted C evidence workshop with A capability topology; current local prototype, not production approval."
colors:
  a-bg: "#eef4f4"
  a-paper: "#fffefa"
  a-ink: "#18383e"
  a-muted: "#49676b"
  a-accent: "#17616a"
  a-soft: "#d9e9e9"
  a-line: "#bccfce"
  a-warm: "#8b5511"
  a-positive: "#246646"
  a-negative: "#9f3434"
  b-bg: "#f1edf4"
  b-paper: "#fffcff"
  b-ink: "#382640"
  b-muted: "#68566f"
  b-accent: "#654078"
  b-soft: "#e4d9eb"
  b-line: "#cbbcd1"
  b-warm: "#825317"
  b-positive: "#316747"
  c-bg: "#eaf0f4"
  c-paper: "#fff"
  c-ink: "#243c50"
  c-muted: "#50677a"
  c-accent: "#176552"
  c-soft: "#dceee5"
  c-line: "#bdced7"
  c-warm: "#865419"
  c-positive: "#176552"
  white: "white"
  a-map: "#e3eeee"
  b-selected-card: "#f9f3fc"
  b-note-copy: "#eadfec"
  chrome-bg: "#202e36"
  chrome-text: "#f7fafb"
  chrome-line: "#50616b"
  chrome-selected-bg: "#f5f9fa"
  chrome-selected-text: "#203e48"
  chrome-hover-line: "#849ba5"
  day-control-ink: "#253d50"
  day-panel-line: "#bfced8"
  day-divider: "#d4dfe5"
  day-header-line: "#c5d3dc"
  day-editor: "#f4f8fa"
  day-chat: "#eef3f6"
  day-context: "#edf5f1"
  day-context-line: "#c0d9cc"
  day-input-line: "#a9bdca"
  day-fixed: "#e9f0f8"
  day-fixed-line: "#a9bfd0"
  day-fixed-ink: "#294761"
  day-quest: "#e2f0e9"
  day-quest-line: "#84b59f"
  day-quest-ink: "#185d48"
  day-draft: "#faf2df"
  day-draft-line: "#936b29"
  day-draft-ink: "#725019"
  day-conflict: "#fff0ed"
  day-conflict-line: "#ac4747"
  day-conflict-ink: "#8d3333"
  day-complete: "#f1f5f3"
  day-complete-line: "#a5c0b2"
  day-complete-ink: "#3d6655"
  day-unchanged: "#f2f5f7"
  day-unchanged-line: "#bacbd5"
  day-now: "#c14843"
  day-map: "#edf5f4"
  day-map-line: "#c9dcd6"
  day-route: "#9a702c"
  day-node-line: "#a8c3b6"
  day-notice: "#e1eee7"
  day-notice-line: "#bad1c3"
typography:
  display:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "clamp(28px,3.2vw,46px)"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-.035em"
  headline:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "22px"
    lineHeight: 1.35
    letterSpacing: "-.02em"
  title:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "17px"
    fontWeight: 650
    lineHeight: 1.35
  body:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    lineHeight: 1.65
  body-copy:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "14px"
    lineHeight: 1.8
  label:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "12px"
  button:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "14px"
    fontWeight: 600
  chapter-spine:
    fontFamily: "\"Songti SC\",STSong,serif"
    fontSize: "23px"
    letterSpacing: "8px"
  day-heading:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-.02em"
  day-section:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "17px"
    lineHeight: 1.35
    letterSpacing: "-.02em"
  day-conversation:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "13px"
    lineHeight: 1.85
  day-action:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "12px"
    fontWeight: 600
  day-gap:
    fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",system-ui,sans-serif"
    fontSize: "23px"
    fontWeight: 650
    lineHeight: 1.65
    letterSpacing: "-.035em"
rounded:
  tag: "5px"
  field: "6px"
  button: "7px"
  record: "9px"
  map-node: "10px"
  surface: "12px"
  map: "16px"
  circle: "50%"
  day-context: "4px"
  day-composer: "8px"
spacing:
  xs: "6px"
  sm: "10px"
  control: "16px"
  md: "20px"
  panel: "24px"
  column: "28px"
  chapter: "32px"
  wide: "40px"
  desktop-gutter: "44px"
  day-content: "18px"
  day-gap: "20px"
  day-gutter: "26px"
components:
  button-primary:
    backgroundColor: "{colors.a-accent}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-secondary:
    backgroundColor: "{colors.a-paper}"
    textColor: "{colors.a-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.a-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "10px 8px"
  field:
    backgroundColor: "{colors.a-paper}"
    textColor: "{colors.a-ink}"
    rounded: "{rounded.field}"
    padding: "9px 10px"
    width: "100%"
  stage-navigation:
    textColor: "{colors.a-muted}"
    padding: "18px 0 15px"
  tag:
    textColor: "{colors.a-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 8px"
  panel:
    backgroundColor: "{colors.a-paper}"
    textColor: "{colors.a-ink}"
    rounded: "{rounded.surface}"
    padding: "24px"
  a-map-node:
    backgroundColor: "{colors.a-paper}"
    textColor: "{colors.a-ink}"
    rounded: "{rounded.map-node}"
    padding: "13px 17px"
  b-quest-card:
    backgroundColor: "{colors.b-paper}"
    textColor: "{colors.b-ink}"
    rounded: "{rounded.surface}"
    padding: "20px"
  c-document:
    backgroundColor: "{colors.c-paper}"
    textColor: "{colors.c-ink}"
    padding: "30px"
  day-button-primary:
    backgroundColor: "{colors.c-accent}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  day-button-secondary:
    backgroundColor: "{colors.c-paper}"
    textColor: "{colors.c-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  day-button-text:
    backgroundColor: "transparent"
    textColor: "{colors.c-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "10px 8px"
  day-field:
    backgroundColor: "{colors.c-paper}"
    textColor: "{colors.c-ink}"
    rounded: "{rounded.field}"
    padding: "9px 10px"
    width: "100%"
  day-navigation:
    backgroundColor: "transparent"
    textColor: "{colors.c-ink}"
  day-tag:
    textColor: "{colors.c-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "3px 8px"
  day-panel:
    backgroundColor: "{colors.c-paper}"
    textColor: "{colors.c-ink}"
    rounded: "{rounded.map-node}"
  day-composer:
    backgroundColor: "{colors.c-paper}"
    textColor: "{colors.day-control-ink}"
    rounded: "{rounded.day-composer}"
    padding: "10px"
  day-event:
    backgroundColor: "{colors.day-fixed}"
    textColor: "{colors.day-fixed-ink}"
    rounded: "{rounded.tag}"
    padding: "4px 7px"
  day-event-draft:
    backgroundColor: "{colors.day-draft}"
    textColor: "{colors.day-draft-ink}"
    rounded: "{rounded.tag}"
    padding: "4px 7px"
  day-capability-node:
    backgroundColor: "{colors.c-paper}"
    textColor: "{colors.c-ink}"
    rounded: "{rounded.button}"
    padding: "12px 16px"
---

# Design System: Jarvis — daily workspace and original variants

## Overview

**Creative North Star: "Jarvis daily workspace — C 证据工坊 × A 成长图谱"**

The user explicitly prefers C’s evidence workshop with A’s capability graph and quantified gaps. The default `index.html` now opens a unified module overview, with shared module details and the daily calendar available from the same shell. Calendar editing, contextual conversation, reviewable proposals and progress evidence remain one connected workspace. C supplies the slate, ink and emerald document character; A supplies the visible capability topology. This is an accepted prototype direction, not approval of a production identity or runtime integration.

The original fifteen A/B/C views remain at `variants.html`, backed by `app.js`, `styles.css` and `model.js`. Their palettes and signature structures remain valid historical comparison material. They do not require the new workspace to keep its calendar, conversation and graph in separate candidate worlds. The current module composition is recorded in `.impeccable/surfaces/module-atlas.md`; `.impeccable/surfaces/agent-day.md` records the earlier daily refinement, and `.impeccable/surfaces/game-lab.md` records the original comparison phase, including its then-pending preference verdict.

**Key Characteristics:**

- C’s pale slate, white paper, ink blue and evidence green anchor the default workspace.
- A’s capability topology connects an explicit gap to a proposed daily action.
- Shared module ledgers and evidence documents keep standing, comparable gaps and stage routes legible across different growth directions.
- Calendar and conversation share the selected object; proposed changes remain visibly distinct from accepted time.
- Chinese system typography, compact supporting text and tabular quantities support an operational surface.
- Text accompanies event and evidence states; controls retain visible keyboard focus.
- CSS and inline SVG carry the visuals; no raster assets, external fonts or new dependencies ship.

Evidence: `index.html`, `day.css`, `day.js`, `day-model.js`, `module-ui.js`, `modules.css`, inherited `styles.css`, `PRODUCT.md`, the three surface briefs, earlier workspace captures under `.impeccable/review-v2/`, and the eight desktop/mobile module captures under `.impeccable/review-modules/`. This record describes the built local simulation. The separate finish review owns its verdict.

## Colors

The default workspace retains C’s emerald action accent and slate reading palette, with distinct calendar state surfaces. Frontmatter `day-*` values are extracted literals from `day.css`; they are documentation tokens, not a claim that the stylesheet defines new custom properties. Existing `a-*`, `b-*`, `c-*` and `chrome-*` values remain intact.

### Primary

- **C evidence green** (`c-accent`, also `c-positive`): filled actions, active navigation, capability selection and measured-progress bars in the daily workspace.
- **Historical A sea teal / B plum** (`a-accent`, `b-accent`): original route and task-card variants only.

### Secondary

- **Calendar states:** `day-fixed-*` marks fixed time in blue; `day-quest-*` marks growth tasks in green; `day-draft-*` marks proposed changes in warm paper with a dashed border. `day-conflict-*` marks collisions; `day-complete-*` marks recorded completion. `day-unchanged` and its line color mute copied events in the proposal lane, with `c-muted` text.
- **Route ochre** (`day-route`): dashed capability connections in the earlier daily growth map; the module roadmap uses slate rules and emerald completed markers. Historical A retains its own `a-warm` route and chapter color.
- **Now marker** (`day-now`): the thin red simulated-current-time rule and circular endpoint.
- **Negative state** (`a-negative`): the inherited error/withdrawal token remains shared; local inline and proposal error colors are implementation-specific variants.

### Neutral

- C’s `bg`, `paper`, `ink`, `muted`, `soft` and `line` still supply the inherited palette. `day-panel-line`, `day-divider` and `day-header-line` distinguish container edges, internal divisions and shell rules.
- `day-control-ink` is used explicitly by the composer, mode selector and context emphasis. `day-editor`, `day-chat`, `day-context` and `day-notice` provide local tonal grouping without raised cards.
- The source declaration `day.css body { background:#edf2f5; color:#253d50 }` is overridden by the more specific `styles.css body[data-variant=C]` rule. The actual body canvas/ink remain `c-bg` / `c-ink`; this record does not promote the overridden declaration into a default canvas token.
- Historical B’s selected-card and note-copy, A’s grid-backed map, and `chrome-*` comparison-switcher colors retain their original scope. `white` remains the filled-button foreground.

**The Accepted Direction Rule.** Use C’s evidence palette with A’s capability topology for the default daily workspace. Preserve the original A/B/C variants as comparison history; the accepted prototype preference does not imply production approval.

**The Readable State Rule.** Retain written event, proposal and evidence states alongside color, borders and the semantic state attributes present on controls.

## Typography

Display, body and controls use the native Chinese stack in frontmatter with no network font loading. The original A chapter spine alone uses Songti. Tabular figures distinguish quantities without adding a monospace family.

### Hierarchy

- **Daily heading:** `day-heading` is 28px/650 with 1.35 line height and -.02em tracking, reducing to 24px at 850px. The inherited 24ch maximum remains.
- **Daily section:** calendar, agent and rail h2s use 17px; growth-page h2s use the inherited 22px headline role. Intent h3s are 16px, proposal/editor headings 15px, and selected capability detail 18px.
- **Conversation:** 13px/1.85 for intent and chat copy; mobile intent/chat copy becomes 12px. The composer uses 13px/1.75, and the latest reply uses 12px/1.8. Paragraphs inherit the 72ch cap.
- **Actions:** the shared button base remains 14px/600; most daily-panel actions override it to 12px. Quick actions and footer controls use 11px.
- **Quantities:** gap values are 23px/650 with -.035em tracking; evidence and proposal totals are 20px/650, with proposal totals reducing to 18px on mobile.
- **Module hierarchy:** detail titles use 28px, reducing to 24px at 850px; overview module names use 21px. Standing values use 32px/650 with 1.2 line height and -.035em tracking, reducing to 29px at 850px. These are module-surface measurements, not replacement global type tokens.
- **Local metadata:** 10–12px appears in timeline labels, event time text, node status and mode notes. These compact exceptions describe the current prototype; they are not an app-wide small-text recommendation.

Unprefixed display/title/body-copy and chapter-spine tokens preserve the original variants: their page heading uses `clamp(28px,3.2vw,46px)`, 29px at the historical narrow breakpoint; original chapter headings use 30px/25px. No above-heading decorative eyebrow is a reusable heading pattern. The native display stack is recorded as the accepted operational prototype choice, not a production display-font endorsement.

## Layout

The daily header is 74px tall with 30px inline padding. `.day-shell` stops at 1580px and uses `24px 26px 35px` padding. The desktop workspace grid is `208px minmax(390px,1fr) 355px` with 20px gaps: growth rail, calendar, conversation. Evidence sits below on a matching `208px 1fr` grid. The earlier daily growth-page composition used `minmax(0,1.7fr) minmax(290px,1fr)` with a 28px gap and 25px canvas padding; the module overview and detail below now occupy this destination.

- At 1600px and above, the workspace becomes `220px minmax(480px,1fr) 375px`.
- At 1250px and below, the rail hides; the workspace becomes `minmax(390px,1fr) 340px`, evidence becomes one column, shell gutters become 22px, and the calendar viewport grows from 588px to 620px.
- At 850px and below, the header becomes 64px tall, the shell uses `20px 16px 28px`, and the workspace stacks with conversation before the full-width calendar. The calendar viewport is 520px; a proposal action links down to it. The earlier growth canvas stacked into one column with 20px padding. The current 成长总览 navigation keeps all modules accessible when the daily rail is hidden.
- The calendar’s 08:00–22:00 timeline is 1008px tall: 28 half-hour rows at 36px, 72px per hour, and a 46px time gutter. A proposal adds a second equal-width lane beside the current arrangement. The viewport scrolls independently and preserves position through rerenders.
- The conversation uses 18px content padding, 16px on mobile. Optional history is capped at 240px, 170px on mobile; mobile proposal changes are capped at 180px. Calendar editing uses two native time fields in an equal-column grid with a 12px gap.
- The earlier capability map is 310px tall, with percentage-positioned nodes and a dashed inline-SVG path. Measured-gap rows use `100px 1fr 68px`, becoming `90px 1fr 65px` on mobile.

The module overview uses one ruled white ledger with four columns: direction, standing, upcoming work and horizons, and exemplar gap. Above 1200px its columns are `1.05fr .65fr 1.25fr 1.1fr`, with 30px gaps and 26px inline padding; rows use 29px block padding. At 1200px the gaps and padding reduce. At 850px the header row hides and modules become labeled two-column sections; at 440px the identity/standing pair remains above full-width work and comparison sections. This is the accepted module composition, not a requirement for every future screen.

Module detail places one evidence document beside a 360px Jarvis column with a 24px gap, reducing to 330px/20px at 1200px. Document padding steps from 28px to 23px to 20px. The three-stage roadmap becomes one column at 1200px; metric bars hide there while values, units and percentages remain. At 850px, explicit “模块与路线” / “与 Jarvis 讨论” controls show one pane at a time. Opening a module defaults to its document; analysis and reference-discussion actions open Jarvis. Selected pane buttons use `aria-pressed`, emerald fill and a 42px minimum height.

Historical variants retain their own layouts: a 1440px header/navigation and 1352px main shell; A’s route/chapter, B’s deck/ledger and C’s 245px dossier/document split; breakpoints at 1450px, 1100px, 800px and 520px; and the fixed comparison switcher. These rules apply at `variants.html`, not as a template for the default workspace.

## Elevation & Depth

The default workspace is flat: white panels, fine rules and event tones establish hierarchy. Calendar events explicitly use `box-shadow:none`; selected events and capability nodes use outlines. It does not inherit A’s floating map-node shadows simply because it reuses A’s topology.

### Shadow Vocabulary

- **Historical A map node:** `0 4px 12px #0000000b` at rest.
- **Historical A selected map node:** `0 5px 18px #00000018`.
- **Historical comparison switcher:** `0 8px 30px #00000030`.

Inherited button transitions animate background and border color over 160ms with ease-out. Reduced motion disables transitions and smooth scrolling. There are no scene animations.

## Shapes

Daily calendar and conversation panels use 10px corners with a 1px border; the growth canvas uses 12px. The composer and capability-map plane use 8px, capability nodes and buttons 7px, native fields 6px, events and quick actions 5px, selected-context strips 4px. Selected events use a 2px emerald outline with 1px offset; capability nodes use 2px with 2px offset. Rail markers and the now endpoint are circular. Draft event borders are dashed rather than merely recolored.

Historical shared panels and task cards retain 12px corners, A map nodes 10px and the map plane 16px. The original C document/notebook remains square with round evidence stamps. Those historical silhouettes are not imposed on the daily calendar or conversation containers.

## Components

### Buttons

The current page inherits C’s filled primary, paper secondary and transparent text buttons: 7px corners, `10px 16px` padding and 44px minimum height. Primary hover applies `brightness(.94)`; other button hover adds C’s soft fill and accent border. Disabled controls use .6 opacity and a not-allowed cursor. Daily contexts override size deliberately: calendar/composer actions have a 36px minimum; quick actions use 34px, raised to 40px on mobile.

Actionable controls inherit a 3px emerald keyboard-focus outline with 4px offset. Time slots move the outline inward by 3px. The composer transfers focus treatment to its enclosing border. Rerenders preserve the initiating control when available; navigation moves focus to the page h1 without a visual heading outline, and opening an event editor focuses its first field. This focus behavior is separate from selected-state outlines.

### Inputs / Fields

Native labeled fields inherit white fill, C’s line and ink, 6px corners, `9px 10px` padding and a 44px minimum height. The calendar editor exposes start/end `type="time"` fields as the alternative to dragging. The event title is bounded to 80 characters.

The conversation composer has a `day-input-line` border, 8px corners and 10px padding. Its border receives a 2px emerald outline with 1px offset on focus-within; the inner textarea therefore has no second outline. It is vertically resizable, at least 92px tall (72px on mobile), uses visible `c-muted` placeholder text, and has an accessible label. Sending is available through the button or Ctrl/Cmd+Enter.

### Navigation

The daily header has two text controls, 今日 and 成长总览. The initial view is the module overview; module detail adds a return-to-overview control and a native module selector. The active page uses emerald text, a 2px underline, weight 650 and `aria-current="page"`. On mobile, the controls have a 44px minimum height and the long desktop status is hidden. The footer links to the original variants; the fixed A/B/C switcher belongs only to those original views.

### Tags and Status

The inherited outlined tag labels the playable prototype. Context strips show either the selected event or the chosen growth focus. Proposal rows label 新增 / 调整 / 移除 in text; the proposed lane explicitly says it has not taken effect. Evidence summaries distinguish action XP, simulated capability validation and measurements. Color never substitutes for those distinctions.

### Cards / Containers

Calendar and conversation are bordered work surfaces with divided headers, not a repeated dashboard-card grid. The conversation’s state-dependent intent, proposal, record preview and disclosures are separated by horizontal rules. User chat messages alone gain a pale filled bubble with 7px corners. The evidence log uses native disclosures and preserves their open state across rerenders.

### Calendar Events and Proposals

Fixed, quest, proposed, conflict, completed and unchanged events use the extracted state palettes. Events sit 5px from the lane’s left and 7px from its right, with `4px 7px` internal padding, 5px corners, 1.25 line height and a 21px minimum height. Titles ellipsize; the accessible name retains the full title, time and current/proposed state. Events shorter than 30 minutes use a 10px title with start time inline and hide the secondary time row.

An empty half-hour slot is a real button. Hover adds a pale green fill and “添加事项”; keyboard focus also highlights the slot. Dragging an accepted event creates a proposal, while the native editor provides an explicit confirmation path. Draft conflicts surface explanatory text and disable acceptance; the visual contract is review before a proposal takes effect. Event state styles follow the actual cascade: completed styling follows conflict styling, and unchanged styling is appended last. This record does not invent precedence beyond the code.

### Earlier Capability Topology and Gaps

The earlier daily map uses selectable nodes with written simulated/pending evidence status, `12px 16px` padding, a 116px minimum width and 67px minimum height. At 850px the final width minimum is 96px and padding is 10px. The detail area states a concrete missing capability and offers an action that brings a proposal into the daily workspace. Measurement comparisons use 8px bars; the rail’s coverage segments are 6px. Numerical gaps retain their own units and sources instead of being converted into one mastery score.

### Module Ledger, Evidence and Routes

The overview and every module detail share data-driven renderers. The ledger and detail surfaces reuse white paper, fine slate rules and 10px corners; horizontal divisions group content without adding a separate card to every metric. Underlined emerald module names open the shared document. Standing has a prominent tabular value, a written evidence-coverage caption and a narrow bar; missing evidence displays 待评估 or 未知. The displayed 0–100 scale is relative to each module’s own target, not a cross-domain ranking. Action XP stays separate.

The document orders current evidence, exemplar comparison and a near/mid/long route. Metric rows retain source/evidence text and target units. Native disclosures hold scoring basis and confidence. Exemplars have a public-source link, a specific claim and a written comparability limit. A comparison bar describes only that metric or checklist. Roadmap stages use a fine top rule and circular marker; emerald fill accompanies the written simulated-completion state. Scheduling a stage task creates a calendar proposal that still requires confirmation.

### Module Discussion and Confirmation

The contextual Jarvis work surface reuses the existing composer and divided panel treatment. A module proposal shows its basis, target, standing, coverage, comparable gap and horizons before the explicit 确认采用 / 暂不采用 actions. Reference changes show before/after names; confidence and missing information stay visible or available through disclosure. Stale proposals show explanatory text and disable acceptance. Confirmation updates the module while preserving accepted calendar time and action XP.

New-module input starts with an intention and an unknown standing; pausing/restoring a module preserves history. The overview’s native action-growth disclosure keeps level, XP and the simulated reward separate from the evidence-derived module assessment. All personal values and Jarvis analyses remain local fiction; the shipped UI does not establish a real research or Agent runtime.

The sidecar retains ten primitive/signature previews and records the accepted module patterns in its extension metadata. Earlier capability-node previews retain their historical daily-refinement scope. Historical frontmatter components remain available as a record of the original variants; their A references are not the default workspace palette. Color ramps in the sidecar are synthesized preview metadata, not shipped tokens or newly approved colors.

## Do's and Don'ts

### Do:

- Do use C’s evidence palette with A’s capability topology in the default workspace.
- Do preserve the original A/B/C palettes and views as historical comparison material.
- Do retain visible control focus, labeled native fields, written state and reduced-motion behavior.
- Do keep current time, proposed time, evidence, XP and measurements visibly distinguishable.
- Do expose prototype and simulated-data status without claiming a connected model or calendar service.

### Don't:

- Don’t describe the user’s C-plus-A preference as pending, or require the accepted workspace to remain three separate candidates.
- Don’t treat accepted prototype direction as production identity or runtime approval.
- Don’t introduce external fonts or raster imagery into this record; neither ships in the prototype.
- Don’t turn compact 10px metadata or removed decorative heading badges into general-purpose typography patterns.

Not canonized or repaired here: compact 9–11px metadata remains a local legibility ceiling; the overridden body declaration and incidental tone/size differences are documented without normalizing implementation. Historical typography exceptions remain scoped to the original variants. The earlier daily artifact’s recorded 52 advisory / 0 primary detector findings are not a fresh module result and are not retroactively cleared by this record; finish review and production approval remain separate.
