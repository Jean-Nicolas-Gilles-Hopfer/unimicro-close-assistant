import { LitElement, html, nothing, unsafeCSS } from 'lit';
import type { HostError, UnimicroHost } from '@unimicro/plugin-types';
import type {} from '@unimicro/design-system/components';
import styles from './view.css?inline';
import { applyCreditsFifo, buildAging, suggestDunningStep, BUCKETS, type AgingReport, type Bucket, type CounterpartAging, type DunningStep } from '../../lib/domain/aging';
import { buildForecast, type Forecast } from '../../lib/domain/forecast';
import type { Remediation } from '../../lib/domain/revision';
import { fetchBankBalance, fetchMonthlyOpex, fetchOpenPayables, fetchOpenReceivables, fetchUnappliedCredits, nok, STEP_LABEL, today, type BankBalance } from '../../lib/data';
import { runRevisionChecks, type RevisionResult } from '../../lib/revision-checks';
import { draftReminder } from '../../lib/reminders';

function isHostError(error: unknown): error is HostError {
    return error instanceof Error && 'code' in error;
}

const BUCKET_NB: Record<Bucket, string> = {
    notDue: 'Ikke forfalt', d1_30: '1–30 dager', d31_60: '31–60 dager', d61_90: '61–90 dager', d90plus: 'Over 90 dager',
};

const SECTION_NB: Record<string, string> = {
    'Opening balance total': 'Åpningsbalansen går ikke i null',
    'Income statement opening balance': 'Resultatkontoer har inngående balanse',
    'Receivables': 'Kundefordringer avviker fra reskontro',
    'Liability accounts': 'Gjeldskonto med debetsaldo',
    'Unmatched customer payments': 'Umatchede innbetalinger fra kunder',
    'VAT returns': 'Mva-melding ikke levert',
};

const SEVERITY_TAG: Record<Remediation['severity'], 'critical' | 'warning' | 'info'> = { error: 'critical', warning: 'warning', info: 'info' };

/**
 * Close Assistant overview page: receivables aging with dunning advice (net of unmatched payments),
 * a 13-week cash forecast, and revision checks with explanations and proposed corrections.
 * Everything is read through host.api as the signed-in user; nothing is written from this page.
 */
export default class CloseAssistantView extends LitElement {
    host!: UnimicroHost;

    static properties = {
        companyName: { state: true },
        aging: { state: true },
        forecast: { state: true },
        bank: { state: true },
        revision: { state: true },
        loading: { state: true },
        failure: { state: true },
        draftFor: { state: true },
        draftText: { state: true },
        drafting: { state: true },
    };

    static styles = unsafeCSS(styles);

    private companyName = '';
    private aging: AgingReport | null = null;
    private forecast: Forecast | null = null;
    private bank: BankBalance | null = null;
    private revision: RevisionResult | null = null;
    private loading = true;
    private failure = '';
    /** Customer the reminder drawer is open for, if any. */
    private draftFor: CounterpartAging | null = null;
    private draftText = '';
    private drafting = false;

    async connectedCallback() {
        super.connectedCallback();
        try {
            const context = await this.host.getContext();
            this.companyName = context.company.name;
            const asOf = today();
            const year = Number(asOf.slice(0, 4));
            const [receivables, credits, payables, bank, opex] = await Promise.all([
                fetchOpenReceivables(this.host),
                fetchUnappliedCredits(this.host),
                fetchOpenPayables(this.host),
                fetchBankBalance(this.host),
                fetchMonthlyOpex(this.host, year),
            ]);
            this.aging = buildAging(receivables, asOf, credits);
            this.bank = bank;
            // Money already received (unmatched payments) must not be forecast as an inflow again.
            this.forecast = buildForecast({ asOf, bankBalance: bank.total, receivables: applyCreditsFifo(receivables, credits), payables, monthlyFixedCosts: Math.abs(opex.average) });
            this.loading = false;
            // The revision checks are a second round trip; the page is useful before they arrive.
            this.revision = await runRevisionChecks(this.host, year, this.aging.credits);
        } catch (error) {
            if (isHostError(error) && error.code === 'host/revoked') return;
            this.failure = 'Kunne ikke lese regnskapsdata. Prøv igjen, eller sjekk at du har tilgang til salg og regnskap.';
            this.host.log.error(error, { view: 'close-assistant' });
        } finally {
            this.loading = false;
        }
    }

