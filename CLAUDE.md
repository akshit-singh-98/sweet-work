# CLAUDE.md — [Project Name]

This file is the project's constraint document — the code-world equivalent
of a Client-First conventions doc. Read this before touching any file,
whether you're a person or an agent. It's a living document: update it as
real decisions get made on this project, don't let it go stale.

This repo started from **Sweet Work** (an Agentic Dev starter template).
Nothing in this file is project-specific yet —
replace the bracketed placeholders and fill in the sections marked TODO as
the project takes shape.

## What this project is
[TODO — one paragraph: what's being built, for whom, once the PRD exists.]

## Build order (do not skip steps)

1. **PRD** (`PRD.md`) — written from whatever's available: a brief,
   meeting transcripts, your own explanation, page count, integrations,
   CMS needs. Commit it to the repo — don't leave it as a chat output.
2. **Design tokens + style guide** (`src/styles/tokens.css`,
   `src/pages/style-guide.astro`) — ask the user for a link to the design
   file's style guide / variables page (Figma, or whichever design tool
   they use), then pull tokens directly from its variable definitions
   using the design-to-code tool, not eyeballed from screenshots or
   measured by guessing at gaps. This is the first full pass, done before
   any component work starts — but not the last: the class system's
   values keep being calibrated against every component and page frame
   that comes after it (see "The framework bends to the design" below).
   - **Pull everything.** Every color and every heading/typography style
     that exists in the file — none get left out. The style guide
     previews headings as H1–H6, but Figma's real type scale isn't limited
     to six levels or to that naming: if the file defines additional
     heading or text styles under custom names (e.g. "Eyebrow", "Display",
     "H1 Alt"), pull each one in as its own token too. Two colors or type
     styles that look nearly identical are still different values — bring
     in both as distinct tokens rather than merging them into one to keep
     the token file tidy; consolidating is a design decision for a human
     to make later; don't make it silently while extracting tokens. Don't
     go looking in Figma for something that matches an existing
     placeholder token name (`--color-accent`, "H3", etc.) and stop once
     every placeholder slot has a match — inventory Figma's full set
     first, independent of what the placeholder happens to contain (see
     "Style guide values come from Figma, not the placeholder schema"
     below).
   - **Fonts.** If a typeface is publicly available (e.g. Google Fonts),
     load it. If it isn't, ask the user to provide the font files (placed
     in `public/fonts/`, loaded via `@font-face`) — but let them skip.
     When skipped, fall back to the closest system/public font stack and
     leave an `.sg-note` in the style guide's Typography section naming
     the missing font, so it's obvious the preview isn't final.
   - **Update the style guide in the same step.** Replace the placeholder
     data in `style-guide.astro` with the real tokens so every color, type
     style, spacing step, radius, and container width renders on the page.
     The style guide is flexible, not a fixed set of sections: if the
     design's style guide defines more than the default sections cover —
     icons, borders, shadows, gradients, grid/breakpoints, anything else —
     add a new section (plus a sidebar nav entry under "Foundations") for
     each one. Icons are the one exception to "pull it yourself": ask the
     user to export them into `src/assets/icons/` (see "Assets" below) and
     render whatever is there. The page's own UI (panels, nav, headings,
     labels) is styled independently of the tokens it's previewing — see
     "Style guide chrome is independent" below — so don't add new chrome
     markup using `text-color-*`, `background-color-*`, `heading-style-*`,
     or other real utility classes; use the `sg-*` chrome classes and
     `src/styles/style-guide.css` instead.
   - **Done when** the style guide page fully reflects the design's
     tokens and contains **styles only — no components yet**. From here
     on it's the living visual reference and QA surface for everything
     after it; keep it updated every time a token is added or changed.
3. **Components** (`COMPONENT_INVENTORY.md`, `src/components/`) — ask the
   user for a Figma frame with the components laid out (a components page
   or UI kit frame), and let them skip if one doesn't exist.
   - **Component frame provided:** everything in that frame becomes a
     component.
   - **Skipped:** build the common set every site needs — buttons,
     navbar, footer — from the page designs themselves.
   - **Inventory first.** Before writing component code, list each
     component, its variants, and its Figma source in
     `COMPONENT_INVENTORY.md`. This is also when you catch problems
     cheaply: duplicate/stale frames, a component that secretly has
     multiple visual variants, colors that are near-identical but not the
     same value. Flag anything inconsistent here — do not silently pick one
     and move on (see "Handling design inconsistencies" below).
   - **Then calibrate.** Before writing component code, do a calibration
     pass on the frame: compare the padding, gaps, radius, and sizes the
     components use against `tokens.css`, and update the values first (see
     "The framework bends to the design" below).
   - **Then build.** Pull each component's real spec via the design-to-code
     tool (see "Verifying against Figma" below) and build it using only the
     tokens and the existing layout/utility classes, following the
     component setup in "Class system" below (structure in classes, looks in
     `@layer components`, `class` prop on the root), in the right folder
     (see "Folder structure" below). Add each finished component to the style guide in
     its own section, under a "Components" group in the sidebar nav.
