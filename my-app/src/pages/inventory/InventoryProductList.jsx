// // import { useState } from "react";
// import { useEffect, useState } from "react";
// import { productsApi } from "../../api/products";
// import { Search, Plus, Upload, Download, Edit3, ScanLine } from "lucide-react";
// import { formatINR } from "../../utils/format";
// // import { mockProducts } from "../../data/mockInventory";

// export function InventoryProductList({ onAddProduct, onOpenProduct, onImport, onBulkEdit }) {
//   const [query, setQuery] = useState("");
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   loadProducts();
// }, []);

// const loadProducts = async () => {
//   try {
//     const data = await productsApi.list();
//     setProducts(data.items);
//   } catch (error) {
//     console.error("Failed to load products", error);
//   } finally {
//     setLoading(false);
//   }
// };

//   // const filtered = query.trim()
//   //   ? mockProducts.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
//   //   : mockProducts;
//   const filtered = query.trim()
//   ? products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
//         (p.sku || "")
//           .toLowerCase()
//           .includes(query.trim().toLowerCase()) ||
//         (p.barcode || "")
//           .includes(query.trim())
//     )
//   : products;

//   if (loading) {
//   return (
//     <div className="p-6">
//       Loading products...
//     </div>
//   );
// }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">Products</h1>
//         <button
//           onClick={onAddProduct}
//           className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
//           style={{ background: "var(--brass)", color: "#14171C" }}
//         >
//           <Plus size={15} />
//           Add product
//         </button>
//       </div>

//       <div className="relative mb-4 max-w-[360px]">
//         <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search products…"
//           className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
//           style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
//         />
//       </div>

//       <div className="flex flex-wrap gap-2 mb-4">
//         {["Category", "Brand", "Stock", "GST", "Active"].map((label) => (
//           <button
//             key={label}
//             className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[12.5px]"
//             style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
//           >
//             {label} ▾
//           </button>
//         ))}
//       </div>

//       <div className="flex flex-wrap gap-2 mb-6">
//         <button onClick={onImport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//           <Upload size={13} /> Import Excel
//         </button>
//         <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//           <Download size={13} /> Export
//         </button>
//         <button onClick={onBulkEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//           <Edit3 size={13} /> Bulk edit
//         </button>
//         <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//           <ScanLine size={13} /> Barcode scan
//         </button>
//       </div>

//       <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr style={{ background: "var(--panel2)" }}>
//                 {["Product", "SKU", "Category", "Stock", "Sell price", "Status"].map((h) => (
//                   <th key={h} className="px-4 py-2.5 text-[11px] font-medium" style={{ color: "var(--muted)" }}>{h.toUpperCase()}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((p) => (
//                 <tr
//                   key={p.id}
//                   onClick={() => onOpenProduct(p)}
//                   className="cursor-pointer"
//                   style={{ borderTop: "1px solid var(--line)", background: "var(--panel)" }}
//                 >
//                   <td className="px-4 py-3 text-[13.5px] font-medium">{p.name}</td>
//                   <td className="px-4 py-3 mono text-[12.5px]" style={{ color: "var(--muted)" }}>{p.sku || "-"}</td>
//                   <td className="px-4 py-3 text-[13px]" style={{ color: "var(--muted)" }}>{p.category || "-"}</td>
//                   <td className="px-4 py-3 mono text-[13px]">{p.quantity ?? 0}</td>
//                   <td className="px-4 py-3 mono text-[13px]">{formatINR(p.price)}</td>
//                   <td className="px-4 py-3">
//                     <span className="mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(63,167,150,0.15)", color: "var(--teal)" }}>
//                       {/* {p.status.toUpperCase()} */}
//                       {p.is_active ? "ACTIVE" : "INACTIVE"}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="px-4 py-3 text-[12px]" style={{ borderTop: "1px solid var(--line)", background: "var(--panel2)", color: "var(--muted)" }}>
//           Showing 1–{filtered.length} of {products.length} products
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { productsApi } from "../../api/products";
import {
  Search,
  Plus,
  Upload,
  Download,
  Edit3,
  ScanLine,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatINR } from "../../utils/format";