    private openCustomer(id: number) {
        void this.host.navigation.navigateTo(`/sales/customer/${id}`);
    }

    private async openDraft(cp: CounterpartAging, step: DunningStep) {
        this.draftFor = cp;
        this.draftText = '';
        this.drafting = true;
        try {
            this.draftText = await draftReminder(this.host, cp, step, this.companyName || 'oss');
        } catch (error) {
            if (isHostError(error) && error.code === 'host/revoked') return;
            this.draftText = 'Tekstgenerering er ikke tilgjengelig for dette selskapet. Bruk malen under Salg → Purring i stedet.';
            this.host.log.warn('reminder draft failed', { customer: cp.counterpartId });
        } finally {
            this.drafting = false;
        }
    }

    private async copyDraft() {
        try {
            await navigator.clipboard.writeText(this.draftText);
            this.host.notifications.success('Purretekst kopiert');
        } catch {
            this.host.notifications.warn('Kunne ikke kopiere', 'Merk teksten og kopier manuelt');
        }
    }

    render() {
        return html`
            <uni-page-header heading="Close Assistant" heading-level="1"></uni-page-header>
            <section>
                ${this.failure ? html`<uni-alert type="critical">${this.failure}</uni-alert>` : nothing}
                ${this.loading ? html`<p class="muted">Leser fakturaer, leverandørgjeld og bank for ${this.companyName || 'selskapet'}…</p>` : nothing}
                ${this.aging && this.forecast && this.bank ? this.renderCards(this.aging, this.forecast, this.bank) : nothing}
                ${this.renderDrawer()}
            </section>
        `;
    }

