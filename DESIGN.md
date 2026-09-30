---
name: "Jarvis prototype lab — candidate worlds"
description: "Extracted visual record of three alternatives; user preference and production identity remain pending."
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
rounded:
  tag: "5px"
  field: "6px"
  button: "7px"
  record: "9px"
  map-node: "10px"
  surface: "12px"
  map: "16px"
  circle: "50%"
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
---

# Design System: Jarvis prototype lab — candidate worlds

## Overview

**Creative North Star: "Jarvis comparison lab — 远征图谱 / 策略牌桌 / 证据工坊"**

This is a scan of three candidate worlds inside one throwaway interactive prototype, not one approved production identity. A expresses progression through maps, routes and chapters; B makes budget choices tangible through task cards and a ledger; C treats progress as an evidence document. Their names and visual descriptions come from the built artifact. The user’s preference remains pending.

Shared chrome and native controls make the alternatives comparable. Chinese system typography, quiet paper surfaces and compact state text support reading and action; the three palettes and signature structures remain separate. This record describes the current build, not a new set of design decisions. Surface composition and mode remain in `.impeccable/surfaces/game-lab.md`.

**Key Characteristics:**

- Three distinct candidate palettes with shared semantic color roles.
- Chinese system typography; tabular numbers for time, budgets and XP.
- A route map, B selectable task cards and C evidence documents.
- Text and semantic state accompany color; keyboard focus remains visible on controls.
- CSS and inline SVG carry the visuals; no shipping raster assets or external fonts.

Evidence: `styles.css`, rendered HTML templates in `app.js`, `index.html`, `PRODUCT.md`, and the surface brief. This is a code-extracted record; the separate finish review owns its verdict. Typography and color names here are descriptive, not newly approved brand choices.

## Colors

Each candidate uses pale neutral surfaces, a dark reading color and a restrained action accent. Frontmatter values are the source of truth for this record; prefixes preserve the alternative they belong to.

### Primary

- **A sea teal** (`a-accent`): route selection, primary actions, active navigation and map-node borders.
- **B plum** (`b-accent`): selected tasks, decision controls and the active stage.
- **C evidence green** (`c-accent`): accepted evidence, selectable outputs and primary actions.

### Secondary

- **A ochre trail** (`a-warm`): dashed route connections and the chapter spine.
- **Positive state** (`a-positive`, `b-positive`, `c-positive`): favorable status labels. C deliberately shares its positive and accent value.
- **Negative state** (`a-negative`): inherited by all three worlds for errors, over-budget figures and withdrawal controls.

### Neutral

- Each candidate’s `bg`, `paper`, `ink`, `muted`, `soft` and `line` tokens retain the same semantic job while changing hue.
- B’s selected-card and note-copy colors belong to its cards and dark tactical note. Its `warm` token and C’s `warm` token are declared overrides; their presence is not evidence for inventing new uses.
- A’s map surface belongs to its grid-backed route map. The translucent map grid is structural map texture, not an app-wide background treatment.
- `chrome-*` tokens belong only to the fixed prototype comparison switcher. They do not establish another candidate world.
- `white` is the foreground on filled action buttons and passed criteria boxes.

**The Candidate Boundary Rule.** Keep A, B and C token sets separate in this lab. None is the approved production identity; user preference remains pending.

**The Readable State Rule.** Retain the text labels and semantic selection attributes that accompany color changes in the built controls.

## Typography

The inherited display, body and controls use the native Chinese stack recorded in frontmatter. This is an intentional choice for this prototype, with no network font loading. The A chapter spine alone uses the Songti stack. Numeric data uses tabular figures rather than a separate monospace family.

### Hierarchy

- **Display:** the frontmatter display role is the page heading; it has a maximum width of 24ch and becomes 29px at the narrow breakpoint.
- **Headline:** the shared section-heading role. Built signatures override it: map detail 25px, chapter 30px, dossier 24px; chapter becomes 25px on narrow screens.
- **Title:** shared task and record titles; B cards use 18px before responsive overrides.
- **Body:** inherited line height, with paragraphs capped at 72ch. Explicit supporting copy uses 13–15px; the dedicated body-copy role uses the frontmatter value.
- **Label:** compact tags, source notes and state strips. The smallest map status labels become 10px below 520px; this is a current compact-map limit, not a new app-wide text-size recommendation.
- **Chapter spine:** vertical Songti with loose letter spacing on larger screens. Below 520px the spine disappears and “今日章节 ·” becomes part of the chapter h2.

No above-heading eyebrow is part of the final heading pattern. Typography tokens record the built candidate system; they do not approve a production display face.

## Layout

Shared header and stage navigation stop at 1440px; main content stops at 1352px including its gutters. Main padding is 35px 44px 38px. Shared split content uses `minmax(0,1.6fr) minmax(280px,1fr)` with a 24px gap. Paper panels use the frontmatter panel spacing. This is a compact action interface, with larger spaces separating decisions rather than padding every row equally.

A’s route layout uses `minmax(0,1.65fr) minmax(280px,.85fr)` and a 28px gap. Its chapter has an 86px spine column and a flexible content column. B’s strategy board pairs a flexible working area with a 310px sidebar; the allocation variant uses 340px. B’s deck starts with three columns. C’s workshop pairs a 245px dossier with a flexible document and a 35px gap. These are extracted candidate structures, not one universal page template.

