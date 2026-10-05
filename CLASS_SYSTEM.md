# The Sweet Work class system

An overview of what the class system is, why it's built this way, and
answers to the questions people usually ask. For the rules an agent or
developer follows while building, see `CLAUDE.md` → "Class system"; for
every class rendered live, run the dev server and open `/class-system`.

## The short version

Every page is built from a fixed vocabulary of roughly 230 classes
(~55 layout, ~176 utility), so nobody — person or agent — needs to invent
new classes to build a page. Structure (layout, spacing, columns) comes
from shared classes in the markup; a component's own CSS only covers what
makes it look like itself (borders, backgrounds, hover states). Cascade
layers decide which rule wins, so there are no specificity fights.

## How it works

Every section follows the same shape:

```astro
<section class="section section_features section-top-large">
  <div class="container-large">
    <div class="grid-3col gap-large"> … </div>
  </div>
</section>
```

- **`section`** — top/bottom padding plus the side page gutter.
  `section_features` names the section and is the hook for any
  section-specific CSS.
- **`container-*`** — caps the content width and centers it. One per
  section.
- **`grid-*` / `flex-*`** — the layout itself. Each class works on its
  own; there's no bare `.grid` to forget.
- **Utilities** — `gap-*`, `margin-top-*`, `padding-x-*`,
  `heading-style-*`, `hide-tablet`, and so on.

## What changed from Client-First

| | Client-First (Webflow) | Sweet Work (Astro) |
|---|---|---|
| Spacing | Classes that only work in pairs (`margin-top margin-large`), spacer divs, `custom1/2/3` | One class per job (`margin-top-large`); `gap-*` is the default way to space items |
| Grids | Built in the Webflow designer, so no classes for them | `grid-1col` to `grid-6col`, uneven 2 : 1 grids, auto-fit card grids |
| Responsive | Overridden by hand at each breakpoint in the designer | The design tokens themselves shrink at each breakpoint, so most classes need no responsive variant |
| Conflicts between rules | Combo classes and specificity | Cascade layers: a utility always beats the component's own CSS |
| Enforcement | Team discipline | `npm run lint:css` fails on raw values, raw breakpoints, or component CSS outside its layer |

## Why it's good, technically

1. **Responsive values do the work.** Spacing, section padding, and
   heading sizes are CSS custom properties that get smaller values at
   tablet and mobile (`tokens.css`). `gap-xlarge` is 3rem on desktop,
   2.5rem on tablet, and 2rem on mobile with no extra classes. That's why
   only a few classes need `-tablet` / `-mobile-*` variants.
2. **Grids collapse by default.** `grid-4col` shows 4 columns on
   desktop, 2 on tablet, and 1 on mobile with nothing added. A variant
   like `grid-2col-tablet` replaces that default at its width and every
   width below it.
3. **No specificity fights.** Layers run `reset → base → layout →
   components → utilities`. A later layer always wins, whatever the
   selector specificity, so `<Card class="hide-tablet" />` works even
   though the card's CSS sets `display`. No `!important` anywhere.
4. **Class order in the HTML never matters.** Variant classes only set
   private custom properties (`--_grid-cols`, `--_section-top`, …), and
   those properties don't inherit, so the outcome never depends on which
   class is written first, and a nested grid or section never picks up
   its parent's settings.
5. **Components stay small.** Layout is in the markup, so a component's
   CSS is mostly its look. Every component accepts a `class` prop, so one
   instance can be adjusted (`<Card class="margin-top-large" />`) without
   creating a variant.
6. **It's predictable for AI agents.** Names follow `{property}-{value}`
   on one size scale (`none` → `xhuge`), so an agent can guess correct
   class names. `CLAUDE.md` gives a clear rule for when a class is
   missing: add the token, then add a step to an existing family — never
   invent a new family.
7. **The CSS stays small.** The whole system, including the style
   guide's own styling, is about 5 KB gzipped.
8. **Changing the design system is cheap.** Every class reads from the
   design tokens, so importing real Figma values restyles every page
   without touching any markup.