4. **Content modeling** — if any part of the project is structured/dynamic
   content rather than page-authored markup, draft the schema now (see
   `src/lib/sanity.example.ts`), based on the PRD and inventory. Don't
   retrofit this after pages are built. Every image field in the schema
   gets an alt text field and a "decorative" toggle alongside it, so
   editors make the same alt decision the agent does (see "Alt text"
   below).
5. **Pages** — ask the user for the full Figma frame of the page (e.g.
   the whole homepage frame) and build the entire page in one pass — no
   need to go section by section. Ask them for a few lines describing
   each section too (what it's for, anything dynamic, how it should
   behave) if they haven't given it; it's the difference between getting
   the page right the first time and a round of corrections. Start with a
   calibration pass: pull the whole frame's specs via the design-to-code
   tool, list every structural value it uses (container widths, section
   padding, grid gutters, gaps, text column widths), and update the class
   system's values to match before building (see "The framework bends to
   the design" below). Then build every section as `section` →
   `container-*` → layout classes (see "Class system" below), using the
   components from step 3, still pulling each section's real specs
   (container width, padding, borders) via the design-to-code tool. Where an image hasn't been
   exported yet, use an image placeholder sized exactly like the real
   image in the design — same width, aspect ratio, and radius — so
   dropping in the real asset later is a straight swap with no layout
   change (see "Image placeholders" below). Decide every image's alt text
   while building the page, placeholders included — decorative, written
   by the agent, or asked about (see "Alt text" below). This includes
   `src/pages/index.astro` — it currently ships as a placeholder homepage
   describing the Sweet Work template itself; replace it entirely with the
   project's real homepage once the PRD and design tokens exist, don't
   build around it. The placeholder is styled only by
   `src/styles/home.css` and doesn't use BaseLayout, so real tokens never
   restyle it — when replacing it, build the real homepage on BaseLayout
   like every other page and delete `home.css`.
