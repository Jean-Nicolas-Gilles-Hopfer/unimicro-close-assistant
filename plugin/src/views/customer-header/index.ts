import { LitElement, css, html, nothing } from 'lit';
import type { HostError, UnimicroHost } from '@unimicro/plugin-types';
import type {} from '@unimicro/design-system/components';
import { buildAging, suggestDunningStep, type CounterpartAging } from '../../lib/domain/aging';
import { fetchOpenReceivables, fetchUnappliedCredits, nok, STEP_LABEL, today } from '../../lib/data';

type CustomerSubject = { ID?: number } | null | undefined;

function isHostError(error: unknown): error is HostError {
    return error instanceof Error && 'code' in error;
}

/**
 * Customer header slot: overdue balance for this customer, net of payments not yet matched to an invoice
 * (the same netting Unimicro's own "Forfalt" figure uses), with the suggested dunning step.
 */
export default class CustomerHeaderView extends LitElement {
    host!: UnimicroHost;

    static properties = { cp: { state: true }, loaded: { state: true } };

    static styles = css`
        :host { display: inline-flex; align-items: center; gap: 0.5rem; font-family: var(--font-family); color: var(--text-default); }
        .muted { color: var(--text-subtle, #6b7280); font-size: 0.85rem; white-space: nowrap; }
    `;

    private cp: CounterpartAging | null = null;
    private loaded = false;
    private unsubscribe?: () => void;
    private lastId = 0;

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = this.host.slot?.onContextChange<CustomerSubject>((c) => void this.load(c?.ID ?? 0));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        this.unsubscribe = undefined;
    }

    private async load(id: number) {
        if (!id || id === this.lastId) return;
        this.lastId = id;
        try {
            const [invoices, credits] = await Promise.all([fetchOpenReceivables(this.host, id), fetchUnappliedCredits(this.host, id)]);
            this.cp = buildAging(invoices, today(), credits).counterparts[0] ?? null;
        } catch (error) {
            if (isHostError(error) && error.code === 'host/revoked') return;
            this.host.log.warn('customer header: could not read open invoices', { id });
            this.cp = null;
        } finally {
            this.loaded = true;
        }
    }

    render() {
        if (!this.loaded) return nothing;
        const cp = this.cp;
        if (!cp || (cp.total === 0 && cp.credits === 0)) return html`<uni-tag small type="success">Ingen utestående</uni-tag>`;
        const step = suggestDunningStep(cp);
        const label = STEP_LABEL[step.step];
        return html`
            <span class="muted">Utestående ${nok(cp.netTotal)}</span>
            ${cp.netOverdue > 0
                ? html`<uni-tag small type=${label.type} title=${step.rationale}>Forfalt ${nok(cp.netOverdue)} · ${label.text}</uni-tag>`
                : html`<uni-tag small type="success" title=${step.rationale}>Ingenting reelt forfalt</uni-tag>`}
            ${cp.credits < 0 ? html`<uni-tag small type="warning" title="Innbetalinger eller kreditnotaer som ikke er koblet til faktura. Match dem under Åpne poster.">Umatchet ${nok(-cp.credits)}</uni-tag>` : nothing}
        `;
    }
}