9. **Breakpoints are defined once.** `src/styles/breakpoints.css` holds
   the three breakpoints as named media queries (`@media (--tablet)`);
   PostCSS makes the names available in every stylesheet and component.
   The lint rejects raw pixel widths in `@media`.
10. **The rules are enforced, not just documented.** The lint rejects
    hard-coded colors, spacing, font sizes, radii, sizes (`width`,
    `height`, and their `min-`/`max-` forms), `box-shadow`, `z-index`,
    `font-family`, and `letter-spacing`. Percentages and viewport units
    are allowed, since they're relative sizing. It also fails if a
    component's CSS sits outside `@layer components`, or if the layer
    order in `base.css` and `BaseLayout` ever differ.

## Questions people ask

### Why one class per job? Isn't `margin-top margin-large` more flexible?

Paired classes only work when both are present and correct. Drop one and
nothing errors; it just silently does nothing. With `margin-top-large`
there's one thing to read, one thing to search for, and no way to
half-apply it. It also suits AI agents: `{property}-{value}` on one size
scale is predictable enough that an agent rarely guesses a class that
doesn't exist. More class names isn't a real cost, because they're all
generated from the same scale.

### Why always `section` → `container` → layout? Isn't that a lot of wrappers?

Each level does one job the others can't:

- **The section** handles everything edge to edge: the background, the
  top and bottom spacing, and the side gutter.
- **The container** decides how wide the content gets and centers it.
- **The layout** arranges what's inside.

Combine any two and you lose something. Put the background on the
container and it no longer reaches the screen edges. Put the max-width on
the section and the background is capped too. Put padding on the grid
and it doubles up with the container's. Keeping them separate means a
full-width background, a centered 80rem content area, and a 3-column
grid never get in each other's way.

It also makes every page read the same, so anyone can open an unfamiliar
section and know where its spacing, width, and layout are set. It's two
extra `div`s per section, which costs effectively nothing.

### Why can't components set their own layout?

If a card's CSS sets `display: grid` with 3 columns, then changing it for
one page means a new variant or an override. When layout sits in the
markup (`<Card class="grid-2col gap-small">`), the same component works
in different contexts and its CSS stays short. It also means there's one
way to make a grid instead of one per component, so it can't be
implemented slightly differently in each of 30 components.

### Why cascade layers instead of just keeping specificity low?

Low specificity only holds while everyone sticks to it, and one nested
selector breaks it. Layers decide the winner by position, not by how
specific a selector is. A utility class always beats component CSS, even
when the component uses a more specific selector. So `hide-tablet` or
`margin-top-large` on any element works every time, without
`!important`.

### Why so few responsive variants? Client-First lets you change anything per breakpoint.

In this system the design values themselves shrink at each breakpoint:
spacing, section padding, and heading sizes all get smaller
automatically. `gap-xlarge` already goes from 3rem to 2.5rem to 2rem. Most
per-breakpoint tweaks in Webflow exist only to make spacing smaller, and
that now happens automatically. Variants are kept for the things that
really change shape: column counts, flex direction, hiding elements, and
alignment.

### What if the design needs a value that doesn't exist?

Add it to `tokens.css` first. If it's needed as a class, add it as a new
step in an existing family (for example `gap-xxxlarge`) and list it on
`/class-system`. Don't invent a new family or a one-off value — the lint
blocks the latter anyway. This keeps the system complete: everything is
either in the list or deliberately added to it.

### Isn't shipping every utility class on every page wasteful?

The whole system is about 5 KB gzipped, including the style guide's own
styling, and it's cached after the first page load. Removing unused
classes per page would save less than a single image and add build
complexity.

### Why not just use Tailwind?

Tailwind's names map to raw CSS values, while these map to your Figma
design values. Projects arrive as Figma files with a style guide; here,
those design values become the class system directly, and the
Webflow-style naming (`section`, `container-large`, `heading-style-h2`)
is familiar to a Client-First team. You also get the style guide page,
the lint, and the layer rules, which Tailwind doesn't give you out of the
box.
