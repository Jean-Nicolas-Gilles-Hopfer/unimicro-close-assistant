# Submission material – Unimicro Hackathon 2026

Form: https://info.unimicro.no/hackaton/submission (Fornavn, Etternavn, E-post, Konseptbeskrivelse, URL til demo, URL til video).
Deadline: 15 September 2026, 23:59.

## Konseptbeskrivelse (norsk)

**Close Assistant – månedsavslutning uten detektivarbeid**

Hver måned bruker regnskapsførere og småbedrifter timer på tre spørsmål regnskapssystemet ikke svarer på: Hvem skal
jeg purre, og hvor hardt? Hvor mye penger har vi egentlig de neste ukene? Og hvorfor er revisjonssjekken rød?

Close Assistant svarer på alle tre, rett inne i Unimicro. Den ligger som en egen side under Salg, som widget på
dashbordet, som merkelapp på faktura- og kundesiden og som kolonne i fakturalisten.

*Purring med hodet:* Alle åpne fakturaer aldersfordeles, og kundene rangeres etter hva som faktisk er forfalt. Det
viktigste grepet er at innbetalinger som ikke er koblet til faktura trekkes fra først. I demoselskapet lå det 5,3
millioner kroner i slike umatchede innbetalinger; uten dette grepet ville purringer gått til kunder som allerede har
betalt. For hver kunde foreslås neste steg etter norsk praksis – vennlig påminnelse, purring, inkassovarsel eller
inkasso – og ett klikk lager utkast til brevet med Unimicros egen tekstgenerator.

*Likviditet du kan stole på:* En 13-ukers prognose bygget på banksaldo, åpne kunde- og leverandørfakturaer og faste
kostnader, med tydelige forutsetninger og laveste punkt markert.

*Revisjonssjekk som forklarer seg:* Unimicros kontroll sier at noe er feil. Close Assistant sier hvorfor, hvordan du
sjekker det, og foreslår det balanserte korreksjonsbilaget – på norsk, i riktig rekkefølge. I demoselskapet viste
det seg at to feil i åpningsbalansen var ett problem: fjorårets resultat var aldri disponert. To egne kontroller er
lagt til: umatchede innbetalinger og manglende mva-melding.

*Bonus: mørk modus.* Unimicro har ikke mørk modus, men designsystemet er bygget for det – hver farge er et navngitt
token. Vi har laget et komplett mørkt tema i samme format som de fire merkevaretemaene (DNB, SpareBank 1, Eika,
Azets), kontrastsjekket mot WCAG AA, pluss en liten nettleserutvidelse med en lys/mørk-bryter (BETA) som viser
det live. De få stedene appen bruker hardkodede farger er dokumentert som det Unimicro selv må rette.

Samme logikk er også tilgjengelig som MCP-server, slik at Claude og andre AI-assistenter kan svare på de samme
spørsmålene i naturlig språk. Alt leses som innlogget bruker; ingenting bokføres uten Unimicros egen bekreftelse.

## Concept description (English)

**Close Assistant – month-end close without the detective work**

Every month, accountants and small businesses spend hours on three questions the accounting system does not answer:
Whom should I chase, and how firmly? How much cash do we really have over the next weeks? And why is the revision
check red?

Close Assistant answers all three inside Unimicro: as a page under Sales, a dashboard widget, a status tag on the
invoice and customer pages, and a column in the invoice list.

*Chasing with judgement:* Every open invoice is aged and customers are ranked by what is truly overdue. The key move is
netting off payments that were never matched to an invoice first. The demo company held 5.3 MNOK of such unmatched
payments; without this step, reminders would go to customers who had already paid. For each customer the next step
under Norwegian practice is proposed – friendly reminder, formal reminder, debt-collection notice or collection – and
one click drafts the letter with Unimicro's built-in text generation.

*Cash you can trust:* A 13-week forecast from bank balance, open customer and supplier invoices and fixed costs, with
explicit assumptions and the low point highlighted.

