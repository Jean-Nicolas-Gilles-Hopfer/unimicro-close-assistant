import { LitElement, css, html } from 'lit';
import type { UnimicroHost } from '@unimicro/plugin-types';
// These elements are registered for this view either way; this brings their types, and no code.
import type {} from '@unimicro/design-system/components';

export default class __VIEW_CLASS__ extends LitElement {
    /** Assigned by the platform before this element is connected. */
    host!: UnimicroHost;

    /** The view carries its own stylesheet, adopted on its own shadow root: the same code in either model. */
    static styles = css`
        section {
            padding: 2rem;
            color: var(--text-default);
            font-family: var(--font-family);
        }
    `;

    render() {
        return html`
            <section>
                <h1>__VIEW_TITLE__</h1>
            </section>
        `;
    }
}
