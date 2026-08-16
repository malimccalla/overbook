const items = [
  {
    title: "No more copy-pasting from offer forms",
    body: "Overbook extracts every field from forwarded emails and PDFs — artist, venue, date, fee, travel terms — and builds the booking record for you. No spreadsheet, no retyping.",
  },
  {
    title: "Smart pencilling, zero conflicts",
    body: "Hold a date with one click. When a pencil conflicts, Overbook flags it immediately. See every confirmed show, hold, and pencil across your entire roster in a single calendar view — spot gaps and avoid clashes before they happen.",
  },
  {
    title: "Approvals go straight to the artist",
    body: "New show comes in? Send it to the artist for sign-off directly from the queue — no back-and-forth email chains, no forwarding PDFs.",
  },
  {
    title: "Advancing on autopilot",
    body: "Riders, tech specs, and hospitality requirements live on the artist's record — updated by the artist or their team, always current. The moment a show is confirmed, the advance pack goes out to the promoter automatically. No more desktop folders, no more manual sends.",
  },
];

export function ProcessSection() {
  return (
    <section className="border-t border-ink px-[clamp(1.25rem,4vw,4.75rem)] py-[clamp(4.5rem,10vw,10rem)]">
      <div className="mb-16 max-w-3xl">
        <p className="mb-6 font-mono text-[0.7rem] font-bold uppercase">
          Why agencies switch
        </p>
        <h2 className="text-[clamp(2rem,4.4vw,4.8rem)] font-medium leading-[1.08]">
          Cut out repetitive process,
          <br />
          <span className="text-muted">move 10× faster.</span>
        </h2>
        <p className="mt-6 max-w-[38rem] text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-muted">
          Booking agencies run on email, spreadsheets, and PDFs. Overbook
          automates the admin so you spend time on the work that actually
          matters — the people.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* 01 — full accent card */}
        <div className="flex flex-col justify-between rounded-2xl bg-[#a8e5e1] p-8 md:row-span-2">
          <p className="font-mono text-[0.65rem] uppercase text-ink/50">01</p>
          <div>
            <h3 className="mb-3 text-2xl font-medium leading-snug">
              {items[0].title}
            </h3>
            <p className="leading-relaxed text-ink/70">{items[0].body}</p>
          </div>
        </div>

        {/* 02 */}
        <div className="flex flex-col justify-between rounded-2xl bg-[#d7f257] p-8">
          <p className="font-mono text-[0.65rem] uppercase text-ink/50">02</p>
          <div>
            <h3 className="mb-3 text-xl font-medium leading-snug">
              {items[1].title}
            </h3>
            <p className="text-sm leading-relaxed text-ink/70">{items[1].body}</p>
          </div>
        </div>

        {/* 03 */}
        <div className="flex flex-col justify-between rounded-2xl bg-paper p-8 border border-ink/10">
          <p className="font-mono text-[0.65rem] uppercase text-muted">03</p>
          <div>
            <h3 className="mb-3 text-xl font-medium leading-snug">
              {items[2].title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{items[2].body}</p>
          </div>
        </div>

        {/* 04 — dark card, spans full width */}
        <div className="flex flex-col justify-between rounded-2xl bg-ink p-8 text-paper md:col-span-2">
          <p className="font-mono text-[0.65rem] uppercase text-paper/40">04</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <h3 className="text-2xl font-medium leading-snug md:text-3xl">
              {items[3].title}
            </h3>
            <p className="leading-relaxed text-paper/70">{items[3].body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
