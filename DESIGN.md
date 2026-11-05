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
  card: "8px"
  join-card: "18px"
  pill: "999px"
spacing:
  card-w: "78px"
  hand-w: "76px"
  card-w-sm: "52px"
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

Each screen is a felt table. A vote is a card placed face-down at your seat, and the reveal is the dealer turning every card over at once. Bottle-green felt with a faint woven noise fills the whole viewport. Bright card stock carries everything you hold or read up close, and the card backs are oxblood. The density is low: a thin rail at the top, seats in the middle, your hand fanned along the bottom edge. It refuses grey list rows with coloured status dots.

**Key Characteristics:**
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
- **Oxblood** (oxblood): card backs (under a fine white diamond lattice), the reconnecting banner, the join card's "P" indices, and the input caret.

### Tertiary
- **Brass** (brass): only the Consensus mark.

### Neutral
- **Rail Green** (rail): the top rail.
- **Felt Light / Felt Dim** (on-felt, on-felt-dim): text on felt. Dim is for the room code, status line, role labels and the Average label. On-felt is also the focus outline and the `::selection` background.
- **Card Stock / Stock Edge** (stock, stock-edge): card faces, the join card, the primary button on felt. Stock Edge is the 1px bottom lip under cards, input borders, and the toggle track when off.
- **Ink / Ink Dim** (ink, ink-dim): text printed on stock.

**The Brass Is Consensus Rule.** Brass appears only when every vote matches. It is never used for selection, focus or decoration.

**The Two Surfaces Rule.** Text sits either on felt (on-felt family) or on stock (ink family). Never put ink on felt or on-felt text on stock.

## Typography

**Display Font:** Bodoni Moda, opsz axis, weights 500 and 700 (with Didot, Bodoni 72, Georgia)
**Body Font:** system-ui stack, including Noto Sans Thai

**Character:** Bodoni Moda numerals feel like a printed deck. The sans stays plain so the cards carry the voice.

### Hierarchy
- **Display** (500, 4.5rem / 3.5rem under 640px, lining numerals): the revealed average.
- **Headline** (700, 2.75rem): the "Poolthok" title on the join card.
- **Title** (700, 1.35rem): the rail wordmark.
- **Card pip** (500, 1.9–2.1rem desktop, 1.4–1.5rem mobile) and **card index** (700, 0.6–0.8rem): Bodoni on every card face.
- **Body** (400, 15px/1.45): UI text. The status line is 1.05rem with a 48ch max width and balanced wrapping.
- **Label** (600, 0.85–0.9rem, sentence case): field labels, the banner, the Average label.

**The Numerals Are Printed Rule.** Bodoni is only for card values, the average and the wordmark. It is never used for UI labels or buttons.

## Layout

The page is a single column. The rail is 10px 20px (8px 12px on mobile). The table is centred, max 980px wide, with a 36px gap (24px on mobile). Seats wrap in a centred row with 28px/24px gaps. Each seat is 112px wide (96px on mobile). The status block keeps a 92px minimum height so the reveal does not shift the layout. Facilitator controls sit under the seats. The hand fans along the bottom edge: each card is rotated 4deg per step from the centre, overlaps by -6px, and is partly clipped below the viewport. Under 640px, card and hand widths shrink through the `--card-w` / `--hand-w` tokens, and rail ghost buttons collapse to icons.

## Elevation & Depth

Depth comes from physical objects. Cards, the join card and the rail cast soft, diffuse shadows. Buttons are the only controls that have a shadow.

- **Card rest:** `0 1px 0 stock-edge, 0 6px 14px oklch(0 0 0 / 0.28)`. A stock lip plus a table shadow.
- **Card picked:** `0 0 0 2px ink, 0 16px 28px oklch(0 0 0 / 0.4)`. Lifted 30px and straightened.
- **Join card:** `0 2px 0 stock-edge, 0 24px 60px oklch(0 0 0 / 0.4)`.
- **Primary button:** `0 8px 20px oklch(0 0 0 / 0.25)`, smaller when pressed.
- **Rail:** `0 1px 0 oklch(1 0 0 / 0.06), 0 6px 18px oklch(0 0 0 / 0.25)`.

**The Soft Shadow Rule.** Shadows are blurred and ambient. Never use a hard offset shadow.

## Shapes

Card corners are 8px, the join card is 18px, and pills are 999px. Cards are always 5:7. An empty seat is a 1.5px dashed outline at the card's size. A card back is stock with a 4px white border around the oxblood lattice (inner radius 5px).

## Components

### Buttons
- **Primary:** stock on felt, 44px tall. On the join card it is felt on stock. It lifts 1px on hover and sinks 1px when pressed. When disabled it becomes a 14% white wash with no shadow.
- **Ghost:** 36px tall (44px in the controls row), with a 16% white hairline border and an 8% white fill on hover. The icon variant is a 36px square with an 18px stroked SVG (1.8 stroke). Icon-only buttons need an `aria-label`.

### Seat card (signature)
Each seat has a slot, a card that flips, a name and a role line. States: empty (dashed slot), down (oxblood back), up (rotateY 180deg over 0.7s, staggered 90ms per seat). When a player is offline, only the card slot dims (0.45). The card has `role="img"` and an aria-label. "(you)" sits outside the name's ellipsis so it never truncates.

### Hand
Seven stock cards. Hovering a card raises it 14px. The picked card straightens, rises 30px and gets the ink ring. After reveal the other cards dim with brightness 0.7.

### Join card
An oversized card (380px max, 44px top and bottom padding) with oxblood "P" corner indices. It deals in from below (0.7s). It holds the field inputs (44px, felt focus ring at 20%) and a facilitator toggle (44×26 track).

### Role toggle, banner, consensus
The role toggle is a pill text button. On hover-capable devices it is hidden until you hover the seat. When pressed it is tinted, and it shows a strike-through on hover to signal removal. The banner is an oxblood strip with a pulsing dot (reconnecting). The consensus mark is a brass pill below the Average label.

Motion uses a single easing, `cubic-bezier(0.16, 1, 0.3, 1)`, and reduced motion turns all motion off.

## Do's and Don'ts

### Do:
- **Do** show every vote state as a card state: slot, back, face.
- **Do** print corner indices on every card face, with the bottom-right one rotated 180deg.
- **Do** set the Average label under the numeral, in plain sentence case.
- **Do** use on-felt for focus and selection on felt, and felt for focus on stock.

### Don't:
- **Don't** use status dots, grey list rows, or anything that shows a value before reveal.
- **Don't** use brass for anything except Consensus.
- **Don't** put small uppercase labels above headings, or hard offset shadows.
- **Don't** dim a whole seat when a player is offline. Dim only the card slot.
