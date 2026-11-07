---
name: Poolthok
description: Planning poker as a real card table: felt, card stock, a dealer's reveal.
colors:
  felt: "oklch(0.38 0.075 158)"
  felt-deep: "oklch(0.27 0.06 160)"
  rail: "oklch(0.21 0.035 162)"
  on-felt: "oklch(0.96 0.015 150)"
  on-felt-dim: "oklch(0.8 0.04 155)"
  stock: "oklch(0.985 0.003 100)"
  stock-edge: "oklch(0.88 0.008 120)"
  ink: "oklch(0.2 0.015 160)"
  ink-dim: "oklch(0.45 0.02 160)"
  oxblood: "oklch(0.42 0.13 22)"
  brass: "oklch(0.8 0.12 85)"
  marker: "oklch(0.74 0.16 25)"
typography:
  display:
    fontFamily: "'Bodoni Moda', 'Didot', 'Bodoni 72', Georgia, serif"
    fontSize: "4.5rem"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "lnum"
  headline:
    fontFamily: "'Bodoni Moda', 'Didot', 'Bodoni 72', Georgia, serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Bodoni Moda', 'Didot', 'Bodoni 72', Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', 'Noto Sans Thai', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', 'Noto Sans Thai', Roboto, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
rounded:
  card: "5px"
  join-card: "10px"
  pill: "999px"
spacing:
  card-w: "88px"
  hand-w: "76px"
  card-w-sm: "58px"
  hand-w-sm: "44px"
components:
  button-primary:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0 22px"
    height: "44px"
  button-primary-on-stock:
    backgroundColor: "{colors.felt}"
    textColor: "{colors.on-felt}"
    rounded: "{rounded.card}"
    height: "44px"
  button-ghost:
    textColor: "{colors.on-felt}"
    rounded: "{rounded.card}"
    padding: "0 14px"
    height: "36px"
  card-face:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    width: "{spacing.card-w}"
  card-back:
    backgroundColor: "{colors.oxblood}"
    rounded: "{rounded.card}"
    padding: "4px"
  input:
    backgroundColor: "#fff"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    height: "44px"
    padding: "0 12px"
  consensus-mark:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  banner:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.on-felt}"
    padding: "8px 16px"
---

# Design System: Poolthok

## Overview

**Creative North Star: "The Card Table"**

Each screen is a felt table. A vote is a card placed face-down at your seat, and the reveal is the dealer turning every card over at once. Bottle-green casino cloth fills the whole viewport. It has a fine fibre grain and soft, uneven dye, and the table's racetrack lines are printed on it in white. Bright card stock carries everything you hold or read up close, and the card backs are oxblood. The density is low: a thin rail at the top, seats in the middle, your hand fanned along the bottom edge. It refuses grey list rows with coloured status dots.

**Key Characteristics:**
- The felt has three layers: a 220px tile of fine fractal grain (overlay), a 640px tile of broad dye mottling (soft-light), and the lamp-lit radial gradient. Both SVG filters use sRGB and a filter region equal to the tile, so the tiles join seamlessly and the green stays at the felt token.
- Printed table lines: a 2px on-felt line at 42% traces a racetrack (stadium, 999px radius) around the status, seats and controls, with a 1px betting line at 20% about 14px inside it. They are horizontal on desktop and vertical on phones and in the floating window, where they sit 14px in from the frame.
- Felt fills the full viewport. Cards and the join card are the only light surfaces.
- Bodoni Moda for numerals and the wordmark. System sans for everything else.
- Every card face has printed corner indices: top-left, and bottom-right rotated 180deg.
- State is shown by the card itself (empty slot, face-down back, face-up), never by a dot.

## Colors

Dark green felt, warm-white stock, and two printed inks: oxblood and brass.

### Primary
- **Bottle Felt** (felt): the table. It sits at the centre of a radial gradient into Deep Felt. It also fills the toggle track when on, the primary button on the join card, and the input focus ring.
- **Deep Felt** (felt-deep): the gradient edge and the page background colour.

### Secondary
- **Oxblood** (oxblood): card backs (under a fine white diamond lattice), the corner indices on every card face (the pips stay ink), the ring around your picked card, the reconnecting banner, the join card's "P" indices, and the input caret.
- **Marker** (marker): red marker ink for the handwritten notes and the loop drawn around the revealed majority. It is lighter than oxblood so it reads on felt (about 3:1, used only at handwriting sizes of 1.5rem or larger). This is the one exception to the Two Surfaces Rule.

### Tertiary
- **Brass** (brass): only the Consensus mark.

### Neutral
- **Rail Green** (rail): the top rail.
- **Felt Light / Felt Dim** (on-felt, on-felt-dim): text on felt. Dim is for the room code, status line, role labels, the Majority/Split label and the Average line. On-felt is also the focus outline and the `::selection` background.
- **Card Stock / Stock Edge** (stock, stock-edge): card faces, the join card, the primary button on felt. Stock Edge is the 1px bottom lip under cards, input borders, and the toggle track when off.
- **Ink / Ink Dim** (ink, ink-dim): text printed on stock.

