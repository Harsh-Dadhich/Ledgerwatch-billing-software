import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { mockCategories } from "../../data/mockInventory";

export function InventoryCategories() {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? mockCategories.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : mockCategories;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="disp text-[26px] font-semibold tracking-tight">Categories</h1>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
          <Plus size={15} /> Add
        </button>
      </div>

      <div className="relative mb-6 max-w-[360px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search category…"
          className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
          style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.name} className="card-hover rounded-lg p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
            <div className="disp text-[15px] font-semibold">{c.name}</div>
            <div className="mono text-[12px] mt-1" style={{ color: "var(--muted)" }}>{c.productCount} products</div>
          </div>
        ))}
      </div>
    </div>
  );
}
