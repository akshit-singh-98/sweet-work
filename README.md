# Sweet Work — The Agentic Dev Starter Template

For AI Development / Agentic Development. This
is a starting point for building Astro sites the way Client-First builds
Webflow sites: token-driven styling, a disciplined component hierarchy,
and conventions strict enough that an agent (or a new dev) can pick up the
project and build consistently without guessing.

This template is intentionally generic — nothing in it is specific to any
one client or brand. Every value in `tokens.css` is a placeholder to be
replaced; every doc has bracketed sections to fill in.

## Quick start

1. Use this repo as a template (or copy its contents into a fresh repo).
2. `npm install`
3. `npm run dev` — should boot at `localhost:4321`.
4. `npm run lint:css` — should pass clean on an unmodified template.
5. Open `CLAUDE.md` and start following its build order from step 1.

## What's inside

- `CLAUDE.md` — the constraint document. Read this first; it's the source
  of truth for how this project should be built, and it's meant to be
  read by an agent as project memory, not just a person.
- `PRD.md`, `COMPONENT_INVENTORY.md`, `SITE_MAP.md` — blank reference docs
  to fill in per project, in that order, before writing component code.
- `src/styles/tokens.css` — design tokens (colors, type, spacing, radius).
  Replace every value with the real ones from your project's Figma file.
- `src/styles/layout.css` + `src/styles/utilities.css` — the class system:
  a fixed set of Client-First-flavored classes every page is built from
  (`section`, `container-large`, `grid-3col`, `flex-horizontal`,
  `gap-medium`, `margin-top-large`, `text-size-medium`, ...), all built off
  tokens.css. See it rendered live at `/class-system`, and CLAUDE.md's
  "Class system" for the rules. `CLASS_SYSTEM.md` explains why it's built
  this way, with answers to common questions.
- `src/styles/breakpoints.css` — the three breakpoints, defined once as
  named media queries (`@media (--tablet)`); `postcss.config.mjs` makes
  them available everywhere.
- `src/styles/base.css` — declares the cascade layer order
  (reset → base → layout → components → utilities) and holds the
  site-wide defaults (box-sizing and margin reset, responsive media, a
  visible focus ring, reduced-motion support, the skip-to-content link).
- `src/components/{global,sections,elements}/` — the Core/Layout/Element
  hierarchy. Ships empty of design components — they're built in step 3
  from your project's Figma. `global/ImagePlaceholder.astro` is the one
  exception: a reusable utility (not a design component) to drop into any
  section that needs an image before the real asset is exported.
- `src/pages/index.astro` + `src/styles/home.css` — a placeholder homepage
  describing Sweet Work itself. It deliberately skips BaseLayout and the
  real token/utility CSS, so pulling in Figma tokens never restyles it.
  Replace it entirely (and delete `home.css`) once building starts.
- `src/pages/style-guide.astro` — the living visual reference. Renders the
  real tokens (step 2) and components (step 3) as they're built,
  including a real desktop/tablet/mobile preview toggle; keep it current.
- `src/pages/class-system.astro` — the class system reference: every
  layout and utility class rendered live, plus page structure, cascade
  layers, and component conventions.
- `src/styles/style-guide.css` — fixed, independent colors/type/chrome for
  the style guide and class system pages' own UI (panels, nav, headings). Deliberately not part
  of the tokens.css/utilities.css system, so importing a real palette can
  never make the style guide itself unreadable — see CLAUDE.md's "Style
  guide chrome is independent."
- `src/lib/sanity.example.ts`, `.env.example` — optional Sanity connection
  pattern. Ignore both if this project doesn't use Sanity.
- `.stylelintrc.json` + `scripts/check-layers.mjs` — `npm run lint:css`
  enforces the "no hardcoded values" rule (every color/spacing/font-size/
  radius declaration must reference a CSS custom property) and fails if a
  component's styles aren't inside `@layer components`.

## The process

1. **PRD** — gather whatever's available (brief, transcripts, your own
   explanation, page count, integrations, CMS needs) and write `PRD.md`.
2. **Design tokens + style guide** — share the design file's style guide
   link; real values are pulled from its variables via the design-to-code
   tool (not screenshots, not guessing) into `tokens.css`, and
   `style-guide.astro` is updated to show all of them — adding new
   sections for anything extra the design defines (icons, borders,
   shadows). Non-public fonts: provide the files, or skip. Styles only;
   no components yet.
3. **Components** — share a Figma frame of laid-out components (or skip
   it, and the common set — buttons, navbar, footer — gets built). Every
   component is named in `COMPONENT_INVENTORY.md` first, with
   inconsistencies flagged rather than silently resolved, then built from
   the tokens and added to the style guide in its own section.
4. **Content modeling** — if anything is structured/dynamic content,
   draft the schema now, based on the PRD and inventory.
5. **Pages** — share the full page frame from Figma (plus a few lines on
   each section) and the whole page gets built in one pass from the
   tokens, utilities, and components. Missing images get placeholders
   sized exactly like the real ones, so exporting assets later is a
   straight swap.
6. **Visual QA** — diff each section against its Figma frame before
   calling it done.
7. Push to GitHub, connect to Cloudflare Pages (or Vercel/Netlify), and
   preview. Repeat steps 5–7 for each remaining page.

Full detail on each step lives in `CLAUDE.md`.

## Deployment

No adapter is pre-installed, so this builds as a static site anywhere by
default. For Cloudflare Pages (Finsweet's default), add the adapter:

```
npm install @astrojs/cloudflare
```

```js
// astro.config.mjs
import cloudflare from '@astrojs/cloudflare';
export default defineConfig({ output: 'server', adapter: cloudflare() });
```

Then connect the repo in the Cloudflare dashboard — it auto-detects Astro.

## Swapping the CSS approach

This template uses a hand-written class system (`layout.css` +
`utilities.css`) with Client-First-flavored names rather than Tailwind, on
the theory that it's the lowest learning curve for developers coming from
Webflow/Client-First, and small enough for an agent to know by heart. If
your team would rather use Tailwind instead, swap those two files for
Tailwind's config and update `CLAUDE.md`'s "Class system" section
accordingly; everything else in this template (tokens, component
structure, the build process) works the same either way.
