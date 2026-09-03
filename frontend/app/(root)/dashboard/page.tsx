import { ArrowUpRight, DollarSign, PackageCheck, ReceiptText, Truck } from "lucide-react";

const summary = [
  { label: "Inventory value", value: "$128.4K", delta: "+8.2%", tone: "emerald" },
  { label: "Receivables", value: "$43.7K", delta: "+2.6%", tone: "amber" },
  { label: "Payables", value: "$19.8K", delta: "-1.4%", tone: "sky" },
  { label: "Daily sales", value: "$12.1K", delta: "+5.0%", tone: "violet" },
];

const recent = [
  { type: "Purchase", ref: "PO-2041", party: "Alpha Feed Ltd.", amount: "$4,800", status: "Paid" },
  { type: "Processing", ref: "PR-911", party: "North Yard", amount: "246 bags", status: "Completed" },
  { type: "Sale", ref: "SO-882", party: "Mira Traders", amount: "$7,260", status: "Collected" },
  { type: "Collection", ref: "RC-440", party: "City Retailers", amount: "$2,930", status: "Partial" },
];

const lowStock = [
  { item: "Steel bars", qty: "12 units", min: "20 units" },
  { item: "Goat stock", qty: "8 head", min: "15 head" },
  { item: "Gold scrap", qty: "22 kg", min: "30 kg" },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Inventory ledger dashboard</h1>
        </div>
        <div className="rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
          +12.4% vs last month
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map(({ label, value, delta, tone }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                tone === "emerald"
                  ? "bg-muted text-foreground"
                  : tone === "amber"
                    ? "bg-muted text-foreground"
                    : tone === "sky"
                      ? "bg-muted text-foreground"
                      : "bg-muted text-foreground"
              }`}>{delta}</span>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
              <ArrowUpRight className="size-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Recent activity</p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">Trade timeline</h2>
            </div>
            <span className="text-sm text-muted-foreground">Last 7 days</span>
          </div>

          <div className="space-y-4">
            {recent.map((item) => (
              <div key={item.ref} className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-foreground text-background">
                    {item.type === "Purchase" ? <Truck className="size-4" /> : item.type === "Sale" ? <DollarSign className="size-4" /> : item.type === "Processing" ? <PackageCheck className="size-4" /> : <ReceiptText className="size-4" />}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.party} · {item.ref}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{item.amount}</p>
                  <p className="text-xs font-medium text-muted-foreground">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Alerts</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Low stock watch</h2>

          <div className="mt-5 space-y-3">
            {lowStock.map((item) => (
              <div key={item.item} className="rounded-xl border border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{item.item}</p>
                  <span className="rounded-full bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground ring-1 ring-border">
                    Low
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Current: {item.qty}</p>
                <p className="text-sm text-muted-foreground">Minimum: {item.min}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
