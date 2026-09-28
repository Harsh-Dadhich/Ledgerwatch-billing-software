// import { useEffect, useState } from "react";
// import { ScanLine, SlidersHorizontal, Search, Package } from "lucide-react";
// import { formatINR } from "../../utils/format";
// // import { mockBillingCategories, mockBillingProducts, mockBillingTotalProductCount } from "../../data/mockBillingProducts";
// import { productsApi } from "../../api/products";
// import { categoriesApi } from "../../api/Categories";

// export function ProductCatalogPanel({ onAdd }) {
//   const [query, setQuery] = useState("");
//   const [category, setCategory] = useState("All");
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState(["All"]);
//   const [loading, setLoading] = useState(true);

//   const filtered = mockBillingProducts.filter((p) => {
//     const matchesCategory = category === "All" || p.category === category;
//     const matchesQuery =
//       !query.trim() ||
//       p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
//       p.sku.toLowerCase().includes(query.trim().toLowerCase()) ||
//       p.barcode.includes(query.trim());
//     return matchesCategory && matchesQuery;
//   });

//   return (
//     <div className="rounded-lg p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//       <div className="disp text-[14px] font-semibold mb-4">Add products</div>

//       <div className="flex gap-2 mb-4">
//         <div className="relative flex-1">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search by product name / barcode / SKU"
//             className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
//             style={{ border: "1px solid var(--line)" }}
//           />
//         </div>
//         <button type="button" className="w-11 flex items-center justify-center rounded-md shrink-0" style={{ border: "1px solid var(--rust)", color: "var(--rust)" }} title="Scan barcode">
//           <ScanLine size={16} />
//         </button>
//         <button type="button" className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-[13px] font-medium shrink-0" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//           <SlidersHorizontal size={14} />
//           Filters
//         </button>
//       </div>

//       <div className="flex flex-wrap gap-2 mb-4">
//         {mockBillingCategories.map((c) => (
//           <button
//             key={c}
//             onClick={() => setCategory(c)}
//             className="px-3 py-1.5 rounded-md text-[12.5px] font-medium"
//             style={{
//               background: category === c ? "var(--brass)" : "transparent",
//               color: category === c ? "#14171C" : "var(--muted)",
//               border: "1px solid " + (category === c ? "var(--brass)" : "var(--line)"),
//             }}
//           >
//             {c}
//           </button>
//         ))}
//       </div>

//       {filtered.length === 0 ? (
//         <div className="rounded-md py-8 text-center text-[13px]" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//           No products match your search.
//         </div>
//       ) : (
//         <>
//           {/* Mobile: stacked cards. Six columns in a table becomes unusable
//               on a phone even with horizontal scroll, so below md this
//               switches to a card per product instead. */}
//           <div className="md:hidden flex flex-col gap-2">
//             {filtered.map((p) => (
//               <div key={p.id} className="rounded-md p-3 flex items-center gap-3" style={{ border: "1px solid var(--line)" }}>
//                 <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--panel2)", border: "1px solid var(--line)" }}>
//                   <Package size={16} style={{ color: "var(--muted)" }} />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="text-[13.5px] font-medium truncate">{p.name}</div>
//                   <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>{p.sku} · {p.stock} in stock</div>
//                   <div className="mono text-[13px] mt-0.5">{formatINR(p.price)}</div>
//                 </div>
//                 <button
//                   onClick={() => onAdd(p)}
//                   className="px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold disp shrink-0"
//                   style={{ background: "var(--brass)", color: "#14171C" }}
//                 >
//                   Add
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Desktop / tablet: full table */}
//           <div className="hidden md:block overflow-x-auto rounded-md" style={{ border: "1px solid var(--line)" }}>
//             <table className="w-full text-left">
//               <thead>
//                 <tr style={{ background: "var(--panel2)" }}>
//                   {["Product", "SKU / Barcode", "Price (₹)", "Stock", "Action"].map((h) => (
//                     <th key={h} className="px-3 py-2.5 text-[11px] font-medium whitespace-nowrap" style={{ color: "var(--muted)" }}>{h.toUpperCase()}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((p) => (
//                   <tr key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
//                     <td className="px-3 py-2.5">
//                       <div className="flex items-center gap-2.5">
//                         <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--panel2)", border: "1px solid var(--line)" }}>
//                           <Package size={15} style={{ color: "var(--muted)" }} />
//                         </div>
//                         <div>
//                           <div className="text-[13px] font-medium whitespace-nowrap">{p.name}</div>
//                           <div className="text-[11px]" style={{ color: "var(--muted)" }}>{p.variant}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-3 py-2.5">
//                       <div className="mono text-[12px]">{p.sku}</div>
//                       <div className="mono text-[10.5px]" style={{ color: "var(--muted)" }}>{p.barcode}</div>
//                     </td>
//                     <td className="px-3 py-2.5 mono text-[13px] whitespace-nowrap">{formatINR(p.price)}</td>
//                     <td className="px-3 py-2.5">
//                       <div className="mono text-[13px]">{p.stock}</div>
//                       <div className="text-[10.5px]" style={{ color: "var(--teal)" }}>in stock</div>
//                     </td>
//                     <td className="px-3 py-2.5">
//                       <button
//                         onClick={() => onAdd(p)}
//                         className="px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold disp"
//                         style={{ background: "var(--brass)", color: "#14171C" }}
//                       >
//                         Add
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
//         <span className="text-[12px]" style={{ color: "var(--muted)" }}>
//           Showing 1 to {filtered.length} of {mockBillingTotalProductCount} products
//         </span>
//         <div className="flex items-center gap-1">
//           {["‹", "1", "2", "3", "…", "250", "›"].map((label, i) => (
//             <button
//               key={i}
//               className="min-w-[28px] h-7 flex items-center justify-center rounded-md text-[12px]"
//               style={{
//                 background: label === "1" ? "var(--brass)" : "transparent",
//                 color: label === "1" ? "#14171C" : "var(--muted)",
//                 border: "1px solid " + (label === "1" ? "var(--brass)" : "var(--line)"),
//               }}
//             >
//               {label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { ScanLine, SlidersHorizontal, Search, Package } from "lucide-react";
import { formatINR } from "../../utils/format";
import { productsApi } from "../../api/products";
import { categoriesApi } from "../../api/Categories";