6. **Visual QA** — diff each section against its real Figma frame before
   calling it done. A deploy preview tells you it shipped, not that it
   matches. Also check color contrast against the real (non-placeholder)
   values, that keyboard focus is visible on every interactive element,
   that any motion respects `prefers-reduced-motion` (see "Accessibility &
   responsive baseline" below), that the section's container width matches
   its real Figma frame (see "Container widths" below), that nothing
   overflows horizontally at any of the three breakpoints, and that every
   image has a settled alt decision — no `ALT: confirm` markers left (see
   "Alt text" below).

## The one hard rule

No hardcoded values. Every color, spacing unit, font size, and radius must
reference a token defined in `src/styles/tokens.css` (directly, or through
a class in `src/styles/layout.css` / `src/styles/utilities.css` that itself
references a token). If a value is needed that isn't in that file yet, stop and add it
there first — never inline it. `npm run lint:css` enforces this at build
time; it should fail if you break this rule, not just warn about it. The
same goes for sizing (`width`/`height` and their `min-`/`max-` forms),
`box-shadow`, `z-index`, `font-family`, and `letter-spacing`, and for
media queries (named breakpoints only — see "Accessibility & responsive
baseline"). Percentages and viewport units (`100%`, `100vh`) are relative
sizing, not design values, so they're allowed.

**Every length is in `rem`, never `px`** — tokens, component CSS, the tool
pages' chrome, borders, and breakpoints alike. Figma reports px, so
convert as you pull: divide by 16 (the browser default root size) — 32px
→ `2rem`, 1px → `0.0625rem`, 20px → `1.25rem`. At default settings the
result looks identical; the difference is that everything scales when a
visitor changes their browser's font size, instead of text growing inside
a layout that doesn't. Keep a design value's original px in its `figma:`
comment if it helps trace it back. `npm run lint:css` rejects `px`
anywhere.

The one exception is the tool pages' own chrome (`/style-guide`,
`/class-system`) — see "Style guide chrome is independent" below.

## Class system

Every page is built from a fixed set of classes, so nobody — person or
agent — has to invent new ones. The full reference, rendered live, is
**`/class-system`** (`src/pages/class-system.astro`); check it before
writing any CSS. The short version:

**Page structure — every section, every time:**

```astro
<section class="section section_features section-top-large">
  <div class="container-large">
    <div class="grid-3col gap-large"> … </div>
  </div>
</section>
```

- `.section` — required on every section. Top/bottom padding (default
  medium, override with `section-top-*` / `section-bottom-*`) plus the side
  page gutter. `section_[name]` identifies the section and is the hook
  for any section-specific CSS.
- `.container-{small|medium|large|full}` — one per section, caps width
  and centers.
- Layout — `grid-{1–6}col`, `grid-2col-wide-{left|right}`,
  `grid-auto-{small|medium|large}`, `flex-horizontal`, `flex-vertical`,
  spaced with `gap-*` and aligned with `align-items-*` /
  `justify-content-*`. Each class is complete on its own (no bare `.grid`).
- Content — components, and text styled with `heading-style-*` /
  `text-size-*`.

**Files:** `layout.css` (section, container, grid, flex) and
`utilities.css` (gap, margin, padding, type, color, radius, max-width,
media, position, visibility).

**Naming:** `{property}-{value}`, one class per job — never two classes
that only work as a pair. Every spacing family (`gap-*`, `margin-top-*`,
`margin-bottom-*`, `padding-*`, `padding-x-*`, `padding-y-*`) uses the one
`--space-*` scale: `none · xxsmall · xsmall · small · medium · large ·
xlarge · xxlarge · huge · xhuge`. Breakpoint variants append `-tablet`,
`-mobile-landscape`, or `-mobile-portrait` and apply at that width and
below; only grid columns, flex direction, `hide`, `max-width-full`, and
`text-align-{left|center}` have them. Grids already collapse by default
(table in `layout.css`), so variants are only for changing the default —
and a variant replaces the default at every width below its own too
(`grid-3col grid-2col-tablet` stays 2 columns on mobile).

**Cascade layers.** All project CSS lives in five layers, lowest priority
first: `reset` → `base` (both `base.css`) → `layout` (`layout.css`) →
`components` → `utilities` (`utilities.css`). A later layer always beats
an earlier one regardless of selector specificity, so a utility on an
element always wins over its component's CSS — `<Card
class="hide-mobile-landscape" />` works even though `.card` sets its own
`display`. The order is declared in `base.css` and inline as the first
thing in `BaseLayout`'s `<head>`; `npm run lint:css` fails if the two
ever differ.

- Every component's `<style>` must be wrapped in a single `@layer
  components { … }`. Unlayered CSS beats every layer, so a component that
  forgets the wrapper would silently override utilities.
  `npm run lint:css` runs `scripts/check-layers.mjs`, which fails the
  build if a wrapper is missing.
- The tool pages' chrome (`style-guide.css`) is deliberately unlayered so
  it wins over everything — see "Style guide chrome is independent".
- `!important` is never needed inside the layers; don't use it.

**Components** (full example on `/class-system#components`):

- Structure (display, direction, columns, gap, alignment) comes from
  layout/utility classes in the component's markup. The component's own
  CSS covers only what makes it look like itself: padding, border,
  background, radius, shadow, hover and transition states, internal
  details. Never re-implement a layout class in component CSS.
- Root class = the component's name in kebab-case, matching its file
  (`FeatureCard.astro` → `.feature-card`). Parts that need their own CSS
  are `{root}_{part}` (`.card_image`). Variants and states are `is-{name}`
  classes switched on by a prop (`.card.is-featured`, `.navbar_link.is-active`).
- Every component accepts a `class` prop and puts it on its root, so
  utilities can be added per instance.

**When a class doesn't exist:**

1. Structure or spacing? It almost certainly exists — check
   `/class-system` again.
2. A visual detail unique to one component? Component CSS, inside `@layer
   components`, using tokens.
3. A genuinely missing value? First check whether an existing step is
   still a placeholder that should just take the design's value (see "The
   framework bends to the design" below). If not, add the token to
   `tokens.css` first. If it's
   needed as a class too, add it as a new step in an existing family
   (e.g. `gap-xxxlarge`), with the same naming, and add it to
   `/class-system`.
4. Never invent a new class family, a one-off global class, an inline
   style, or `!important`. If something truly doesn't fit, stop and ask.

## The framework bends to the design

Sweet Work is a starter framework: every project begins by cloning it,
and then it has to become *that project's* system. The class system has
two halves, and they're treated in opposite ways:

- **The vocabulary is fixed.** Class names and families (`gap-*`,
  `container-*`, `section-top-*`, `grid-3col`, `max-width-*`, ...), the
  token names behind them (`--space-large`, `--container-large`,
  `--section-space-medium`, ...), the `section` → `container` → layout
  structure, and the cascade layers. This is the API every page and every
  agent relies on, so it stays the same from project to project — that's
  what makes a cloned project instantly familiar.
- **The values are the design's.** Every number behind that vocabulary
  ships as a placeholder and gets overwritten with whatever the project's
  Figma file actually uses. The options stay the same; what they measure
  changes. If the design's grids use a 2rem column gutter, the step the
  pages use for gutters holds 2rem — the design never gets rounded to
  whatever this template happened to ship with.

Grids are a good example of how this works. They have no gap of their own
(`layout.css` sets none); spacing between columns always comes from a
`gap-*` class, and every `gap-*` class reads the one `--space-*` scale. So
"our default gap is 1rem" really means "the pages reach for `gap-small`,
and `--space-small` is `1rem`." If Figma's standard gutter is 32px, the
fix is in the scale — make the step that the pages use for that gutter
hold `2rem` — not a different-looking class on every grid, and never an
inline `gap: 2rem`.

### What bends

Everything in `tokens.css` is a design value, including:

- **Spacing** — the `--space-*` scale behind every `gap-*`, `margin-*`,
  and `padding-*` class.
- **Section rhythm** — `--section-space-*` (`.section` padding) and
  `--padding-global` (the side gutter).
- **Widths** — `--container-*` (section content width), `--max-width-*`
  (text columns and other inner limits), and `--grid-min-*` (the minimum
  column width for `grid-auto-*`).
- **Type** — every size, weight, and line-height (see "Style guide values
  come from Figma, not the placeholder schema" below for type and color,
  which follow the same idea with fully custom names).
- **Radius, icon sizes, shadows, borders** — and any other category the
  design defines.
- **The responsive values** — the `@media (--tablet)` and
  `@media (--mobile-landscape)` blocks at the bottom of `tokens.css`.
  These are placeholder ratios too. When the user provides tablet or
  mobile frames, take the real values from them; until then, leave the
  ratios and say so.

A few values live in `layout.css` rather than as tokens, and they bend
the same way: the default grid collapse table (how many columns each
`grid-*col` keeps at each breakpoint) and the 2 : 1 split of
`grid-2col-wide-*`. If the design consistently does something else —
4-column grids that keep 2 columns on mobile, a 7 : 5 split — change the
default rather than adding a breakpoint variant to every instance. If
only one or two sections differ, use the existing variants on those
instances instead.

What does *not* bend: the three breakpoints (991px / 767px / 479px,
written in rem — see "Accessibility & responsive baseline"). A Figma file's
tablet or mobile frame width is a sample width, not a breakpoint — a
390px mobile frame doesn't mean there should be a 390px media query. If
the design really defines different breakpoints, ask before changing
them.

### When it happens: continuously, not once

There's no single step where this is "done." Step 2 does the first pass
from the design's style guide and variables, but a style guide almost
never shows how values are actually *used* — which container width the
sections sit in, what the standard grid gutter is, how much padding a
card has. That only shows up in real frames. So every new design the user
shares is a chance to calibrate the system:

- **Components frame (step 3)** — card padding, button padding, gaps
  inside components, radius, icon sizes.
- **Each page frame (step 5)** — container widths, section padding, grid
  gutters, gaps between stacked content, text column max-widths, auto-grid
  minimums.
- **Tablet / mobile frames, whenever they arrive** — the responsive token
  values.

**Before building a page or component, do a calibration pass.** Pull the
real specs for the whole frame via the design-to-code tool (see
"Verifying against Figma"), list every structural value it uses, and
compare that list against the current `tokens.css`. Update the system
first, then build the page with classes from the updated system. Don't
build the page against placeholder values and plan to fix it later — and
never get around a mismatch by hardcoding the design value locally or by
quietly using the nearest step.

### Placeholder vs. confirmed

Every value is in one of two states, and the state decides what you're
allowed to do with it:

- **Placeholder** — shipped with the template and not yet seen in any
  design. Overwrite it freely; that's what it's there for.
- **Confirmed** — set from a real design frame. Changing it now restyles
  everything already built on it, so it only changes on purpose (see
  rule 4 below).

Track this in `tokens.css` itself: when you set a value from the design,
add a short comment naming its source, e.g.
`--space-large: 2rem; /* figma: Homepage › Features grid gutter (32px) */`. A
token with no `figma:` comment is still a placeholder. That way anyone —
person or agent — can open the file and see at a glance how much of the
system has actually been calibrated.

### Fitting a design value into the system

For each value the design uses, in order:

1. **It matches an existing step** (within a couple of px of noise — see
   "Section padding" for what counts as noise) → use that step's class.
   If the step was still a placeholder, mark it confirmed.
2. **No match, but a step in the right place on the scale is still a
   placeholder** → change that step's value to the design's value and
   mark it confirmed. "The right place" means the step whose name fits
   the role and keeps the scale in ascending order: a design's 20px
   gutter goes into whichever placeholder step sits between its smaller
   and larger neighbours, not into `xhuge`.
3. **No match, and the steps around it are already confirmed** → add a new
   step between them: the token, the matching class in every family that
   uses that scale (for `--space-*`, that's every `gap-*`, `margin-*`, and
   `padding-*` family), its responsive values if the neighbours have them,
   and a row on `/class-system` — following "When a class doesn't exist"
   above.
4. **It conflicts with a confirmed value used for the same job** (the
   homepage's sections sit in 1200px, the About page's in 1240px) → don't
   silently overwrite either one. Treat it as a design inconsistency (see
   "Handling design inconsistencies"): flag it, build against the
   confirmed value, and ask the user which one is right. Overwrite a
   confirmed value only once the user confirms the design really changed.

Make sure the most common value gets the default. `.section` uses
`--section-space-medium` when no class is given, so the padding most of
the design's sections share goes there. In the same way, if most grids in
the design share one gutter, every grid should use the same `gap-*`
step for it, so the whole site stays consistent and a later change only
has to happen in one place.

Placeholder steps the design never uses stay in place — the class
families must stay complete — but flag them with an `.sg-note` on the
style guide (see "Style guide values come from Figma, not the
placeholder schema").

### After changing values

- **Check what was already built.** A token change restyles every page
  and component that uses it. Before moving on, re-check those pages and
  components against their frames.
- **Keep the tool pages current.** `/style-guide` and `/class-system`
  render the token values live, so a changed value shows up on its own —
  but a new step needs its own swatch or row, and any `.sg-note` about a
  value that's now confirmed should be removed.
- **Tell the user.** In your summary, list each value you changed, from
  what to what, and which frame it came from. These are system-wide
  changes, and the user should know about them even when they're
  routine.

## Style guide chrome is independent

`style-guide.astro` exists to preview this project's real tokens,
utilities, and components — so its own furniture (panels, nav, titlebar,
headings, captions, code snippets) must never depend on those same
tokens. If it did, importing a real palette from Figma would repaint the
tool's own UI along with the site — and a real palette is free to contain
things like light text meant for dark surfaces, or a dark "alt background"
value. That's not hypothetical: it's exactly what happened the first time
real colors replaced the placeholders here — light-grey text became
unreadable, and panel backgrounds that were meant to read as neutral grey
boxes turned dark blue with dark text still sitting on top of them.

The fix is `src/styles/style-guide.css` — a small, fixed set of `--sg-*`
custom properties (colors, type, spacing, radius), completely separate
from `tokens.css`, plus every "chrome" class built on them (`.sg-panel`,
`.sg-titlebar`, `.sg-eyebrow`, `.sg-h1`/`.sg-h2`, `.sg-lede`,
`.sg-caption`, `.sg-navlist a`, the `code` styling, the `/class-system`
demo frames, etc.). It's shared by `/style-guide` and `/class-system`, and
it reads only from its own variables — never from `tokens.css` or a
`layout.css` / `utilities.css` class. It's also deliberately *unlayered*
(see "Class system" → "Cascade layers"), so nothing in the real system —
not even the reset in `base.css` — can restyle it; the style guide opts
back into browser-default margins inside `.sg` for the same reason. This is
still "no hardcoded values" in spirit: every declaration still references
*some* custom property, just one scoped to the style guide instead of the
real design system, so `npm run lint:css` still enforces it.

The deliberate exception to that exception: elements that exist
specifically to preview a real value keep reading the real system, because
showing that value truthfully is the entire point of the page —

- A color swatch's fill (`background: var(--color-primary)`, etc.)
- Text rendered with a real utility class being demonstrated
  (`heading-style-h2`, `text-size-small`, `text-style-italic`,
  `text-color-accent`, `background-color-secondary`, ...)
- A spacing bar's width, or a radius swatch's `border-radius`
- A live component preview (anything added in build-order step 3)

When adding a new section to the style guide, ask which category a given
piece of markup falls into: if it's demonstrating a real token/utility/
component, wire it to the real system; if it's just the page's own label,
wrapper, or heading, use the `sg-*` chrome classes and variables instead.
Watch especially for a real utility class landing on the *same element*
as visible label text (e.g. applying `background-color-alt` directly to a
`<span>` that also contains a caption) — if the real value turns out to
be very dark or very light, the label painted on top of it can become
unreadable the same way the old panels did. Prefer showing the real value
in its own swatch/box and keeping the caption in independent chrome text
next to or below it, the way the "Color palette" and "Background color
utilities" sections do.

## Style guide values come from Figma, not the placeholder schema

The color palette, heading scale, text-size scale, text styles, weights,
and spacing scales in `style-guide.astro` (`paletteColors`, `headingScale`,
`textSizeScale`, `textStyles`, `textWeights`, `spaceScale`,
`sectionSpacing`, etc.) ship with a fixed placeholder set —
`--color-primary`, `--color-accent`, H1–H6, and so on. That set
demonstrates the *shape* the style guide can hold, not a target list to
fill in. Don't treat it as a checklist — don't search Figma for something
called "Accent" or "Alternate" just because the placeholder has a color by
that name, and don't stop pulling colors, headings, or spacing steps once
every placeholder slot has something in it.

Instead, treat the placeholder content as fully disposable: inventory
everything Figma's own variables/style guide actually define — every
color, every heading level and named text style, every spacing step — and
rebuild `tokens.css` and the style guide's data arrays to hold exactly
that set, under whatever names fit best (Figma's own names where they're
usable as-is, renamed where they're not — see "Naming" below). If Figma
has 20 colors, all 20 get a token and a swatch, not just the ones that
happen to map onto one of the 12 placeholder slots. If Figma defines 10
heading styles and 4 other text styles, all 14 get pulled in — the H1–H6
preview is a placeholder six-step scale, not a ceiling; add as many
heading/text-style entries as Figma actually has, under custom names if
Figma gives them custom names (see step 2 above).

Spacing is the one category where the *names* stay fixed: the `--space-*`
step names (`xxsmall` … `xhuge`) and `--section-space-*` names
(`small` … `xlarge`) are the API every spacing and section class is built
on, so renaming them would break every page. Put Figma's real values into
those steps instead — re-valuing placeholder steps first, and adding a
new step (token + the matching class in every spacing family + a row on
`/class-system`) only when the steps around a value are already confirmed.
Never bend a design value to the nearest step. If the placeholder has
steps Figma doesn't use, leave them unused and flag it on the style guide
with an `.sg-note` rather than deleting them silently. The full rules,
including how this keeps going after step 2, are in "The framework bends
to the design" above.

The page's **default sections stay** (`#colors`, `#typography`,
`#spacing`, `#radius`, `#containers`) — they're the living reference's
structure, and later work still needs a "where do I look for colors"
landing spot. They're a minimum, not a limit: any category the design's
style guide defines beyond them (icons, borders, shadows, ...) gets its
own new section in step 2, and each component gets its own section in
step 3. What changes is everything *inside* each
section: the arrays feeding it, and therefore every swatch, chip, and row
rendered from them, get replaced wholesale with the real Figma inventory.
None of the placeholder set — names, counts, or values — should survive
once real tokens exist for a category.

## Container widths

`tokens.css` ships three placeholder max-widths (`--container-small/
medium/large`, matched by `.container-small/medium/large` in
`layout.css`) — but real Figma files are rarely that tidy. A marketing
section, a blog-content column, and a form frame often each use a
different max-width, and none of them may match the placeholder scale.

Before building a section, check its actual frame width via the
design-to-code tool. If it doesn't match an existing `--container-*`
token (within a few px), first check whether a container token in the
right place on the scale is still a placeholder — if the design's main
content width is 1200px and `--container-large` is still the template's
80rem (1280px), `--container-large` becomes `75rem`. Only once the existing
containers are confirmed by real frames does a new width get its own new
token plus a matching `.container-*` class (see "The framework bends to
the design" above). Either way, don't stretch the closest existing one and
don't hardcode a one-off `max-width` in the component. The style guide's
"Containers" section (`#containers`) renders the current scale live so you
can see what's already covered before adding to it.

Every section's content should sit inside a `.container-*` wrapper
placed directly inside a `.section` (see "Class system" above) — the
section supplies the side page gutter, the container the width. That
combination is what keeps content centered, at the right width, and never
running edge-to-edge or off-screen on a narrow viewport. A full-bleed
background is fine (it goes on the section); the content *inside* it still
needs the container. For a wrapper that isn't a section (navbar, footer
bar), use `.padding-global` for the gutter.

## Section padding (vertical rhythm)

Check each section's actual top/bottom padding in Figma via the
design-to-code tool rather than eyeballing it. Real files usually settle
on a small handful of values (e.g. most sections use 80px top/bottom, a
few tighter ones use 48px) — treat that as the scale. Put those values
into the `--section-space-*` tokens (`small` / `medium` / `large` /
`xlarge`; `.section` defaults to `medium`, so the most common value goes
there) and apply them with `section-top-*` / `section-bottom-*` (re-valuing
a placeholder step or adding a new one, same rule as "Container widths"
above, if none of the existing ones fit). Revisit this with every new page
frame: the second page may show that the first page's values weren't the
whole scale.

Ignore minor noise: if most 80px sections actually measure 78–82px because
the file isn't perfectly clean, that's not a fourth padding value — it's
still 80px. Prioritize consistency across sections over reproducing every
individual frame's exact number.

Watch for accidental doubled padding. If two adjacent sections share (or
visually blend into) the same background and each independently applies
its own top/bottom padding, the gap between them doubles — that's a bug,
not a design decision. Compare the *actual rendered gap* between adjacent
frames in Figma against a single section's padding value: if the gap
matches one section's padding rather than the sum of both, only one of
the two sections should carry padding on that shared edge — the other
gets zero there (`section-top-none` or
`section-bottom-none`). Some designs genuinely do stack full padding on both
sides on purpose (usually visible as a background-color change or a
divider between the two sections) — when that's what Figma shows,
reproduce it; don't remove padding just because two sections happen to be
adjacent.

## Avoiding doubled borders

The same stacking problem applies to borders, not just padding. A row of
N columns, cards, or list items where every item has its own full border
will double the border weight wherever two items sit next to each other —
usually not what Figma actually shows. Before implementing a repeated
bordered set, check in Figma (via the design-to-code tool, not a
screenshot) whether the border is one shared divider between items or
each item is genuinely, independently bordered on all sides. A zero-gap
repeated set (columns touching edge-to-edge) is a strong signal it's meant
to be a single shared divider, not a full border per item. When it is a
shared divider, implement it that way — e.g. a border on only one side of
each item except the last, or a divider element between children — rather
than a full border on every item.

More generally, verify border color and width directly from Figma the
same way you'd verify a color or spacing value (see "Verifying against
Figma" below) — don't assume `1px` / `--color-secondary` because that's
what another border in the file uses. Different borders in the same file
are often intentionally different weights or colors.

## Verifying against Figma

Use the design-to-code tool to pull real specs (padding, radius, color,
type, border width/color) for a component before building it. Don't infer
specs from a screenshot (low-res screenshots read as more "rounded" or
differently proportioned than the real numbers) and don't infer a spacing
scale purely from measuring bounding-box gaps (text nodes' line-height and decorative
sub-elements make raw geometry noisy). Numbers that come from the actual
design-context pull are ground truth; numbers you measured or eyeballed
are a first draft — label them as such in `tokens.css` and confirm them
against a real component before treating them as final.

## Accessibility & responsive baseline

`src/styles/base.css` (imported once, in `BaseLayout.astro`, alongside
`tokens.css`, `layout.css`, and `utilities.css`) carries the site-wide
defaults that aren't opt-in classes and aren't tokens — the `reset` and
`base` cascade layers. It already gives every page, for free:

- A box-sizing reset, zeroed default element margins (spacing comes from
  `gap-*` / `margin-*` classes, never browser defaults), and responsive
  image/video defaults.
- A visible `:focus-visible` ring on keyboard focus (not mouse clicks).
- `prefers-reduced-motion` support — animations/transitions collapse for
  users who've asked for reduced motion, with no per-component effort.
- A skip-to-content link.

The skip link only works if every page provides its target: **every page's
top-level content wrapper must be `<main id="main-content">`.** If a page
is missing that id, the skip link silently does nothing — check for it
when adding a new page.

Breakpoints (`61.9375rem`/`47.9375rem`/`29.9375rem` — 991px/767px/479px,
the standard Webflow tablet/mobile-landscape/mobile-portrait cutoffs) are
defined once, in
`src/styles/breakpoints.css`, as named breakpoints: write `@media
(--tablet)`, `(--mobile-landscape)` or `(--mobile-portrait)`, never a
pixel value. `postcss.config.mjs` makes those names available in every
stylesheet and component `<style>` block, so nothing imports the file.
Never invent a fourth breakpoint. In class names they're always
`-tablet`, `-mobile-landscape`, `-mobile-portrait`. The style guide /
class-system chrome and the placeholder homepage keep literal values on
purpose (they're tools, independent of the project's design system).

## Handling design inconsistencies

Real Figma files are rarely perfectly consistent. When you find two
values that are clearly meant to be the same thing but aren't quite —
two near-identical dark colors, a light background paired with low-contrast
text in one instance but not others, a component whose instances don't
share the same treatment — do not silently average them, silently pick
one, or invent a new token to accommodate both. Flag it in
`COMPONENT_INVENTORY.md` as an open question, build against the version
that matches the rest of the system, and let a human confirm or fix it at
the source.

When the flag concerns something rendered on the style guide page, also
leave a visible note right there, next to the swatch/section it concerns —
don't make someone cross-reference `COMPONENT_INVENTORY.md` to notice
something's off. Use the `.sg-note` class (`src/styles/style-guide.css`): red text on a light red background,
fixed and independent of the real palette (like the rest of the style
guide's chrome — see "Style guide chrome is independent" above) so it
always reads as an alert no matter what the real accent/error colors turn
out to be. See the "Containers" section (`#containers`) for a live example.

## Folder structure

- `src/components/global/` — **Core** layer: buttons, containers,
  dividers — anything reused everywhere, with no page or section context
  baked in.
- `src/components/sections/` — **Layout** layer: full page sections (hero,
  feature grid, footer). Composed from global + element components.
- `src/components/elements/` — **Element** layer: smaller reusable pieces
  that show up inside multiple sections but aren't page-level on their own
  (cards, badges, list items).

Each folder has its own README explaining what belongs there.

## Naming

Component names and their Figma source mapping live in
`COMPONENT_INVENTORY.md` — keep it updated as components get built or
renamed. Names stay close to what a Client-First-trained dev would
recognize on sight (`card`, `navbar`, `button`) rather than Figma's raw
layer names. Class naming — utilities, component roots, `{root}_{part}`,
`is-{variant}` — is covered in "Class system" above.

## Assets

Icons, logos, and other exported graphics are exported manually from
Figma by a person, never auto-fetched or recreated by an agent. They live
in fixed locations so nothing has to guess where to find them:

- `src/assets/icons/` — icon SVGs
- `src/assets/logo/` — logo files
- `src/assets/images/` — photos and other raster assets

### Image placeholders

If a section needs an image and the real asset hasn't been exported yet,
use `<ImagePlaceholder />` (`src/components/global/ImagePlaceholder.astro`)
instead of leaving an empty box or a broken `<img>`. It's a token-colored
box with a centered image icon, inline SVG so it stays crisp at any size —
unlike the assets above, it's a build-time utility rather than a Figma
export, so reusing it doesn't need a person to manually export anything.
It's a utility, not a design component, so it doesn't get a style guide
section.

A placeholder must take up exactly the space the real image will, so the
swap is a one-line change. Pull the image's real specs from Figma (width
or column span, aspect ratio or fixed height, corner radius, crop) and put
them on a wrapper element in the section — never on the placeholder
itself:

```astro
<div class="hero_image">            <!-- Figma size, aspect-ratio, radius, overflow: hidden -->
  <ImagePlaceholder alt="Five team members around a workshop table" />
</div>

<!-- later, once the asset is exported — same alt, carried over: -->
<div class="hero_image">
  <img class="image-fill" src={teamPhoto.src} alt="Five team members around a workshop table" />
</div>
```

`alt` is required on the placeholder, so the alt decision is made while
the page is built, not remembered at swap time. With only `alt` set,
`<ImagePlaceholder />` fills its wrapper and inherits the
wrapper's radius; `.image-fill` (in `utilities.css`) makes the real image
do the same, with `object-fit: cover` so it crops like Figma's "Fill".
Only pass `ratio` for a standalone placeholder with no wrapper. Swap each
placeholder for the real asset — exported manually per the rule above — as
soon as it exists; don't leave it in place once a page ships.

### Alt text

Every image gets an explicit alt decision — including placeholders,
logos, inline SVGs, and CMS images. Sort each one into one of three
buckets:

- **Decorative → empty alt.** The image adds nothing a screen reader user
  would miss: background textures, abstract shapes and blobs, dividers,
  mood imagery that just fills space, or an icon sitting next to text
  that already says the same thing. Use `alt=""` — never leave the
  attribute off, or screen readers read out the file name. For inline
  SVGs, use `aria-hidden="true"` instead.
- **Meaningful → the agent writes it.** The image carries information:
  product shots, team or customer photos, screenshots, charts and
  diagrams, logos, or an image that's the only content of a link or
  button. Write the alt text yourself from the image itself (open the
  exported asset), its Figma layer name, and the copy around it.
  Describe what it communicates *in this context*, in one short sentence
  (roughly under 125 characters). Don't start with "Image of" / "Picture
  of", and don't repeat a caption or heading that's right next to it.
  Logos get the company name; a linked image describes where the link
  goes; a chart states its takeaway, with the full data in text nearby.
  Icon-only buttons and links get an `aria-label` describing the action.
- **Not sure → ask the user.** If you can't tell whether an image is
  decorative, or what it's meant to convey (a photo whose purpose depends
  on context you don't have, a graphic that might be data or might be
  decoration), don't guess. Mark it in the code with
  `{/* ALT: confirm with user */}` right above the image, collect every
  such image into one list — where it is, what it shows, and your best
  suggestion — and ask the user in a single message, not one at a time.
  Apply their answers and remove the markers. None may remain at visual
  QA (build-order step 6).

## Content (Sanity)

If this project uses Sanity, see `src/lib/sanity.example.ts` and
`.env.example` for the connection pattern. Rename `sanity.example.ts` to
`sanity.ts` and fill in your project ID/dataset once you have a real
Sanity project. Schemas are project-specific — define them as part of step
4 above, not this template.

## Status

- [ ] PRD written (`PRD.md`)
- [ ] Site map written, if multi-page (`SITE_MAP.md`)
- [ ] Design tokens pulled from Figma, style guide updated with them (styles only)
- [ ] Component inventory written (`COMPONENT_INVENTORY.md`)
- [ ] Components built and added to the style guide
- [ ] Content model drafted (if applicable)
- [ ] Cloudflare (or other host) deployment wired up
