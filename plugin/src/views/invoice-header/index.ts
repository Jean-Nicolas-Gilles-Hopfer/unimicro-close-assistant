import { LitElement, css, html, nothing } from 'lit';
import type { UnimicroHost } from '@unimicro/plugin-types';
import type {} from '@unimicro/design-system/components';
import { bucketFor, daysBetween } from '../../lib/domain/aging';
import { fetchInvoice, nok, STEP_LABEL, today } from '../../lib/data';

/** The invoice the details page hands us; only the fields this view reads. */
type InvoiceSubject = { ID?: number; PaymentDueDate?: string; RestAmount?: number; StatusCode?: number } | null | undefined;

const OPEN = new Set([42002, 42003, 42005, 42007]);

function stepFor(daysOverdue: number): keyof typeof STEP_LABEL {
    if (daysOverdue <= 0) return 'none';
    if (daysOverdue <= 14) return 'friendly_reminder';
    if (daysOverdue <= 28) return 'reminder_with_fee';
    if (daysOverdue <= 42) return 'debt_collection_notice';
    return 'send_to_collection';
}

/** Invoice header slot: days overdue and the suggested next dunning step for this invoice. */
export default class InvoiceHeaderView extends LitElement {
    host!: UnimicroHost;

    static properties = { days: { state: true }, rest: { state: true }, open: { state: true } };

    static styles = css`
        :host { display: inline-flex; align-items: center; gap: 0.5rem; font-family: var(--font-family); color: var(--text-default); }
        .muted { color: var(--text-subtle, #6b7280); font-size: 0.85rem; }
    `;

    private days: number | null = null;
    private rest = 0;
    private open = false;
    private unsubscribe?: () => void;

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = this.host.slot?.onContextChange<InvoiceSubject>((inv) => void this.apply(inv));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        this.unsubscribe = undefined;
    }

    private async apply(inv: InvoiceSubject) {
        if (!inv?.ID) { this.days = null; return; }
        let due = String(inv.PaymentDueDate ?? '').slice(0, 10);
        let rest = inv.RestAmount;
        let status = inv.StatusCode;
        if (!due || rest === undefined || status === undefined) {
            try {
                const fresh = await fetchInvoice(this.host, inv.ID);
                if (fresh) { due = fresh.dueDate; rest = fresh.restAmount; status = fresh.statusCode; }
            } catch (error) { this.host.log.warn('invoice header: could not re-read invoice', { id: inv.ID }); }
        }
        this.open = OPEN.has(status ?? 0) && (rest ?? 0) > 0;
        this.rest = rest ?? 0;
        this.days = due ? daysBetween(due, today()) : null;
    }

    render() {
        if (this.days === null || !this.open) return nothing;
        const step = stepFor(this.days);
        const label = STEP_LABEL[step];
        const bucket = bucketFor(this.days);
        return html`
            <uni-tag small type=${label.type} title="Utestående ${nok(this.rest)}">
                ${this.days > 0 ? `${this.days} dager forfalt · ${label.text}` : `Forfaller om ${-this.days} dager`}
            </uni-tag>
            ${bucket === 'd90plus' ? html`<span class="muted">Vurder avskrivning eller inkasso</span>` : nothing}
        `;
    }
}