export function InventoryProductList({
  onAddProduct,
  onOpenProduct,
  onImport,
  onBulkEdit,
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Load products whenever page or search changes.
   *
   * Search is debounced so we don't make an API request
   * for every single character typed.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [page, query]);

  /*
   * If the user changes the search query,
   * always go back to page 1.
   */
  useEffect(() => {
    setPage(1);
  }, [query]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await productsApi.list({
        page,
        pageSize,
        search: query,
      });

      setProducts(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Failed to load products:", err);

      setProducts([]);
      setTotal(0);
      setTotalPages(0);

      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const startItem =
    total === 0 ? 0 : (page - 1) * pageSize + 1;

  const endItem =
    Math.min(page * pageSize, total);

  if (loading && products.length === 0) {
    return (
      <div className="p-6">
        Loading products...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="disp text-[26px] font-semibold tracking-tight">
          Products
        </h1>

        <button
          onClick={onAddProduct}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
          style={{
            background: "var(--brass)",
            color: "#14171C",
          }}
        >
          <Plus size={15} />
          Add product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-[360px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted)" }}
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
          style={{
            border: "1px solid var(--line)",
            background: "var(--panel)",
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["Category", "Brand", "Stock", "GST", "Active"].map(
          (label) => (
            <button
              key={label}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[12.5px]"
              style={{
                border: "1px solid var(--line)",
                color: "var(--muted)",
              }}
            >
              {label} ▾
            </button>
          )
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={onImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium"
          style={{
            border: "1px solid var(--line)",
            color: "var(--muted)",
          }}
        >
          <Upload size={13} />
          Import Excel
        </button>

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium"
          style={{
            border: "1px solid var(--line)",
            color: "var(--muted)",
          }}
        >
          <Download size={13} />
          Export
        </button>

        <button
          onClick={onBulkEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium"
          style={{
            border: "1px solid var(--line)",
            color: "var(--muted)",
          }}
        >
          <Edit3 size={13} />
          Bulk edit
        </button>

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium"
          style={{
            border: "1px solid var(--line)",
            color: "var(--muted)",
          }}
        >
          <ScanLine size={13} />
          Barcode scan
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-md text-[13px]"
          style={{
            border: "1px solid var(--line)",
            background: "var(--panel)",
            color: "var(--rust)",
          }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: "1px solid var(--line)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                style={{
                  background: "var(--panel2)",
                }}
              >
                {[
                  "Product",
                  "SKU",
                  "Category",
                  "Stock",
                  "Sell price",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-[11px] font-medium"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-[13px]"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {query.trim()
                      ? `No products found for "${query}"`
                      : "No products found."}
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onOpenProduct(p)}
                    className="cursor-pointer"
                    style={{
                      borderTop: "1px solid var(--line)",
                      background: "var(--panel)",
                    }}
                  >
                    <td className="px-4 py-3 text-[13.5px] font-medium">
                      {p.name}
                    </td>

                    <td
                      className="px-4 py-3 mono text-[12.5px]"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      {p.sku || "-"}
                    </td>

                    <td
                      className="px-4 py-3 text-[13px]"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      {p.category || "-"}
                    </td>

                    <td className="px-4 py-3 mono text-[13px]">
                      {p.quantity ?? 0}
                    </td>

                    <td className="px-4 py-3 mono text-[13px]">
                      {formatINR(p.price)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className="mono text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background:
                            "rgba(63,167,150,0.15)",
                          color: "var(--teal)",
                        }}
                      >
                        {p.is_active
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-[12px]"
          style={{
            borderTop: "1px solid var(--line)",
            background: "var(--panel2)",
            color: "var(--muted)",
          }}
        >
          <span>
            Showing {startItem}–{endItem} of {total} products
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
              style={{
                border: "1px solid var(--line)",
                opacity:
                  page <= 1 || loading ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <span className="px-2">
              Page {page} of {totalPages || 1}
            </span>

            <button
              disabled={
                page >= totalPages || loading
              }
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
              style={{
                border: "1px solid var(--line)",
                opacity:
                  page >= totalPages || loading
                    ? 0.4
                    : 1,
              }}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}