    private renderCards(aging: AgingReport, forecast: Forecast, bank: BankBalance) {
        const steps = new Map<string, number>();
        for (const c of aging.counterparts) {
            const s = suggestDunningStep(c).step;
            if (s !== 'none') steps.set(s, (steps.get(s) ?? 0) + 1);
        }
        const toChase = aging.counterparts.filter((c) => c.netOverdue > 0);
        return html`
            <div class="kpis">
                <uni-card header="Bank og kontanter"><div class="kpi">${nok(bank.total)}</div><div class="muted">${bank.accounts.map((a) => a.accountNumber).join(', ')}</div></uni-card>
                <uni-card header="Utestående kundefordringer"><div class="kpi">${nok(aging.netTotal)}</div><div class="muted">${aging.invoiceCount} åpne fakturaer ${nok(aging.total)}, minus umatchede innbetalinger ${nok(-aging.credits)}</div></uni-card>
                <uni-card header="Reelt forfalt"><div class="kpi critical">${nok(aging.netOverdue)}</div><div class="muted">${toChase.length} kunder å purre</div></uni-card>
                <uni-card header="Umatchede innbetalinger"><div class="kpi ${aging.credits < 0 ? 'warning' : ''}">${nok(-aging.credits)}</div><div class="muted">${aging.overpaidCount} kunder har betalt mer enn de skylder</div></uni-card>
                <uni-card header="Laveste likviditet neste 13 uker"><div class="kpi ${forecast.lowestClosing.amount < 0 ? 'critical' : ''}">${nok(forecast.lowestClosing.amount)}</div><div class="muted">uke fra ${forecast.lowestClosing.weekStart}</div></uni-card>
            </div>

            <div class="grid">
                <uni-card>
                    <uni-card-header>Aldersfordeling (brutto)</uni-card-header>
                    <div class="bar">
                        ${BUCKETS.map((b) => aging.buckets[b] > 0
                            ? html`<div class="seg ${b}" style="flex:${aging.buckets[b]}" title="${BUCKET_NB[b]}: ${nok(aging.buckets[b])}"></div>`
                            : nothing)}
                    </div>
                    <uni-table label="Aldersfordeling" size="small">
                        <uni-table-row header><uni-table-cell>Alder</uni-table-cell><uni-table-cell alignment="right">Beløp</uni-table-cell></uni-table-row>
                        ${BUCKETS.map((b) => html`<uni-table-row><uni-table-cell><span class="dot ${b}"></span>${BUCKET_NB[b]}</uni-table-cell><uni-table-cell alignment="right">${nok(aging.buckets[b])}</uni-table-cell></uni-table-row>`)}
                    </uni-table>
                    <h3>Anbefalte tiltak</h3>
                    <div class="tags">
                        ${[...steps.entries()].map(([s, n]) => html`<uni-tag type=${STEP_LABEL[s].type}>${n} × ${STEP_LABEL[s].text}</uni-tag>`)}
                        ${steps.size === 0 ? html`<uni-tag type="success">Ingen reelt forfalte fakturaer</uni-tag>` : nothing}
                        ${aging.credits < 0 ? html`<uni-tag type="warning">Match ${nok(-aging.credits)} i innbetalinger før purring</uni-tag>` : nothing}
                    </div>
                </uni-card>


                <uni-card>
                    <uni-card-header>Revisjonssjekk ${this.revision ? html`<span class="muted">${this.revision.errorCount} feil, ${this.revision.warningCount} advarsler</span>` : nothing}</uni-card-header>
                    ${this.revision ? this.renderRevision(this.revision) : html`<p class="muted">Kontrollerer åpningsbalanse, reskontro, gjeldskontoer, mva og umatchede innbetalinger…</p>`}
                </uni-card>

                <div class="wide"><uni-card>
                    <uni-card-header>Kunder å følge opp først</uni-card-header>
                    <uni-table label="Kunder å følge opp" size="small">
                        <uni-table-row header>
                            <uni-table-cell>Kunde</uni-table-cell>
                            <uni-table-cell alignment="right">Reelt forfalt</uni-table-cell>
                            <uni-table-cell alignment="right">Eldste</uni-table-cell>
                            <uni-table-cell>Neste steg</uni-table-cell>
                            <uni-table-cell></uni-table-cell>
                        </uni-table-row>
                        ${toChase.slice(0, 8).map((c) => {
                            const s = suggestDunningStep(c);
                            return html`<uni-table-row>
                                <uni-table-cell><uni-clickable @click=${() => this.openCustomer(c.counterpartId)}>${c.counterpartName}</uni-clickable></uni-table-cell>
                                <uni-table-cell alignment="right">${nok(c.netOverdue)}</uni-table-cell>
                                <uni-table-cell alignment="right">${c.oldestDaysOverdue} d</uni-table-cell>
                                <uni-table-cell><uni-tag small type=${STEP_LABEL[s.step].type}>${STEP_LABEL[s.step].text}</uni-tag></uni-table-cell>
                                <uni-table-cell><uni-button small variant="tertiary" @click=${() => this.openDraft(c, s.step)}>Lag tekst</uni-button></uni-table-cell>
                            </uni-table-row>`;
                        })}
                    </uni-table>
                </uni-card></div>


                <div class="wide"><uni-card>
                    <uni-card-header>Likviditetsprognose, 13 uker</uni-card-header>
                    <uni-table label="Likviditetsprognose" size="small">
                        <uni-table-row header>
                            <uni-table-cell>Uke fra</uni-table-cell>
                            <uni-table-cell alignment="right">Inn (kunder)</uni-table-cell>
                            <uni-table-cell alignment="right">Ut (leverandører)</uni-table-cell>
                            <uni-table-cell alignment="right">Faste kostnader</uni-table-cell>
                            <uni-table-cell alignment="right">Saldo</uni-table-cell>
                        </uni-table-row>
                        ${forecast.weeks.map((w) => html`<uni-table-row>
                            <uni-table-cell>${w.weekStart}</uni-table-cell>
                            <uni-table-cell alignment="right">${nok(w.inflowsAR)}</uni-table-cell>
                            <uni-table-cell alignment="right">${nok(w.outflowsAP)}</uni-table-cell>
                            <uni-table-cell alignment="right">${nok(w.outflowsFixed)}</uni-table-cell>
                            <uni-table-cell alignment="right"><span class=${w.closing < 0 ? 'critical' : ''}>${nok(w.closing)}</span></uni-table-cell>
                        </uni-table-row>`)}
                    </uni-table>
                    <uni-details label="Forutsetninger">
                        <ul>${forecast.assumptions.map((a) => html`<li>${a}</li>`)}<li>Innbetalinger som ikke er koblet til faktura er trukket fra de eldste fakturaene først.</li><li>Forfalte fordringer som ikke forventes innbetalt: ${nok(forecast.overdueReceivablesExcluded)}.</li></ul>
                    </uni-details>
                </uni-card></div>
            </div>
        `;
    }

