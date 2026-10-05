// Shared behavior for the tool pages' chrome (/style-guide and
// /class-system): live token values and the Desktop/Tablet/Mobile preview.
// Both pages use the same element ids (#sg-bpbar, #sg-live, #sg-frame-wrap,
// #sg-frame) and classes (.sg-bpbtn, [data-token]).

// Every [data-token] span shows the *live* resolved value of the
// custom property it names — read from computed style, not typed in
// by hand — so it can never drift from tokens.css, and it's already
// correct at whatever breakpoint is active (including inside the
// tablet/mobile preview iframe below, which is a separate document
// with its own viewport and runs this same script independently).
function updateTokenValues() {
  document.querySelectorAll<HTMLElement>('[data-token]').forEach((el) => {
    el.textContent = getComputedStyle(document.documentElement)
      .getPropertyValue(el.dataset.token ?? '')
      .trim();
  });
}
updateTokenValues();
window.addEventListener('resize', updateTokenValues);

// No server-side "is this an embed?" signal exists (static output),
// so this is decided client-side, on load, before anything is wired
// up: an embedded copy (loaded in the iframe below) keeps its own
// toggle hidden and never touches the iframe/frame-wrap elements.
const isEmbed = new URLSearchParams(window.location.search).has('embed');
if (!isEmbed) {
  const breakpointWidths: Record<string, number | null> = { desktop: null, tablet: 834, mobile: 390 };

  const bpbar = document.getElementById('sg-bpbar')!;
  const live = document.getElementById('sg-live')!;
  const frameWrap = document.getElementById('sg-frame-wrap')!;
  const frame = document.getElementById('sg-frame') as HTMLIFrameElement;
  const buttons = document.querySelectorAll<HTMLElement>('.sg-bpbtn');

  bpbar.removeAttribute('hidden');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const breakpoint = button.dataset.breakpoint || 'desktop';
      const width = breakpointWidths[breakpoint];

      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));

      if (width == null) {
        live.removeAttribute('hidden');
        frameWrap.setAttribute('hidden', '');
        return;
      }

      if (!frame.src) {
        const url = new URL(window.location.href);
        url.searchParams.set('embed', '1');
        frame.src = url.toString();
      }
      frame.style.width = `${width}px`;
      live.setAttribute('hidden', '');
      frameWrap.removeAttribute('hidden');
    });
  });
}
    
