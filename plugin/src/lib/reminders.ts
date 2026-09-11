/**
 * Reminder drafting through Unimicro's built-in text generation (ai-generate, switched on for the test
 * environment on 2026-09-09). The prompt carries the facts; the model only writes the letter.
 */
import type { UnimicroHost } from '@unimicro/plugin-types';
import type { CounterpartAging, DunningStep } from './domain/aging';

const STEP_INSTRUCTION: Record<DunningStep, string> = {
    none: 'Skriv en kort, hyggelig melding som bekrefter at alt er i orden.',
    friendly_reminder: 'Skriv en vennlig betalingspåminnelse. Ingen gebyr, ingen trusler. Be kunden se bort fra meldingen om betaling allerede er sendt.',
    reminder_with_fee: 'Skriv en formell purring (2. varsel). Nevn at purregebyr etter inkassoforskriften kan tilkomme, og gi 14 dagers betalingsfrist.',
    debt_collection_notice: 'Skriv et inkassovarsel etter inkassoloven § 9: saklig tone, 14 dagers frist, og at kravet sendes til inkasso med ytterligere omkostninger dersom det ikke betales.',
    send_to_collection: 'Skriv et kort internt notat til regnskapsfører som anbefaler å overføre kravet til inkassobyrå, med begrunnelse.',
};

export function buildReminderPrompt(cp: CounterpartAging, step: DunningStep, senderName: string): string {
    const invoices = cp.invoices
        .filter((i) => i.daysOverdue > 0)
        .slice(0, 8)
        .map((i) => `- Faktura ${i.invoiceNumber}, forfalt ${i.dueDate} (${i.daysOverdue} dager), utestående ${i.restAmount.toFixed(2)} kr`)
        .join('\n');
    const credits = cp.credits < 0 ? `\nKunden har også ${(-cp.credits).toFixed(2)} kr i innbetalinger som ikke er koblet til faktura; reelt forfalt beløp er ${cp.netOverdue.toFixed(2)} kr. Bruk det reelle beløpet.` : '';
    return `Du er regnskapsmedarbeider hos ${senderName}. ${STEP_INSTRUCTION[step]}
Skriv på norsk (bokmål), maks 120 ord, uten emnefelt, uten plassholdere i klammer. Avslutt med "Med vennlig hilsen ${senderName}".
Kunde: ${cp.counterpartName}
Forfalte fakturaer:
${invoices}
Totalt forfalt: ${cp.overdue.toFixed(2)} kr${credits}`;
}

interface Completion { choices?: { message?: { content?: string } }[] }

/** Returns the generated text, or throws when the company has no AI enabled. */
export async function draftReminder(host: UnimicroHost, cp: CounterpartAging, step: DunningStep, senderName: string): Promise<string> {
    const res = await host.api.post<Completion>('ai-generate?action=generate-text', {
        Prompt: buildReminderPrompt(cp, step, senderName),
        Temperature: 60,
        TopPercentage: 95,
    });
    const text = res?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('empty completion');
    return text;
}
