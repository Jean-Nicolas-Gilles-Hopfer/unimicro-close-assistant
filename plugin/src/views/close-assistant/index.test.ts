import { beforeAll, expect, it } from 'vitest';
import View from './index';
import type { HostError, UnimicroHost } from '@unimicro/plugin-types';

/**
 * The view is a custom element: define it, hand it a stub host, read what it renders.
 * The stub answers the statistics calls the view makes with a small fixed book.
 */
beforeAll(() => {
    customElements.define('test-view', View);
});

type StubHost = Pick<UnimicroHost, 'getContext' | 'log' | 'api' | 'navigation'>;

const silentLog: StubHost['log'] = { info: () => {}, warn: () => {}, error: () => {} };

const context = async () => ({
    plugin: { id: 'close-assistant', version: '0.1.0' },
    user: { name: 'Ada Lovelace', email: 'ada@example.com' },
    company: { name: 'Acme Freight AS', orgNumber: '999888777', key: 'demo' },
});

/** Answers each statistics model with a fixture; anything else is empty. */
function apiFor(fixtures: Record<string, unknown[]>): StubHost['api'] {
    const get = async <T,>(path: string) => {
        const model = new URL('http://x' + path).searchParams.get('model') ?? '';
        return (fixtures[model] ?? []) as T;
    };
    return { get, post: get, put: get, delete: get, request: async () => { throw new Error('not used'); } } as unknown as StubHost['api'];
}

function stubHost(fixtures: Record<string, unknown[]>): UnimicroHost {
    const host: StubHost = {
        getContext: context,
        log: silentLog,
        api: apiFor(fixtures),
        navigation: { navigateTo: async () => {}, openExternal: async () => {}, getRoute: async () => '/' } as unknown as StubHost['navigation'],
    };
    return host as UnimicroHost;
}

function failingHost(): UnimicroHost {
    const refusal: HostError = Object.assign(new Error('the platform said no'), { code: 'host/request-failed' as const, status: 503 });
    const host: StubHost = {
        getContext: context,
        log: silentLog,
        api: { get: async () => { throw refusal; } } as unknown as StubHost['api'],
        navigation: {} as StubHost['navigation'],
    };
    return host as UnimicroHost;
}

async function settle(view: View) {
    for (let i = 0; i < 4; i++) {
        await view.updateComplete;
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
    await view.updateComplete;
}

const y = new Date().getFullYear();

it('renders receivables, bank and forecast from the book', async () => {
    const view = document.createElement('test-view') as View;
    view.host = stubHost({
        CustomerInvoice: [
            { ID: 1, InvoiceNumber: '1001', CustomerID: 7, InvoiceDate: `${y}-01-01`, PaymentDueDate: `${y - 1}-06-01`, TaxInclusiveAmount: 5000, RestAmount: 5000, StatusCode: 42002, CustomerName: 'Nordfjord Marine ASA', EmailAddress: null },
        ],
        SupplierInvoice: [],
        JournalEntryLine: [{ AccountNumber: 1920, AccountName: 'Bankinnskudd', Balance: 100000, Month: 1, Amount: -2000 }],
    });
    document.body.append(view);
    await settle(view);
    const text = view.shadowRoot?.textContent ?? '';
    expect(text).toContain('Nordfjord Marine ASA');
    expect(text).toContain('Til inkasso');
    expect(text).toContain('Likviditetsprognose');
});

it('says so when the platform refuses', async () => {
    const view = document.createElement('test-view') as View;
    view.host = failingHost();
    document.body.append(view);
    await settle(view);
    expect(view.shadowRoot?.textContent).toContain('Kunne ikke lese regnskapsdata');
});
