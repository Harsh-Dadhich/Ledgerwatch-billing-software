// import { useState } from "react";
import { useEffect, useState } from "react";
import { productsApi } from "../../api/products";
import { Search, Plus, Upload, Download, Edit3, ScanLine } from "lucide-react";
import { formatINR } from "../../utils/format";
// import { mockProducts } from "../../data/mockInventory";

export function InventoryProductList({ onAddProduct, onOpenProduct, onImport, onBulkEdit }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {
    const data = await productsApi.list();
    setProducts(data);
  } catch (error) {
    console.error("Failed to load products", error);
  } finally {
    setLoading(false);
  }
};

  // const filtered = query.trim()
  //   ? mockProducts.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
  //   : mockProducts;
  const filtered = query.trim()
  ? products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        (p.sku || "")
          .toLowerCase()
          .includes(query.trim().toLowerCase()) ||
        (p.barcode || "")
          .includes(query.trim())
    )
  : products;

  if (loading) {
  return (
    <div className="p-6">
      Loading products...
    </div>
  );
}

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="disp text-[26px] font-semibold tracking-tight">Products</h1>
        <button
          onClick={onAddProduct}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
          style={{ background: "var(--brass)", color: "#14171C" }}
        >
          <Plus size={15} />
          Add product
        </button>
      </div>

      <div className="relative mb-4 max-w-[360px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
          style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {["Category", "Brand", "Stock", "GST", "Active"].map((label) => (
          <button
            key={label}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[12.5px]"
            style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
          >
            {label} ▾
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={onImport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
          <Upload size={13} /> Import Excel
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
          <Download size={13} /> Export
        </button>
        <button onClick={onBulkEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
          <Edit3 size={13} /> Bulk edit
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
          <ScanLine size={13} /> Barcode scan
        </button>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "var(--panel2)" }}>
                {["Product", "SKU", "Category", "Stock", "Sell price", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-medium" style={{ color: "var(--muted)" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onOpenProduct(p)}
                  className="cursor-pointer"
                  style={{ borderTop: "1px solid var(--line)", background: "var(--panel)" }}
                >
                  <td className="px-4 py-3 text-[13.5px] font-medium">{p.name}</td>
                  <td className="px-4 py-3 mono text-[12.5px]" style={{ color: "var(--muted)" }}>{p.sku || "-"}</td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: "var(--muted)" }}>{p.category || "-"}</td>
                  <td className="px-4 py-3 mono text-[13px]">{p.quantity ?? 0}</td>
                  <td className="px-4 py-3 mono text-[13px]">{formatINR(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className="mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(63,167,150,0.15)", color: "var(--teal)" }}>
                      {/* {p.status.toUpperCase()} */}
                      {p.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-[12px]" style={{ borderTop: "1px solid var(--line)", background: "var(--panel2)", color: "var(--muted)" }}>
          Showing 1–{filtered.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
