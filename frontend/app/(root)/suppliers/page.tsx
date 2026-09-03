const suppliers = [
  { name: "Alpha Feed Ltd.", contact: "Nadia Ahmed", phone: "+971 50 120 4400", balance: "$14,800" },
  { name: "Jazeera Metals", contact: "Rashid Ali", phone: "+971 55 776 9901", balance: "$8,240" },
  { name: "Harbor Stock", contact: "Mariam Noor", phone: "+971 52 184 6750", balance: "$6,910" },
];

export default function SuppliersPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Accounts</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Suppliers</h1>
        </div>
        <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition hover:opacity-90">
          New supplier
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {suppliers.map((supplier) => (
          <div key={supplier.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Supplier</p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">{supplier.name}</h2>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p>Contact: {supplier.contact}</p>
              <p>Phone: {supplier.phone}</p>
              <p>Outstanding: {supplier.balance}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