*A revision check that explains itself:* Unimicro's check says something is wrong. Close Assistant says why, how to
verify it, and proposes the balanced correcting entry, in Norwegian and in the right order. In the demo company, two
opening-balance errors turned out to be one problem: last year's result was never allocated. Two checks of our own are
added: unmatched payments and VAT returns not produced.

*Bonus: dark mode.* Unimicro has no dark mode, but its design system is built for one: every colour is a named
token. We built a complete dark theme in the same format as the four brand themes (DNB, SpareBank 1, Eika, Azets),
contrast-checked against WCAG AA, plus a small browser extension with a light/dark switch (BETA) that shows it live.
The few places where the app hard-codes colours are documented as the work Unimicro would need to do on its side.

The same logic ships as an MCP server, so Claude and other AI assistants can answer the same questions in natural
language. Everything is read as the signed-in user; nothing is booked without Unimicro's own confirmation step.

## Demo URL

- Repository (public from submission day): https://github.com/Jean-Nicolas-Gilles-Hopfer/unimicro-close-assistant
- Demo page (GitHub Pages, to be published): screenshots, the video and a snapshot-driven walkthrough.
- Live plugin: runs in test company "DEMO JN's company" via the dev tunnel; Unimicro staff
  with access to the contract can open the tunnel link on request.

## Video script (under 60 seconds, landscape)

Face to camera for the opener, then screen. Deadpan, one beat per line, no laughing at your own jokes. English is
fine (the concept text is in both languages); a Norwegian version is below the table if you prefer.

Pick one opener (0–8 s, face to camera):

- A. "Hi, I'm Jean-Nicolas. I'm a product designer, so my superpower is unsolicited feedback. Unimicro, here's
  some. With the fixes attached."
- B. "Hi, I'm Jean-Nicolas. In the demo company, 5.3 million kroner of customer payments were never matched to an
  invoice. That's not a bug. That's a true-crime podcast."
- C. "Hi, I'm Jean-Nicolas. I don't write code. Claude did the heavy lifting; I added the sprinkles. Let me show you
  the sprinkles."

| Time | Screen | Say |
|---|---|---|
| 0–8 s | Face to camera | Opener A, B or C. |
| 8–20 s | Close Assistant page: KPIs, then the chase list | "Month-end in Unimicro leaves three questions open. One: who do I chase? Close Assistant ranks customers by what is *actually* overdue, after deducting payments nobody matched. In this company, that was 5.3 million." |
| 20–30 s | Click "Lag tekst", the drawer with the letter | "One click, and Unimicro's own text generator writes the reminder. In Norwegian. Firmer than I would be." |
| 30–42 s | Revision card, expand one finding | "Two: why is the revision check red? Unimicro says 'error'. Close Assistant says why, how to verify it, and proposes the balanced entry. Turns out two errors were one forgotten year-end." |
| 42–50 s | Dashboard widget, then the invoice header tag | "Three: how much cash do we really have? Thirteen weeks ahead, on the dashboard, and the answers follow you to every invoice and customer." |
| 50–58 s | Toggle dark mode (extension), let it land | "And because I'm a designer and could not help myself: Unimicro, in dark mode. You're welcome." |
| 58–60 s | Demo page or repo | "Close Assistant. Thanks." |

Norwegian alternative for the screen part, if you record in Norwegian: "Hvem skal jeg purre? Her er kundene
rangert etter det som faktisk er forfalt, etter at 5,3 millioner i umatchede innbetalinger er trukket fra. Ett
klikk lager purreteksten." / "Hvorfor er revisjonssjekken rød? Close Assistant forklarer årsaken og foreslår
bilaget som retter det." / "Hvor mye penger har vi egentlig? Tretten uker frem, rett på dashbordet." / "Og fordi
jeg er designer og ikke klarte å la det være: Unimicro i mørk modus."

Recording tips: 1920×1080, browser at 100 % zoom, hide bookmarks bar. Record with OBS or Windows Game Bar (Win+G);
export MP4; upload to Dropbox/OneDrive/YouTube (unlisted) and paste the link in the form. The plugin only shows while
`unimicro plugin dev` is running; ask Claude to start it before recording.
