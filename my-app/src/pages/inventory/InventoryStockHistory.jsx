import { mockProducts, mockStockHistory } from "../../data/mockInventory";

export function InventoryStockHistory() {
  const currentStock = mockStockHistory[mockStockHistory.length - 1]?.balance ?? 0;

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">Stock history</h1>

      <div className="grid sm:grid-cols-2 gap-3 max-w-[480px] mb-6">
        <select className="w-full rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}>
          {mockProducts.map((p) => <option key={p.id}>{p.name}</option>)}
        </select>
        <select className="w-full rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}>
          <option>All transaction types</option>
          <option>Opening</option><option>Purchase</option><option>Sale</option><option>Damage</option><option>Adjustment</option>
        </select>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ background: "var(--panel2)" }}>
              {["Date", "Type", "Qty", "Balance"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[11px] font-medium" style={{ color: "var(--muted)" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockStockHistory.map((row, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--line)", background: "var(--panel)" }}>
                <td className="px-4 py-3 mono text-[12.5px]">{row.date}</td>
                <td className="px-4 py-3 text-[13px]">{row.type}</td>
                <td className="px-4 py-3 mono text-[13px]" style={{ color: row.qty > 0 ? "var(--teal)" : "var(--rust)" }}>
                  {row.qty > 0 ? `+${row.qty}` : row.qty}
                </td>
                <td className="px-4 py-3 mono text-[13px]">{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--line)", background: "var(--panel2)" }}>
          <span className="disp text-[13px] font-semibold" style={{ color: "var(--muted)" }}>CURRENT STOCK</span>
          <span className="mono text-[16px] font-semibold" style={{ color: "var(--brass)" }}>{currentStock}</span>
        </div>
      </div>
    </div>
  );
}