- At 1450px and above, header/navigation gutters increase to 70px.
- At 1100px and below, gutters become 26px, B’s deck uses two columns and sidebars narrow.
- At 800px and below, main gutters become 20px and the major paired layouts stack. C’s dossier becomes a horizontal section above the document. Stage navigation remains horizontally scrollable; `app.js` brings the current step into view.
- At 520px and below, A’s chapter becomes one column, B’s accepted hand stacks, record field pairs stack, and C’s contract rows stack. B’s selection deck remains two columns. Metadata moves below its corresponding content where needed.
- The comparison switcher stays fixed near the bottom; content reserves space for it and the page supplies 100px scroll padding at the bottom.

## Elevation & Depth

Most depth comes from paper/background contrast, fine borders and colored selection surfaces. Two places use shadows: the A route nodes and the prototype switcher. Documents, ordinary panels and task cards are flat. This is not a global shadow prohibition: the map nodes visibly use lift to distinguish reachable controls from the map plane.

### Shadow Vocabulary

- **A map node:** `0 4px 12px #0000000b` at rest.
- **A selected map node:** `0 5px 18px #00000018` with its stronger selection border.
- **Prototype switcher:** `0 8px 30px #00000030` above page content.

Button state transitions use background and border color over 160ms with ease-out. The reduced-motion query disables transitions and smooth scrolling. There are no scene animations.

## Shapes

Shared paper panels and task cards use the surface radius; buttons, fields and tags use their smaller frontmatter radii. A’s map is more rounded, its nodes use the map-node radius, and waypoints are circular. C’s document and notebook are rectangular; round stamps carry the evidence state. Pending stamps use a dashed border and explicit wording. Line borders are normally 1px; selected map nodes and B cards use 2px. These differences belong to each candidate’s existing material.

## Components

### Buttons

Filled primary, bordered secondary and transparent text buttons share the same type and base dimensions. Normal buttons have a 44px minimum height; compact controls use 36px with 6px 10px padding. Hover adds the soft surface and accent border; filled primary hover also applies brightness(.94). Disabled buttons reduce opacity to .6 and show a not-allowed cursor. Warning text buttons use the inherited negative color.

Controls expose a 3px accent focus outline with 4px offset. The main region receives programmatic focus after navigation but has no visual focus outline; this does not remove focus from actionable controls.

### Inputs / Fields

Native inputs, textareas and selects use paper fill, a line border and the field radius. Fields have a 44px minimum height; textareas have a 76px minimum height and vertical resizing. Labels remain visible. Placeholder, caret and native accent colors follow the candidate palette. Existing number bounds and evidence requirements belong to the forms, not to decoration.

### Navigation

The stage bar uses text controls, a 2px accent underline and heavier type for the current step. It scrolls horizontally on narrow screens. The fixed dark comparison switcher uses a pale selected segment, with explicit A/B/C names; its mobile version omits the letter prefix. Both operate on shared in-memory state.

### Tags and Status

Tags are fine outlined rectangles with the tag radius. Favorable tags use soft fill and positive text; status remains written out. Tags identify evidence, simulation, timing and progress inside the flow. They are not a license to restore an above-heading decorative badge.

### Cards / Containers

Shared panels are padded paper containers with a line border. A record is a native disclosure with a written expand/collapse prompt and a form inside. C’s notebook removes individual record borders and radii in favor of horizontal rules. The document has square corners and a divided title row.

### A Route and Chapter

Map nodes are real selectable buttons connected by a dashed SVG route. Their selected state changes both border and shadow; state text explains prerequisites. The itinerary uses numbered circular waypoints. The chapter spine is contextual book structure, with its narrow-screen label integrated into the h2.

### B Quest Cards and Ledger

Task cards expose module, time, energy, outcome and XP. A selected card uses a stronger border, compensated padding and the B selected-card surface. Selection includes written “已入手牌” wording and `aria-pressed`. The accepted hand is read-only article content. Matrix and ledger tables use row separators and aligned tabular quantities rather than raised tiles.

### C Evidence Document

A narrow source dossier supports a rectangular document. Criteria rows combine a small checkbox-shaped indicator with explanation and written status. Output options use radio-like circles alongside semantic pressed state. Evidence folios use circular passed/pending stamps and explicit simulation wording; the stamp does not assert real verification.

The sidecar contains ten representative snippets, including the shared primitive variants and each candidate’s signature. Shared primitive frontmatter references show the default A values; runtime CSS variables supply the active candidate’s full palette. Shared snippets preserve variable inheritance with literal fallbacks for standalone preview; signature snippets scope the source candidate’s palette locally so comparing the three previews does not mix their worlds. Color ramps in the sidecar are synthesized preview metadata, not shipped palette tokens or approved new colors.

## Do's and Don'ts

### Do:

- Do use each candidate’s complete palette with its existing map, card or document structure.
- Do retain visible control focus, labeled fields, textual state and reduced-motion behavior.
- Do distinguish action XP, evidence validation and measured results in the labels already present.
- Do keep prototype comparison controls visually identifiable as lab chrome.

### Don't:

- Don’t treat these alternatives or their descriptive names as a user-approved production identity.
- Don’t introduce external fonts or raster imagery into this record; neither ships in the prototype.
- Don’t turn the removed above-heading state badge or removed mobile chapter eyebrow into a reusable pattern.

Not canonized or repaired here: the compact map’s 10px mobile state text is recorded as a local legibility ceiling, not a shared type token; preference selection and a production identity remain pending. This documentation does not substitute for the separate finish review.
