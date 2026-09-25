// import { Plus } from "lucide-react";
// import { mockBrands } from "../../data/mockInventory";

// export function InventoryBrands() {
//   const totalBrands = mockBrands.length;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">Brands</h1>
//         <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
//           <Plus size={15} /> Add brand
//         </button>
//       </div>

//       <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//         <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "var(--panel2)" }}>
//           <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>BRAND NAME</span>
//           <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>PRODUCTS</span>
//         </div>
//         {mockBrands.map((b, i) => (
//           <div key={b.name} className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--line)" }}>
//             <span className="text-[13.5px]">{b.name}</span>
//             <span className="mono text-[13px]" style={{ color: "var(--muted)" }}>{b.productCount}</span>
//           </div>
//         ))}
//         <div className="px-4 py-3" style={{ borderTop: "1px solid var(--line)", background: "var(--panel2)" }}>
//           <span className="mono text-[12px]" style={{ color: "var(--muted)" }}>Total brands: {totalBrands}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { brandsApi } from "../../api/Brands";

export function InventoryBrands({ onAddBrand }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    try {
      const data = await brandsApi.list();
      setBrands(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

  const totalBrands = brands.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="disp text-[26px] font-semibold tracking-tight">
          Brands
        </h1>

        <button
          onClick={onAddBrand}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
          style={{
            background: "var(--brass)",
            color: "#14171C",
          }}
        >
          <Plus size={15} />
          Add brand
        </button>
      </div>

      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
        }}
      >
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ background: "var(--panel2)" }}
        >
          <span
            className="text-[11px] font-medium"
            style={{ color: "var(--muted)" }}
          >
            BRAND NAME
          </span>

          <span
            className="text-[11px] font-medium"
            style={{ color: "var(--muted)" }}
          >
            DESCRIPTION
          </span>
        </div>

        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          brands.map((brand) => (
            <div
              key={brand.id}
              className="px-4 py-3 flex items-center justify-between"
              style={{
                borderTop: "1px solid var(--line)",
              }}
            >
              <span className="text-[13.5px]">
                {brand.name}
              </span>

              <span
                className="mono text-[13px]"
                style={{ color: "var(--muted)" }}
              >
                {brand.description || "-"}
              </span>
            </div>
          ))
        )}

        <div
          className="px-4 py-3"
          style={{
            borderTop: "1px solid var(--line)",
            background: "var(--panel2)",
          }}
        >
          <span
            className="mono text-[12px]"
            style={{ color: "var(--muted)" }}
          >
            Total brands: {totalBrands}
          </span>
        </div>
      </div>
    </div>
  );
}