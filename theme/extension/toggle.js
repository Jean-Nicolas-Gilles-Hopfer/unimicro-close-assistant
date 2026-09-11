/*
 * Unimicro Dark Mode (BETA) – content script.
 *
 * Injects the dark token theme and the compatibility stylesheet, and adds a small light/dark switch at the bottom
 * right of the page. The choice is remembered per browser. Nothing is sent anywhere; the extension only adds CSS.
 */
(() => {
    const KEY = 'uniDarkMode';
    const root = document.documentElement;
    let styleEl = null;
    let cssText = null;

    async function loadCss() {
        if (cssText) return cssText;
        const [theme, compat] = await Promise.all([
            fetch(chrome.runtime.getURL('unimicro-dark.css')).then((r) => r.text()),
            fetch(chrome.runtime.getURL('compat.css')).then((r) => r.text()),
        ]);
        // Scope the token overrides to the attribute the toggle sets, so "light" really is the untouched app.
        cssText = theme.replace(/:root\s*\{/g, 'html[data-uni-theme="dark"] {') + '\n' + compat;
        return cssText;
    }

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
        } else {
            root.removeAttribute('data-uni-theme');
            if (styleEl) styleEl.textContent = '';
        }
        updateButton(dark);
    }

    let button = null;
    function updateButton(dark) {
        if (!button) return;
        button.textContent = dark ? '☀ Light mode' : '☾ Dark mode (BETA)';
        button.title = dark ? 'Switch back to the standard light theme' : 'Preview the dark theme (unofficial beta)';
    }

    function mountButton() {
        if (button || !document.body) return;
        button = document.createElement('button');
        button.type = 'button';
        button.id = 'uni-dark-mode-toggle';
        Object.assign(button.style, {
            position: 'fixed', right: '16px', bottom: '16px', zIndex: '2147483647',
            padding: '8px 14px', borderRadius: '99px', border: '1px solid rgba(127,127,127,.5)',
            background: 'var(--surface-default, #fff)', color: 'var(--text-default, #2b2b2b)',
            font: '500 13px/1.2 var(--font-family, Inter, sans-serif)', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,.25)',
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
