# global/

**Core layer** (Client-First equivalent). Reused-everywhere primitives with
no page or section context baked in — buttons, containers, dividers,
wrappers. If a component only makes sense inside one specific section, it
belongs in `elements/` or `sections/` instead, not here.

This folder ships without any design components — they're built in step 3
of the build order in `CLAUDE.md`, from your project's Figma (a components
frame if one exists, otherwise the common set: buttons, navbar, footer).
Follow the component setup in CLAUDE.md's "Class system" (live example at
`/class-system#components`): structure from layout/utility classes in the
markup, the component's own look in `@layer components`, variants as
`is-*` classes switched on by props, a `class` prop on the root, and
nothing hardcoded.

`ImagePlaceholder.astro` is the one file that ships here — a permanent
utility, not a design component. Use it wherever a section needs an image
but the real asset hasn't been exported yet (a token-colored box with a centered
image icon, `ratio` prop for aspect ratio); swap it for the real asset once
it exists. See CLAUDE.md's "Image placeholders" for the full convention.
