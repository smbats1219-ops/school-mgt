const traders = [
  { name: "Mira Traders", contact: "Sami Rahman", phone: "+971 50 820 9100", receivable: "$12,600" },
  { name: "City Retailers", contact: "Hafsa Khan", phone: "+971 52 321 5480", receivable: "$8,140" },
  { name: "Vale Holdings", contact: "Noor Hassan", phone: "+971 55 779 3312", receivable: "$5,680" },
];

export default function TradersPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Customers</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Traders</h1>
        </div>
        <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition hover:opacity-90">
          New trader
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {traders.map((trader) => (
          <div key={trader.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Trader</p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">{trader.name}</h2>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p>Contact: {trader.contact}</p>
              <p>Phone: {trader.phone}</p>
              <p>Receivable: {trader.receivable}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
