import { LitElement, css, html, nothing } from 'lit';
import type { ColumnContext, UnimicroHost } from '@unimicro/plugin-types';
import type {} from '@unimicro/design-system/components';
import { daysBetween } from '../../lib/domain/aging';
import { STEP_LABEL, today } from '../../lib/data';

const OPEN = new Set([42002, 42003, 42005, 42007]);
// Short step names so the tag fits the column (the full names are used in the page and headers).
const SHORT: Record<string, string> = { friendly_reminder: 'Påminnelse', reminder_with_fee: 'Purring', debt_collection_notice: 'Inkassovarsel', send_to_collection: 'Til inkasso' };

/** Invoice list column: days overdue as a coloured tag, from the row's own fields (no extra requests). */
export default class OverdueColumnView extends LitElement {
    host!: UnimicroHost;

    static properties = { text: { state: true }, type: { state: true } };

    static styles = css`
        :host { display: inline-block; font-family: var(--font-family); }
    `;

    private text = '';
    private type: 'default' | 'info' | 'success' | 'warning' | 'critical' = 'default';
    private unsubscribe?: () => void;

    connectedCallback() {
        super.connectedCallback();
        // The platform reuses this element across rows: render from every context change and keep no row state.
        this.unsubscribe = this.host.slot?.onContextChange<ColumnContext>((cell) => this.apply(cell));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        this.unsubscribe = undefined;
    }

    private apply(cell: ColumnContext | null | undefined) {
        const f = cell?.fields ?? {};
        const status = Number(f['StatusCode'] ?? 0);
        const rest = Number(f['RestAmount'] ?? 0);
        const due = String(f['PaymentDueDate'] ?? '').slice(0, 10);
        if (!OPEN.has(status) || rest <= 0 || !due) { this.text = ''; return; }
        const days = daysBetween(due, today());
        if (days <= 0) { this.text = days === 0 ? 'I dag' : `${-days} d igjen`; this.type = 'success'; return; }
        const step = days <= 14 ? 'friendly_reminder' : days <= 28 ? 'reminder_with_fee' : days <= 42 ? 'debt_collection_notice' : 'send_to_collection';
        this.text = `${days} d · ${SHORT[step]}`;
        this.type = STEP_LABEL[step].type;
    }

    render() {
        return this.text ? html`<uni-tag small type=${this.type}>${this.text}</uni-tag>` : nothing;
    }
}
