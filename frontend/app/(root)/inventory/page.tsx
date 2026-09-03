const inventoryRows = [
  { item: "Steel bars", category: "Metal", qty: "120 units", unit: "bars", location: "Warehouse A", value: "$18,600" },
  { item: "Goat stock", category: "Livestock", qty: "86 head", unit: "head", location: "Holding Pen 2", value: "$24,900" },
  { item: "Gold scrap", category: "Precious", qty: "42 kg", unit: "kg", location: "Vault 1", value: "$36,100" },
  { item: "Fertilizer", category: "Inputs", qty: "280 bags", unit: "bags", location: "Storage B", value: "$5,470" },
];

export default function InventoryPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Master data</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Inventory items</h1>
        </div>
        <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition hover:opacity-90">
          Add item
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-muted text-sm text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {inventoryRows.map((item) => (
                <tr key={item.item} className="border-t border-border text-sm text-foreground">
                  <td className="px-4 py-4 font-medium text-foreground">{item.item}</td>
                  <td className="px-4 py-4">{item.category}</td>
                  <td className="px-4 py-4">{item.qty}</td>
                  <td className="px-4 py-4">{item.location}</td>
                  <td className="px-4 py-4">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
