import { useState } from "react";

export function InventoryBulkEdit() {
  const [action, setAction] = useState("prices");

  const actions = [
    { key: "prices", label: "Update prices" },
    { key: "category", label: "Update category" },
    { key: "brand", label: "Update brand" },
    { key: "gst", label: "Update GST" },
    { key: "stock", label: "Update stock" },
  ];

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">Bulk edit products</h1>

      <div className="max-w-[440px] flex flex-col gap-6">
        <div>
          <div className="mono text-[11px] mb-3" style={{ color: "var(--brass)" }}>SELECT ACTION</div>
          <div className="flex flex-col gap-2">
            {actions.map((a) => (
              <label key={a.key} className="flex items-center gap-2.5 text-[13.5px] cursor-pointer">
                <input type="radio" name="bulk-action" checked={action === a.key} onChange={() => setAction(a.key)} className="w-4 h-4" />
                {a.label}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-md p-3 flex items-center justify-between" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>Selected products</span>
          <span className="mono text-[14px] font-semibold">250</span>
        </div>

        {action === "gst" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px]" style={{ color: "var(--muted)" }}>New GST</span>
            <select className="w-full rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}>
              <option>18%</option><option>12%</option><option>5%</option><option>0%</option>
            </select>
          </label>
        )}

        <button className="rounded-md py-2.5 text-[14px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
          Apply changes
        </button>
      </div>
    </div>
  );
}
