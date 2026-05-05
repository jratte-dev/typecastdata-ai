---
name: Typecast Data AI
description: Industrial publication frame for John Ratté's long-form data engineering and AI writing, palette sourced from working New Orleans.
colors:
  paper: "#f5f0e4"
  paper-deep: "#ece2c9"
  ink: "#2c2820"
  ink-muted: "#6e6657"
  hairline: "#cfc4ad"
  brick: "#b85a32"
  brick-deep: "#92421f"
  cypress: "#4d7572"
  cypress-deep: "#385a58"
---

# Design System: Typecast Data AI

## 1. Overview

**Creative North Star: "The Working Engineer's Trade Journal"**

A long-form publication that looks like it was set by someone who reads more than they ship slide decks. The frame is industrial and printable: a tinted off-white page, an industrial grotesk for type, a single orange that earns its keep by rarity. It is adjacent to oxide.computer's house style on purpose, but the orange runs warmer, the byline is singular, and the humor is allowed to land. It explicitly rejects the SaaS-cream + purple-gradient AI-startup wardrobe, the centered-default-serif Substack column, the LinkedIn-circle headshot, and the consulting-firm logo wall.

The system is restrained at rest. Color is a tool of emphasis, not decoration. Motion is reactive, not performed. Empty space is allowed; padding is not symmetrical by reflex; a short post is allowed to look short. Personality lives in copy, type weight contrast, and the occasional well-aimed orange mark, not in props.

**Key Characteristics:**

- Tinted off-white page (not `#fff`); tinted near-black ink (not `#000`).
- One accent: a warm industrial orange, used on ≤10% of any given screen.
- Industrial sans for body and headings; mono reserved for code, captions, metadata, and signal.
- Flat by default. No shadows at rest. Depth from line, weight, and tonal contrast.
- Motion only in response to user state. No entrances, no scroll choreography, no parallax.
- Reading column 65–75ch. Body type sized for actual reading (17–19px on desktop), not for a "looks dense" screenshot.

## 2. Colors

A two-temperature neutral system (warm cream paper, warm ink) with two named accents: **Quarter Brick** (a deepened brick-orange) and **Cypress Shutter** (a desaturated weathered teal-green). The accents do different jobs and are never used interchangeably. Color strategy: **Restrained + sharp accent**, with one secondary accent reserved for structural marks.

The palette is sourced from working New Orleans, not the gift-shop version: French Quarter brick and ochre, weathered cypress shutters, old newsprint cream. No fleur-de-lis. No Mardi Gras purple-green-gold. No Bourbon Street neon.

### Primary

- **Quarter Brick** (`oklch(58% 0.165 32)`, hover `oklch(48% 0.16 28)`). Reserved for: the wordmark dot, post-link hover, footnote markers, focus rings, code-block keyword tokens. Anything the reader can interact with, plus the one place the brand mark lives. Never a background, never a card fill, never a gradient.

### Secondary

- **Cypress Shutter** (`oklch(52% 0.058 195)`, hover `oklch(42% 0.06 195)`). Reserved for *quiet structural accents*: the rules above and below pull-quotes, the 1px left rule on block quotes, the separator slash in the post metadata strip. Never used for an interactive element, never used as a body color, never used at saturation greater than ~6% chroma.

### Neutral

- **Paper** (`oklch(97.4% 0.014 80)`). Tinted cream, hue toward yellow. Default page surface. Never `#fff`.
- **Paper Deep** (`oklch(94.4% 0.022 78)`). One step warmer/deeper than Paper. Code-block backgrounds, figure plates.
- **Ink** (`oklch(20% 0.018 60)`). Tinted near-black, warm hue, very low chroma. Body type, headings.
- **Ink Muted** (`oklch(46% 0.014 60)`). One step lighter. Captions, metadata, dates, footnote bodies.
- **Hairline** (`oklch(82% 0.014 70)`). A 1px rule color, tinted to read as drawn ink rather than chrome.

### Named Rules

**The 10% Rule.** Quarter Brick covers no more than 10% of any rendered screen. Cypress Shutter covers no more than 5%. If a page reads as orange-y or as green-y, you have failed.

**The No-Pure Rule.** No `#000`. No `#fff`. Every neutral is tinted toward the warm-paper hue. Pure black on pure white is the aesthetic of a printer test page, and that is not what we are doing.

**The Hot-And-Quiet Rule.** Quarter Brick is *hot*: links, hovers, focus rings, footnote markers, brand mark. The reader's eye should treat orange as "you can do something here." Cypress Shutter is *quiet*: pull-quote rules, block-quote rule, metadata separators. The reader's eye should treat cypress as "this is structural, take it as given." Never assign the same role to both. If a status accent (success, warning, error) becomes necessary later, it does not get a third color until that need is proven; it lives in copy and weight first.

**The Two-Accent Maximum Rule.** Two accents and no more. A third accent is not on the table. The system pays its way by holding this line.

## 3. Typography

