import { LitElement, css, html, nothing } from 'lit';
import type { HostError, UnimicroHost } from '@unimicro/plugin-types';
import type {} from '@unimicro/design-system/components';
import { applyCreditsFifo, buildAging } from '../../lib/domain/aging';
import { buildForecast } from '../../lib/domain/forecast';
import { fetchBankBalance, fetchMonthlyOpex, fetchOpenPayables, fetchOpenReceivables, fetchUnappliedCredits, nok, today } from '../../lib/data';

function isHostError(error: unknown): error is HostError {
    return error instanceof Error && 'code' in error;
}

interface Figures { bank: number; overdue: number; overdueCount: number; lowest: number; lowestWeek: number; endClosing: number }

/** Dashboard widget: cash today, overdue receivables, and the low point of the next 13 weeks. */
export default class CashWidgetView extends LitElement {
    host!: UnimicroHost;

    static properties = { figures: { state: true }, failure: { state: true } };

    static styles = css`
        :host { display: block; color: var(--text-default); font-family: var(--font-family); padding: 1rem 1.25rem; }
        h3 { margin: 0 0 0.5rem; font-size: 1.1rem; font-weight: 600; }
        .rows { display: grid; gap: 0.6rem; padding: 0.5rem 0; }
        .row { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
        .label { color: var(--text-subtle, #6b7280); font-size: 0.85rem; }
        .value { font-weight: 600; font-size: 1.1rem; white-space: nowrap; }
        .critical { color: var(--color-critical, #b91c1c); }
        .foot { margin-top: 0.5rem; }
    `;

    private figures: Figures | null = null;
    private failure = '';

    async connectedCallback() {
        super.connectedCallback();
        try {
            const asOf = today();
            const [receivables, credits, payables, bank, opex] = await Promise.all([
                fetchOpenReceivables(this.host), fetchUnappliedCredits(this.host), fetchOpenPayables(this.host), fetchBankBalance(this.host), fetchMonthlyOpex(this.host, Number(asOf.slice(0, 4))),
            ]);
            const aging = buildAging(receivables, asOf, credits);
            const f = buildForecast({ asOf, bankBalance: bank.total, receivables: applyCreditsFifo(receivables, credits), payables, monthlyFixedCosts: Math.abs(opex.average) });
            const lowestIdx = f.weeks.findIndex((w) => w.weekStart === f.lowestClosing.weekStart);
            this.figures = {
                bank: bank.total, overdue: aging.netOverdue, overdueCount: aging.counterparts.filter((c) => c.netOverdue > 0).length,
                lowest: f.lowestClosing.amount, lowestWeek: lowestIdx + 1, endClosing: f.endClosing,
            };
        } catch (error) {
            if (isHostError(error) && error.code === 'host/revoked') return;
            this.failure = 'Kunne ikke lese tall.';
            this.host.log.error(error, { view: 'cash-widget' });
        }
    }

    render() {
        if (this.failure) return html`<uni-alert small type="warning">${this.failure}</uni-alert>`;
        const f = this.figures;
        if (!f) return html`<span class="label">Henter likviditet…</span>`;
        return html`
            <h3>Likviditet og purring</h3>
            <div class="rows">
                <div class="row"><span class="label">Bank i dag</span><span class="value">${nok(f.bank)}</span></div>
                <div class="row"><span class="label">Forfalte kundefordringer</span><span class="value critical">${nok(f.overdue)}</span></div>
                <div class="row"><span class="label">Kunder å purre</span><span class="value">${f.overdueCount}</span></div>
                <div class="row"><span class="label">Lavpunkt (uke ${f.lowestWeek} av 13)</span><span class="value ${f.lowest < 0 ? 'critical' : ''}">${nok(f.lowest)}</span></div>
                <div class="row"><span class="label">Saldo om 13 uker</span><span class="value">${nok(f.endClosing)}</span></div>
            </div>
            <div class="foot">
                <uni-button small variant="secondary" @click=${() => void this.host.navigation.navigateTo('/plugins/sales/close-assistant/close-assistant')}>Åpne Close Assistant</uni-button>
            </div>
            ${nothing}
        `;
    }
}