**The Brass Is Consensus Rule.** Brass appears only when every vote matches: the pill, the brass majority number and the consensus celebration. It is never used for selection, focus or decoration.

**The Two Surfaces Rule.** Text sits either on felt (on-felt family) or on stock (ink family). Never put ink on felt or on-felt text on stock.

## Typography

**Display Font:** Bodoni Moda, opsz axis, weights 500 and 700 (with Didot, Bodoni 72, Georgia)
**Body Font:** system-ui stack, including Noto Sans Thai
**Hand Font:** Caveat 600 (with Bradley Hand and Segoe Print). Used only for the handwritten marker notes, the table's one gimmick.

**Character:** Bodoni Moda numerals feel like a printed deck. The sans stays plain so the cards carry the voice.

### Hierarchy
- **Display** (500, 4.5rem / 3.5rem under 640px, lining numerals): the revealed majority, the most-picked value. A tie of two or three values shows them all ("3 · 5"), labelled Split. More than three shows "–", labelled No majority.
- **Average line** (0.85rem on-felt-dim, number in Bodoni 700 1rem on-felt): "Average 4.5", small, under the majority label. It is hidden on Consensus, where it would repeat the number.
- **Headline** (700, 2.75rem): the "Poolthok" title on the join card.
- **Title** (700, 1.35rem): the rail wordmark.
- **Card pip** (500, 1.9–2.1rem desktop, 1.4–1.5rem mobile) and **card index** (700, 0.6–0.8rem): Bodoni on every card face.
- **Body** (400, 15px/1.45): UI text. The status line is 1.05rem with a 48ch max width and balanced wrapping.
- **Label** (600, 0.85–0.9rem, sentence case): field labels, the banner, the Average label.

**The Numerals Are Printed Rule.** Bodoni is only for card values, the majority, the average and the wordmark. It is never used for UI labels or buttons.

## Layout

The page is a single column. The rail is 10px 20px (8px 12px on mobile). The table is centred, max 980px wide, with a 36px gap (24px on mobile). Seats wrap in a centred row with 28px/24px gaps. Each seat is 112px wide (96px on mobile). The status block keeps a minimum height (126px, 110px under 640px, 88px in the floating window) equal to the tallest reveal, so the seats do not move on reveal. Facilitator controls sit under the seats. The hand fans along the bottom edge: each card is rotated 4deg per step from the centre, overlaps by -6px, and is partly clipped below the viewport. Under 640px, card and hand widths shrink through the `--card-w` / `--hand-w` tokens, and rail ghost buttons collapse to icons.

## Elevation & Depth

Depth comes from physical objects. Cards, the join card and the rail cast soft, diffuse shadows. Buttons are the only controls that have a shadow.

- **Card rest:** `0 1px 0 stock-edge, 0 6px 14px oklch(0 0 0 / 0.28)`. A stock lip plus a table shadow.
- **Card picked:** `0 0 0 2.5px oxblood, 0 16px 28px oklch(0 0 0 / 0.4)`. Lifted 30px and straightened.
- **Join card:** `0 2px 0 stock-edge, 0 24px 60px oklch(0 0 0 / 0.4)`.
- **Primary button:** `0 8px 20px oklch(0 0 0 / 0.25)`, smaller when pressed.
- **Rail:** `0 1px 0 oklch(1 0 0 / 0.06), 0 6px 18px oklch(0 0 0 / 0.25)`.

**The Soft Shadow Rule.** Shadows are blurred and ambient. Never use a hard offset shadow.

## Shapes

Card corners are 5px (`--card-r`, tight like real card stock), the join card is 10px, and pills are 999px. Cards are always 5:7. An empty seat is a 1.5px dashed outline at the card's size. A card back is stock with a 4px white border around the oxblood lattice (inner radius 2px).

## Components

### Buttons
- **Primary:** stock on felt, 44px tall. On the join card it is felt on stock. It lifts 1px on hover and sinks 1px when pressed. When disabled it becomes a 14% white wash with no shadow.
- **Ghost:** 36px tall (44px in the controls row). It has a 13% white fill at rest so it holds up on the textured felt, a 22% white hairline, 20% fill on hover, and 28% fill with a 45% hairline when pressed. The icon variant is a 36px square with an 18px stroked SVG (1.8 stroke). Icon-only buttons need an `aria-label`.

### Seat card (signature)
Each seat has a slot, a card that flips, a name and a role line. States: empty (dashed slot), down (oxblood back), up (rotateY 180deg over 0.7s, staggered 90ms per seat). When a player is offline, only the card slot dims (0.45). The card has `role="img"` and an aria-label. "(you)" sits outside the name's ellipsis so it never truncates.

### Hand
Seven stock cards. Hovering a card raises it 14px. The picked card straightens, rises 30px and gets the oxblood ring. After reveal the other cards dim with brightness 0.7.