**Display Font:** Industrial grotesk [font pairing to be chosen at implementation; candidates: Söhne, Söhne Breit, Neue Haas Grotesk Display, GT America, Inter as last-resort fallback].
**Body Font:** Same family at body weight, or a paired neutral sans from the same foundry. No serif anywhere in body.
**Mono Font:** Industrial mono [to be chosen; candidates: Berkeley Mono, JetBrains Mono, IBM Plex Mono, Söhne Mono]. Reserved for code, inline code, captions, metadata, dates, and any string that is meant to read as data.

**Character:** Confident at large sizes, quiet at body size. Type does the personality work; the page chrome does not. Headlines are allowed to be long and to wrap; truncation is not a design feature.

### Hierarchy

(Sizes indicative; resolve concrete clamp() values at implementation.)

- **Display** (semibold, ~clamp(2.5rem, 6vw, 4.5rem), line-height 1.0–1.05): Article titles, occasionally the home-page tagline. One per page.
- **Headline** (medium, ~1.75rem, line-height 1.15): Section breaks within a long post.
- **Title** (medium, ~1.25rem, line-height 1.25): Archive entries, footnote section labels.
- **Body** (regular, 17–19px desktop / 16px mobile, line-height 1.55–1.65, max line length 65–75ch): The thing the entire site exists to deliver.
- **Label / Mono** (regular, ~0.875rem, letter-spacing tracked +0.02em on uppercase, mono family): Dates, post categories, code captions, "10 min read"-type metadata.

### Named Rules

**The No-Serif Rule.** Body type is never set in a serif. Display type is never set in a serif. This is a hard product constraint, not a stylistic preference.

**The Mono Earns It Rule.** Mono is not decoration. Mono signals data: a date, a duration, a code snippet, a measurement. If the string isn't data, it goes in the body sans.

**The Real Reading Size Rule.** Body type at desktop sits at 17–19px, not 14–15px. This is a long-form publication; we are not trying to fit four columns of marketing copy on a screenshot.

## 4. Elevation

Flat by default. The system uses no resting shadows; depth comes from tonal contrast (Ink on Paper), 1px hairline rules, and weight contrast in type. No card-stack metaphor, no floating panels, no soft drop shadows under buttons.

Where depth is needed in response to state (a focused input, a keyboard-focused link, a hovered button), express it through ink contrast or a 1–2px outline in Industrial Orange or Ink, never a blurred shadow.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows are never decoration. If a shadow appears, it is responding to a state (focus, drag, drop) and it is sharp, short, and tinted, not soft and gray.

**The Hairline-Not-Card Rule.** When two regions need to be separated, draw a hairline. Do not wrap one of them in a card.

## 5. Components

[To be authored as real components are introduced. The site currently has only the Next.js scaffold. Component primitives (post link, footnote, byline mark, archive row, code block, callout, navigation) will be defined as they are built and re-extracted via `/impeccable document` in scan mode.]

## 6. Do's and Don'ts

### Do

- **Do** tint every neutral toward the brand orange (chroma ~0.005). No pure `#fff`, no pure `#000`.
- **Do** keep Industrial Orange to ≤10% of any rendered screen. Treat it like a signal flare, not paint.
- **Do** set body type at a real reading size (17–19px desktop) with a 65–75ch column.
- **Do** use mono only for things that are actually data (dates, durations, code, measurements, identifiers).
- **Do** draw a hairline before reaching for a card.
- **Do** let a short page look short.
- **Do** let the headline carry the personality. The chrome should not be trying to be funny.

### Don't

- **Don't** clone oxide.computer. We share a lane (industrial publication, mono-aware), not a wardrobe. Quarter Brick runs deeper and redder than oxide-orange; the secondary cypress accent is ours, not theirs.
- **Don't** reach for any New Orleans cliché. No fleur-de-lis. No Mardi Gras purple-green-gold. No jazz-age display fonts. No Bourbon Street neon. No "Big Easy" anything. Place lives in the palette and in copy, never as costume.
- **Don't** use a purple-to-cyan gradient. Don't use any gradient. (PRODUCT.md anti-reference: "AI startup template.")
- **Don't** wrap the article column in a card on a tinted background. (PRODUCT.md anti-reference: "Generic Medium / Substack blog.")
- **Don't** add a circle-cropped headshot, an "Insights" tab, or a "Trusted by" logo wall. (PRODUCT.md anti-references: "LinkedIn-ified thought leadership" and "Corporate consulting site.")
- **Don't** use a glassmorphic surface, a glowing orb, an animated grid background, or any decorative blur.
- **Don't** introduce a second accent color "for status." Success, warning, and error are copy problems first; introduce a second hue only when proven necessary.
- **Don't** animate page entrances or scroll into view. Motion is a response to user state, not a performance.
- **Don't** use serif type anywhere in the system, including for "editorial" article bodies. Hard constraint.
- **Don't** use side-stripe borders (`border-left` >1px in orange or any other color) as a visual accent on callouts, alerts, or list items.
- **Don't** use gradient text. Emphasis comes from weight and size.
- **Don't** use an em dash. Use a comma, colon, semicolon, period, or parentheses. Also not `--`.
