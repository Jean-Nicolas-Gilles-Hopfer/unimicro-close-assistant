/*
 * Unimicro Dark Mode (BETA) – content script.
 *
 * 1. Injects the dark token theme (scoped to html[data-uni-theme="dark"]) and the compatibility stylesheet.
 * 2. Runs a "sweep" that finds elements still painted with hard-coded light backgrounds, dark text or dark
 *    icons after the theme applied, and marks them so the stylesheet can recolour them with tokens. The sweep
 *    re-runs when the page changes (Angular renders continuously), debounced.
 * 3. Adds a light/dark switch bottom right; the choice is remembered in the browser.
 *
 * Nothing is sent anywhere; the extension only adds CSS and data attributes in your browser.
 */
(() => {
    const KEY = 'uniDarkMode';
    const root = document.documentElement;
    let styleEl = null;
    let cssText = null;
    let observer = null;
    let sweepTimer = 0;

    async function loadCss() {
        if (cssText) return cssText;
        const [theme, compat] = await Promise.all([
            fetch(chrome.runtime.getURL('unimicro-dark.css')).then((r) => r.text()),
            fetch(chrome.runtime.getURL('compat.css')).then((r) => r.text()),
        ]);
        cssText = theme.replace(/:root\s*\{/g, 'html[data-uni-theme="dark"] {') + '\n' + compat;
        return cssText;
    }

    // ---- sweep ---------------------------------------------------------------------------------------

    const SKIP = new Set(['CANVAS', 'IMG', 'VIDEO', 'SCRIPT', 'STYLE', 'LINK', 'META', 'SVG', 'PATH', 'G', 'CIRCLE', 'RECT', 'LINE', 'POLYLINE', 'POLYGON', 'USE', 'DEFS', 'CLIPPATH', 'MASK']);

    function parse(color) {
        const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/.exec(color || '');
        if (!m) return null;
        return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
    }
    const lum = (c) => (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;
    const isBluish = (c) => c.b > 120 && c.b > c.r + 40 && c.b > c.g + 20;

    function sweepNode(el) {
        if (SKIP.has(el.tagName) || el.id === 'uni-dark-mode-toggle') return;
        if (el.closest && el.closest('[data-uni-skip]')) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none') return;

        // Light backgrounds that survived the theme are literals: recolour to the default surface.
        const bg = parse(cs.backgroundColor);
        if (bg && bg.a > 0.5 && lum(bg) > 0.82) el.setAttribute('data-uni-fix-bg', '');
        else if (el.hasAttribute('data-uni-fix-bg') && !(bg && lum(bg) < 0.3)) el.removeAttribute('data-uni-fix-bg');

        // Dark text with direct text content: default text, or link colour when it is the brand blue.
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (hasText) {
            const fg = parse(cs.color);
            if (fg && fg.a > 0.5 && lum(fg) < 0.4) el.setAttribute('data-uni-fix-fg', isBluish(fg) ? 'link' : 'text');
        }

        // Inline SVG icons drawn with a dark currentColor.
        if (el.tagName === 'svg' || el.tagName === 'SVG') return;
        const svg = el.firstElementChild;
        if (svg && (svg.tagName === 'svg' || svg.tagName === 'SVG')) {
            const fg = parse(getComputedStyle(svg).color);
            if (fg && lum(fg) < 0.4) svg.setAttribute('data-uni-fix-icon', isBluish(fg) ? 'link' : 'icon');
        }
    }

    function sweepAll(scope) {
        const rootNode = scope && scope.querySelectorAll ? scope : document.body;
        if (!rootNode) return;
        const nodes = rootNode.querySelectorAll('*');
        const budget = 12000; // keep the sweep cheap on very large pages
        for (let i = 0; i < nodes.length && i < budget; i++) sweepNode(nodes[i]);
        // Shadow roots (design-system components, plugin views) are already token-based; skip them.
    }

    function scheduleSweep() {
        clearTimeout(sweepTimer);
        sweepTimer = setTimeout(() => sweepAll(document.body), 250);
    }

    function startObserver() {
        if (observer || !document.body) return;
        observer = new MutationObserver(scheduleSweep);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    }

    function stopObserver() {
        observer?.disconnect();
        observer = null;
        clearTimeout(sweepTimer);
        for (const el of document.querySelectorAll('[data-uni-fix-bg], [data-uni-fix-fg], [data-uni-fix-icon]')) {
            el.removeAttribute('data-uni-fix-bg');
            el.removeAttribute('data-uni-fix-fg');
            el.removeAttribute('data-uni-fix-icon');
        }
    }

    // ---- apply -----------------------------------------------------------------------------------------

    async function apply(dark) {
        if (dark) {
            const css = await loadCss();
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'uni-dark-mode-beta';
                (document.head || root).appendChild(styleEl);
            }
            styleEl.textContent = css;
            root.setAttribute('data-uni-theme', 'dark');
            const start = () => { sweepAll(document.body); startObserver(); };
            if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
        } else {
            root.removeAttribute('data-uni-theme');
            if (styleEl) styleEl.textContent = '';
            stopObserver();
        }
        updateButton(dark);
    }

    // ---- toggle button -----------------------------------------------------------------------------------

    let button = null;
    function updateButton(dark) {
        if (!button) return;
        button.textContent = dark ? '☀ Light mode' : '☾ Dark mode (BETA)';
        button.title = dark ? 'Switch back to the standard light theme' : 'Preview the dark theme (unofficial beta)';
        // Opposite of the current theme, so the switch reads clearly against the page.
        Object.assign(button.style, dark
            ? { background: '#f6f8f9', color: '#2b2b2b', border: '1px solid #d6dee5' }
            : { background: '#1b1f24', color: '#e8eaed', border: '1px solid #3a4552' });
    }

    function mountButton() {
        if (button || !document.body) return;
        button = document.createElement('button');
        button.type = 'button';
        button.id = 'uni-dark-mode-toggle';
        button.setAttribute('data-uni-skip', '');
        Object.assign(button.style, {
            position: 'fixed', right: '16px', bottom: '16px', zIndex: '2147483647',
            padding: '8px 14px', borderRadius: '99px', cursor: 'pointer',
            font: '500 13px/1.2 var(--font-family, Inter, sans-serif)',
            boxShadow: '0 2px 8px rgba(0,0,0,.35)',
        });
        button.addEventListener('click', async () => {
            const dark = root.getAttribute('data-uni-theme') !== 'dark';
            await chrome.storage.local.set({ [KEY]: dark });
            await apply(dark);
        });
        document.body.appendChild(button);
        updateButton(root.getAttribute('data-uni-theme') === 'dark');
    }

    chrome.storage.local.get(KEY).then(({ [KEY]: stored }) => {
        const dark = typeof stored === 'boolean' ? stored : window.matchMedia('(prefers-color-scheme: dark)').matches;
        void apply(dark);
    });

    if (document.body) mountButton();
    else document.addEventListener('DOMContentLoaded', mountButton, { once: true });
})();
