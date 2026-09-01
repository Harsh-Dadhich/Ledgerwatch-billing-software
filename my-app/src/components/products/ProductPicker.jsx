import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { formatINR } from "../../utils/format";

export function ProductPicker({ products, selectedId, onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = products.find((p) => p.id === selectedId);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : products;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-md px-3 py-2.5 text-[14px] text-left"
        style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}
      >
        <span className="truncate">{selected ? `${selected.name} — ${formatINR(selected.price)}` : "Select a product"}</span>
        <ChevronDown size={15} style={{ color: "var(--muted)" }} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md overflow-hidden" style={{ background: "var(--panel2)", border: "1px solid var(--line)" }}>
          <div className="p-2" style={{ borderBottom: "1px solid var(--line)" }}>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent rounded-md pl-8 pr-2 py-2 text-[13px]"
                style={{ border: "1px solid var(--line)" }}
              />
            </div>
          </div>
          <div className="max-h-[240px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-[12.5px]" style={{ color: "var(--muted)" }}>No matches.</div>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onSelect(p.id); setQuery(""); setOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[13.5px]"
                  style={{ background: p.id === selectedId ? "rgba(201,150,62,0.15)" : "transparent" }}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="mono text-[12px] shrink-0 ml-2" style={{ color: "var(--muted)" }}>{formatINR(p.price)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
