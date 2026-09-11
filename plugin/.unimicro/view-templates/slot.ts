import { LitElement, html } from 'lit';
import type { UnimicroHost } from '@unimicro/plugin-types';
// These elements are registered for this view either way; this brings their types, and no code.
import type {} from '@unimicro/design-system/components';

/** What this slot hands the view. Narrow it to the entity your slot actually provides. */
type SlotSubject = { Info?: { Name?: string }; Name?: string } | null | undefined;

/** The subject's display name, wherever the entity keeps it. */
function subjectName(entity: SlotSubject): string {
    return entity?.Info?.Name ?? entity?.Name ?? '';
}

export default class __VIEW_CLASS__ extends LitElement {
    /** Assigned by the platform before this element is connected. */
    host!: UnimicroHost;

    static properties = { subject: { state: true } };

    /** Reactive state, so assigning it re-renders the view. */
    private subject = '';

    /** Ends the subscription below. Kept so disconnectedCallback can call it. */
    private unsubscribe?: () => void;

    connectedCallback() {
        super.connectedCallback();

        // The entity of the page this view sits in, and every update as the page works.
        // What it holds is the slot's own — `unimicro plugin slots` says what each one provides.
        // A customer keeps its name on Info, as the business relation behind it.
        //
        // This is the whole subscription: the handler is called with the value the slot holds now,
        // and again on every change. Fetching a first value with getContext() and subscribing after
        // is both redundant and wrong — an update that lands while that await is in flight is
        // overwritten by the value the await started with.
        this.unsubscribe = this.host.slot?.onContextChange<SlotSubject>((updated) => {
            this.subject = subjectName(updated);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // The platform releases every subscription when it revokes the view's handle, so this is not
        // what stops a leak between views. It is what stops one within this view: an element moved in
        // the DOM disconnects and reconnects on the same live handle, and connectedCallback subscribes
        // again each time.
        this.unsubscribe?.();
        this.unsubscribe = undefined;
    }

    render() {
        return html`
            <section>
                <h2>__VIEW_TITLE__</h2>
                <p>${this.subject}</p>
            </section>
        `;
    }
}