export function ProductCatalogPanel({ onAdd }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.list(),
        categoriesApi.list(),
      ]);

      setProducts(productsRes);

      setCategories([
        "All",
        ...categoriesRes.map((c) => c.name),
      ]);
    } catch (err) {
      console.error("Failed to load billing catalog", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter((p) => {
    const matchesCategory =
      category === "All" || p.category === category;

    const matchesQuery =
      !query.trim() ||
      p.name?.toLowerCase().includes(query.trim().toLowerCase()) ||
      p.sku?.toLowerCase().includes(query.trim().toLowerCase()) ||
      p.barcode?.includes(query.trim());

    return matchesCategory && matchesQuery;
  });

  if (loading) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
        }}
      >
        Loading products...
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
      }}
    >
      <div className="disp text-[14px] font-semibold mb-4">
        Add products
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted)" }}
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name / barcode / SKU"
            className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
            style={{ border: "1px solid var(--line)" }}
          />
        </div>

        <button
          type="button"
          className="w-11 flex items-center justify-center rounded-md shrink-0"
          style={{
            border: "1px solid var(--rust)",
            color: "var(--rust)",
          }}
          title="Scan barcode"
        >
          <ScanLine size={16} />
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-[13px] font-medium shrink-0"
          style={{
            border: "1px solid var(--line)",
            color: "var(--muted)",
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-3 py-1.5 rounded-md text-[12.5px] font-medium"
            style={{
              background:
                category === c
                  ? "var(--brass)"
                  : "transparent",
              color:
                category === c
                  ? "#14171C"
                  : "var(--muted)",
              border:
                "1px solid " +
                (category === c
                  ? "var(--brass)"
                  : "var(--line)"),
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-md py-8 text-center text-[13px]"
          style={{
            border: "1px solid var(--line)",
            color: "var(--muted)",
          }}
        >
          No products match your search.
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-2">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-md p-3 flex items-center gap-3"
                style={{ border: "1px solid var(--line)" }}
              >
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                  style={{
                    background: "var(--panel2)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <Package
                    size={16}
                    style={{ color: "var(--muted)" }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium truncate">
                    {p.name}
                  </div>

                  <div
                    className="mono text-[11px]"
                    style={{ color: "var(--muted)" }}
                  >
                    {p.sku || "—"} ·{" "}
                    {p.quantity == null
                      ? "Stock not tracked"
                      : `${p.quantity} in stock`}
                  </div>

                  <div className="mono text-[13px] mt-0.5">
                    {formatINR(p.price)}
                  </div>
                </div>

                <button
                  onClick={() => onAdd(p)}
                  className="px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold disp shrink-0"
                  style={{
                    background: "var(--brass)",
                    color: "#14171C",
                  }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div
            className="hidden md:block overflow-x-auto rounded-md"
            style={{ border: "1px solid var(--line)" }}
          >
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: "var(--panel2)" }}>
                  {[
                    "Product",
                    "SKU / Barcode",
                    "Price (₹)",
                    "Stock",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-[11px] font-medium whitespace-nowrap"
                      style={{ color: "var(--muted)" }}
                    >
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      borderTop: "1px solid var(--line)",
                    }}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            background: "var(--panel2)",
                            border: "1px solid var(--line)",
                          }}
                        >
                          <Package
                            size={15}
                            style={{
                              color: "var(--muted)",
                            }}
                          />
                        </div>

                        <div>
                          <div className="text-[13px] font-medium whitespace-nowrap">
                            {p.name}
                          </div>

                          <div
                            className="text-[11px]"
                            style={{
                              color: "var(--muted)",
                            }}
                          >
                            {p.brand || p.category || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="mono text-[12px]">
                        {p.sku || "—"}
                      </div>

                      <div
                        className="mono text-[10.5px]"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        {p.barcode || "—"}
                      </div>
                    </td>

                    <td className="px-3 py-2.5 mono text-[13px] whitespace-nowrap">
                      {formatINR(p.price)}
                    </td>

                    <td className="px-3 py-2.5">
                      {p.quantity == null ? (
                        <>
                          <div className="mono text-[13px]">
                            —
                          </div>

                          <div
                            className="text-[10.5px]"
                            style={{
                              color: "var(--muted)",
                            }}
                          >
                            not tracked
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mono text-[13px]">
                            {p.quantity}
                          </div>

                          <div
                            className="text-[10.5px]"
                            style={{
                              color: "var(--teal)",
                            }}
                          >
                            in stock
                          </div>
                        </>
                      )}
                    </td>

                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => onAdd(p)}
                        className="px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold disp"
                        style={{
                          background: "var(--brass)",
                          color: "#14171C",
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <span
          className="text-[12px]"
          style={{ color: "var(--muted)" }}
        >
          Showing {filtered.length} of {products.length} products
        </span>
      </div>
    </div>
  );
}
