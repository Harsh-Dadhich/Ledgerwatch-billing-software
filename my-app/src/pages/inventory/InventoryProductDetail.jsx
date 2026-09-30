// import { ArrowLeft } from "lucide-react";
// import { formatINR } from "../../utils/format";
// import { mockProductDetail } from "../../data/mockInventory";

// export function InventoryProductDetail({ onBack, onViewHistory }) {
//   const p = mockProductDetail;

//   return (
//     <div>
//       <button onClick={onBack} className="flex items-center gap-1.5 text-[12.5px] mb-4" style={{ color: "var(--muted)" }}>
//         <ArrowLeft size={14} /> Back to products
//       </button>
//       <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">{p.name}</h1>

//       <div className="max-w-[560px] flex flex-col gap-6">
//         <div className="rounded-lg p-4 grid grid-cols-2 gap-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//           {[
//             ["SKU", p.sku], ["Barcode", p.barcode], ["Brand", p.brand], ["Category", p.category],
//             ["Purchase price", formatINR(p.purchasePrice)], ["Selling price", formatINR(p.sellingPrice)],
//             ["MRP", formatINR(p.mrp)], ["GST", `${p.gst}%`],
//             ["Current stock", p.currentStock], ["Minimum stock", p.minStock],
//           ].map(([label, value]) => (
//             <div key={label}>
//               <div className="text-[11px]" style={{ color: "var(--muted)" }}>{label}</div>
//               <div className="mono text-[14px] mt-0.5">{value}</div>
//             </div>
//           ))}
//         </div>

//         <div>
//           <div className="mono text-[11px] mb-2" style={{ color: "var(--brass)" }}>STOCK SUMMARY</div>
//           <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//             {[
//               ["Opening stock", p.stockSummary.opening],
//               ["Purchases", `+${p.stockSummary.purchases}`],
//               ["Sales", p.stockSummary.sales],
//               ["Adjustments", p.stockSummary.adjustments],
//             ].map(([label, value], i) => (
//               <div key={label} className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line)" }}>
//                 <span className="text-[13px]" style={{ color: "var(--muted)" }}>{label}</span>
//                 <span className="mono text-[13px]">{value}</span>
//               </div>
//             ))}
//             <div className="px-4 py-3 flex items-center justify-between" style={{ background: "var(--panel2)" }}>
//               <span className="disp text-[13.5px] font-semibold" style={{ color: "var(--muted)" }}>CURRENT STOCK</span>
//               <span className="mono text-[18px] font-semibold" style={{ color: "var(--brass)" }}>{p.currentStock}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <button className="flex-1 rounded-md py-2.5 text-[13.5px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
//             Edit product
//           </button>
//           <button onClick={onViewHistory} className="flex-1 rounded-md py-2.5 text-[13.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//             View stock history
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { ArrowLeft } from "lucide-react";
import { formatINR } from "../../utils/format";

export function InventoryProductDetail({
  product,
  onBack,
  onViewHistory,
}) {
  if (!product) {
    return (
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12.5px] mb-4"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={14} />
          Back to products
        </button>

        <div
          className="rounded-lg p-6 text-center"
          style={{
            border: "1px solid var(--line)",
            background: "var(--panel)",
          }}
        >
          Product not found.
        </div>
      </div>
    );
  }

  const stockStatus =
    product.quantity == null
      ? "Not tracked"
      : product.quantity <= 0
        ? "Out of stock"
        : product.quantity <= (product.min_stock ?? 0)
          ? "Low stock"
          : "In stock";

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] mb-4"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={14} />
        Back to products
      </button>

      <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">
        {product.name}
      </h1>

      <div className="max-w-[700px] flex flex-col gap-6">
        <div
          className="rounded-lg p-4 grid grid-cols-2 gap-4"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
          }}
        >
          {[
            ["SKU", product.sku || "—"],
            ["Barcode", product.barcode || "—"],
            ["Brand", product.brand || "—"],
            ["Category", product.category || "—"],

            [
              "Purchase price",
              product.purchase_price != null
                ? formatINR(product.purchase_price)
                : "—",
            ],

            ["Selling price", formatINR(product.price)],

            [
              "MRP",
              product.mrp != null
                ? formatINR(product.mrp)
                : "—",
            ],

            ["GST", `${product.gst_pct ?? 0}%`],

            [
              "Current stock",
              product.quantity == null
                ? "Not tracked"
                : product.quantity,
            ],

            [
              "Minimum stock",
              product.min_stock != null
                ? product.min_stock
                : "—",
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <div
                className="text-[11px]"
                style={{ color: "var(--muted)" }}
              >
                {label}
              </div>

              <div className="mono text-[14px] mt-0.5">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-4"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
          }}
        >
          <div
            className="mono text-[11px] mb-3"
            style={{ color: "var(--brass)" }}
          >
            STOCK STATUS
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-[13px]"
              style={{ color: "var(--muted)" }}
            >
              Inventory status
            </span>

            <span
              className="mono text-[14px] font-semibold"
              style={{
                color:
                  stockStatus === "In stock"
                    ? "var(--teal)"
                    : stockStatus === "Low stock"
                      ? "var(--brass)"
                      : stockStatus === "Out of stock"
                        ? "var(--rust)"
                        : "var(--ivory)",
              }}
            >
              {stockStatus}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 rounded-md py-2.5 text-[13.5px] font-semibold disp"
            style={{
              background: "var(--brass)",
              color: "#14171C",
            }}
          >
            Edit product
          </button>

          <button
            onClick={onViewHistory}
            className="flex-1 rounded-md py-2.5 text-[13.5px] font-medium"
            style={{
              border: "1px solid var(--line)",
              color: "var(--muted)",
            }}
          >
            View stock history
          </button>
        </div>
      </div>
    </div>
  );
}