### Join card
An oversized card (380px max, 44px top and bottom padding) with oxblood "P" corner indices. It deals in from below (0.7s). It sits on the same printed racetrack as the room (up to 1120×680, centred). Behind it, the whole deck (½ to 13, 96px cards, 56px on phones) fans out from under its top edge. The fan pivots 300% below each card and is spaced 13deg apart (10deg on phones). It is pinned to the card's top edge, so the same strip shows at any height (128px, or 106px on screens under 860px tall), and it fans open from a stacked deck after the card lands (0.9s, 40ms stagger). On devices that can hover, hovering a fan card draws it 26px up out of the fan along its own angle, with a deeper shadow (0.4s). It holds the field inputs (44px, felt focus ring at 20%) and a facilitator toggle (44×26 track).

### Join fans
There are two fans of the deck on the join page. The upper one is face-up and spreads from behind the card's top edge. The lower one is face-down (oxblood backs) and hangs from under the card's bottom edge: it pivots 200% above itself and is spaced -13deg apart (-10deg on phones). Hovering a card draws it out of its fan along its own angle (up for the top fan, down for the bottom). Clicking turns it over, so the top fan shows backs and the bottom fan shows faces. Vertical room is reserved for both fans (128/108px, 104/92px under 860px tall, 84/72px under 740px tall, 74/64px on phones), so the page never scrolls.

### Hide my hand (screen sharing)
A small on-felt switch labelled "Hide my hand" sits beside the hand (above it, right-aligned, under 860px). Its track is translucent black with a white hairline, and oxblood when on. When on, all seven hand cards turn face-down with a staggered 0.45s scaleX turn, the picked card stops lifting, and picking is paused until you switch it off. The "pick a card" note hides too. The setting is stored in sessionStorage and also applies to the floating window, in case that is in the shared screen.

### Handwritten notes (the gimmick)
These are red marker scribbles on the felt, as if someone annotated the table: Caveat 600 at 1.55rem in marker red, tilted 4–5deg, each with a hand-drawn arrow that draws itself in (0.6s). They are decorative (aria-hidden) and never carry information the UI doesn't already show.
- Join page: "no sign-up, just your name" points at the name field from the left, and "running grooming? flip this" points at the facilitator switch from the right. Hidden under 920px.
- Room: "pick a card, nobody peeks" sits beside the hand, pointing at it, until you vote. Hidden under 860px and in the floating window.
- Reveal: a loose marker loop draws itself around the majority (0.7s, after the cards turn). It is not drawn on Consensus, which has its own moment.

### Consensus moment
This is the one big celebration, all in brass, the colour reserved for consensus. It starts as the cards finish turning (about 0.9s) and is over by about 4.5s:
1. A brass light flash blooms from the number.
2. Wave 1: 56 tiny cards (stock faces and oxblood backs), brass sparks and dots burst out of the number and fall under gravity.
3. Wave 2: 40 more rain down across the whole table.
4. The racetrack lines glow brass.
5. Each revealed card hops 18px in a wave (70ms stagger), with a brass glint sweeping across its face.
6. The number pops (scale 1.25 with a brass glow) and stays brass.
7. The Consensus pill stamps down from 2.6x and a shine crosses it.
The confetti passes under the top rail. In the floating window everything travels 45% as far. Reduced motion turns all of it off, leaving the brass number and the pill.

### Cursor
Every clickable or hoverable thing shows the pointer: buttons (except disabled ones), the facilitator switch, and the join page's fan cards. Clicking a fan card turns it over. The hand-hide switch also shows the pointer.

### Floating window
"Pop out" (ghost button in the rail, Document Picture-in-Picture, shown only where the browser supports it) opens the same table in a small always-on-top window (360×540 to start) so it stays visible over Jira or the call. The tab keeps working, and both views stay in sync. While the window is open, the button shows its pressed state (14% white fill, 32% hairline) and a second click closes the window. The window is a compact copy of the room: a slim rail with the wordmark and the voted count, the status line or majority (2.75rem), seats, facilitator controls (38px), and the hand. Role toggles, Copy link and Leave stay in the tab. Card widths follow the window width (`--card-w: clamp(36px, 12vw, 66px)`, `--hand-w: clamp(30px, 12.5vw, 64px)`), so making the window bigger makes the cards bigger. The table scrolls when there are more seats than fit, and the hand stays pinned to the bottom.

### Role toggle, banner, consensus
The role toggle is a pill text button. On hover-capable devices it is hidden until you hover the seat. When pressed it is tinted, and it shows a strike-through on hover to signal removal. The banner is an oxblood strip with a pulsing dot (reconnecting). The consensus mark is a brass pill directly under the numeral. It replaces the label and the Average line.

Motion uses a single easing, `cubic-bezier(0.16, 1, 0.3, 1)`, and reduced motion turns all motion off.

## Do's and Don'ts

### Do:
- **Do** show every vote state as a card state: slot, back, face.
- **Do** print corner indices on every card face, with the bottom-right one rotated 180deg.
- **Do** set the Majority/Split label under the numeral and the small Average line under that, in plain sentence case.
- **Do** use on-felt for focus and selection on felt, and felt for focus on stock.

### Don't:
- **Don't** use status dots, grey list rows, or anything that shows a value before reveal.
- **Don't** use brass for anything except Consensus.
- **Don't** put small uppercase labels above headings, or hard offset shadows.
- **Don't** dim a whole seat when a player is offline. Dim only the card slot.
