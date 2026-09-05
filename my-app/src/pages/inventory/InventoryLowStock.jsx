import { Download, ShoppingCart } from "lucide-react";
import { mockLowStock } from "../../data/mockInventory";

export function InventoryLowStock() {
  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">Low stock products</h1>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ background: "var(--panel2)" }}>
              {["Product", "Current", "Min stock"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[11px] font-medium" style={{ color: "var(--muted)" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockLowStock.map((item, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--line)", background: "var(--panel)" }}>
                <td className="px-4 py-3 text-[13.5px] font-medium">{item.name}</td>
                <td className="px-4 py-3 mono text-[13px]" style={{ color: "var(--rust)" }}>{item.stock}</td>
                <td className="px-4 py-3 mono text-[13px]" style={{ color: "var(--muted)" }}>{item.minStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-[13.5px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
          <ShoppingCart size={15} /> Create purchase order
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-[13.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
          <Download size={15} /> Export
        </button>
      </div>
    </div>
  );
}