    private renderRevision(rev: RevisionResult) {
        if (rev.remediations.length === 0) return html`<uni-alert type="success">Alle kontroller er i orden for ${rev.year}.</uni-alert>`;
        return html`
            <div class="findings">
                ${rev.remediations.map((r) => html`
                    <uni-details label=${`${SECTION_NB[r.section] ?? r.section}${r.finding.accountNumber ? ` (konto ${r.finding.accountNumber})` : ''} – ${nok(Math.abs(r.finding.value))}`} class="finding ${r.severity}">
                        <div class="finding-body">
                            <uni-tag small type=${SEVERITY_TAG[r.severity]}>${r.severity === 'error' ? 'Feil' : r.severity === 'warning' ? 'Advarsel' : 'Info'}</uni-tag>
                            <p>${r.explanation}</p>
                            <h4>Sannsynlige årsaker</h4>
                            <ul>${r.likelyCauses.map((c) => html`<li>${c}</li>`)}</ul>
                            <h4>Slik sjekker du</h4>
                            <ul>${r.diagnostics.map((d) => html`<li>${d}</li>`)}</ul>
                            ${r.proposedEntries.map((e) => html`
                                <h4>Forslag: ${e.title}</h4>
                                ${e.lines.length ? html`
                                    <uni-table label=${e.title} size="small">
                                        <uni-table-row header><uni-table-cell>Konto</uni-table-cell><uni-table-cell alignment="right">Beløp</uni-table-cell><uni-table-cell>Tekst</uni-table-cell><uni-table-cell>Dato</uni-table-cell></uni-table-row>
                                        ${e.lines.map((l) => html`<uni-table-row><uni-table-cell>${l.accountNumber}</uni-table-cell><uni-table-cell alignment="right">${nok(l.amount)}</uni-table-cell><uni-table-cell>${l.description}</uni-table-cell><uni-table-cell>${l.financialDate}</uni-table-cell></uni-table-row>`)}
                                    </uni-table>` : nothing}
                                <uni-alert small type="info">${e.caution}</uni-alert>
                            `)}
                        </div>
                    </uni-details>
                `)}
            </div>
        `;
    }

    private renderDrawer() {
        const cp = this.draftFor;
        return html`
            <uni-drawer header=${cp ? `Purretekst: ${cp.counterpartName}` : 'Purretekst'} .open=${!!cp} @uni-close=${() => (this.draftFor = null)}>
                ${cp ? html`
                    <p class="muted">Reelt forfalt ${nok(cp.netOverdue)}, eldste faktura ${cp.oldestDaysOverdue} dager. Teksten er skrevet av Unimicros tekstgenerator ut fra fakturaene; les gjennom før du sender.</p>
                    ${this.drafting ? html`<p>Skriver utkast…</p>` : html`<uni-textarea label="Utkast" resize="auto" .value=${this.draftText} @input=${(e: Event) => (this.draftText = (e.target as HTMLTextAreaElement).value)}></uni-textarea>`}
                ` : nothing}
                <uni-drawer-footer>
                    <uni-button variant="secondary" @click=${() => (this.draftFor = null)}>Lukk</uni-button>
                    <uni-button ?disabled=${this.drafting || !this.draftText} @click=${() => this.copyDraft()}>Kopier tekst</uni-button>
                </uni-drawer-footer>
            </uni-drawer>
        `;
    }
}
