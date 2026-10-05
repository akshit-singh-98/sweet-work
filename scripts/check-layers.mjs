// Fails the build if a component's styles sit outside @layer components.
//
// Unlayered CSS beats every cascade layer (see src/styles/base.css), so a
// component <style> that forgets the wrapper would silently override
// utilities like hide-tablet or margin-top-large on its instances. Every
// <style> block in src/components/ and src/pages/ must contain exactly one
// top-level rule: @layer components { ... }.
//
// Exempt: pages whose styles are deliberately unlayered tool chrome that
// must never be restyled by the real system.
//
// Also checks the layer order itself is declared identically in its two
// homes: base.css and the inline <style> at the top of BaseLayout's <head>
// (which locks the order in before any stylesheet loads). If they drift,
// whichever the browser sees first wins and the other is silently ignored.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src/components', 'src/pages'];
const EXEMPT = new Set([
  'src/pages/index.astro', // placeholder homepage, styled by home.css only
  'src/pages/style-guide.astro', // style guide chrome
  'src/pages/class-system.astro', // class system reference chrome
]);

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith('.astro')) files.push(relative(process.cwd(), path));
  }
};
ROOTS.forEach(walk);

const problems = [];

const LAYER_ORDER_SOURCES = ['src/styles/base.css', 'src/layouts/BaseLayout.astro'];
const orders = LAYER_ORDER_SOURCES.map((file) => {
  const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, '');
  const match = src.match(/@layer\s+([\w-]+(?:\s*,\s*[\w-]+)+)\s*;/);
  return { file, order: match ? match[1].split(',').map((name) => name.trim()).join(', ') : null };
});
for (const { file, order } of orders) {
  if (!order) problems.push(`${file}  no @layer order statement found (expected "@layer reset, base, ...;")`);
}
if (orders.every((o) => o.order) && orders[0].order !== orders[1].order) {
  problems.push(
    `Layer order differs between ${orders[0].file} and ${orders[1].file}:\n` +
      orders.map((o) => `      ${o.file}: ${o.order}`).join('\n'),
  );
}
let checked = 0;
for (const file of files) {
  if (EXEMPT.has(file)) continue;
  checked++;
  const src = readFileSync(file, 'utf8');
  for (const match of src.matchAll(/<style(?![^>]*is:inline)[^>]*>([\s\S]*?)<\/style>/g)) {
    const css = match[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!css) continue;
    const ok = /^@layer components\s*\{/.test(css) && closesAtEnd(css);
    if (!ok) {
      const line = src.slice(0, match.index).split('\n').length;
      problems.push(`${file}:${line}  <style> content must be wrapped in a single @layer components { ... }`);
    }
  }
}

// True if the first { ... } block runs to the very end of the string, i.e.
// nothing sits outside the @layer wrapper.
function closesAtEnd(css) {
  let depth = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return i === css.length - 1;
  }
  return false;
}

if (problems.length) {
  console.error(`\n✖ Cascade layer check failed:\n\n  ${problems.join('\n  ')}\n\nSee CLAUDE.md "Class system" → "Cascade layers".\n`);
  process.exit(1);
}
console.log(`✓ Cascade layers: order matches in base.css and BaseLayout (${orders[0].order}); ${checked} component/page file(s) checked.`);
