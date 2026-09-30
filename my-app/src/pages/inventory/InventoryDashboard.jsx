// import { AlertTriangle, Boxes, Layers, TrendingUp } from "lucide-react";
// import { StatCard } from "../../components/common/StatCard";
// import { SectionLabel } from "../../components/common/SectionLabel";
// import { formatINR } from "../../utils/format";
// import { mockInventorySummary, mockLowStockAlerts, mockTopSelling } from "../../data/mockInventory";

// export function InventoryDashboard({ onViewLowStock }) {
//   return (
//     <div className="flex flex-col gap-8">
//       <div>
//         <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Inventory dashboard</h1>
//         <p className="text-[13.5px]" style={{ color: "var(--muted)" }}>An overview of your stock across the store.</p>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard label="Total products" value={mockInventorySummary.totalProducts.toLocaleString("en-IN")} icon={Boxes} isText />
//         <StatCard label="Total stock value" value={formatINR(mockInventorySummary.totalStockValue)} icon={TrendingUp} isText />
//         <StatCard label="Low stock" value={mockInventorySummary.lowStockCount} icon={AlertTriangle} />
//         <StatCard label="Categories" value={mockInventorySummary.categoryCount} icon={Layers} />
//       </div>

//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <SectionLabel>Low stock alerts</SectionLabel>
//         </div>
//         <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//           {mockLowStockAlerts.map((item, i) => (
//             <div key={i} className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: i < mockLowStockAlerts.length - 1 ? "1px solid var(--line)" : "none" }}>
//               <div>
//                 <div className="text-[13.5px] font-medium">{item.name}</div>
//                 <div className="mono text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
//                   {item.stock} in stock · min {item.minStock}
//                 </div>
//               </div>
//               <button
//                 onClick={onViewLowStock}
//                 className="px-3 py-1.5 rounded-md text-[12px] font-medium shrink-0"
//                 style={{ border: "1px solid var(--rust)", color: "var(--rust)" }}
//               >
//                 Restock
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div>
//         <SectionLabel>Top selling products</SectionLabel>
//         <div className="mt-2 rounded-lg overflow-hidden" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//           {mockTopSelling.map((item, i) => (
//             <div key={i} className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: i < mockTopSelling.length - 1 ? "1px solid var(--line)" : "none" }}>
//               <span className="text-[13.5px]">{item.name}</span>
//               <span className="mono text-[12.5px]" style={{ color: "var(--teal)" }}>{item.soldThisMonth.toLocaleString("en-IN")} sold this month</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { AlertTriangle, Boxes, Layers, TrendingUp } from "lucide-react";

import { StatCard } from "../../components/common/StatCard";
import { SectionLabel } from "../../components/common/SectionLabel";
import { formatINR } from "../../utils/format";
import { productsApi } from "../../api/products";

export function InventoryDashboard({ onViewLowStock }) {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [productsData, lowStockData] = await Promise.all([
        productsApi.list({
        page: 1,
        limit: 100,
      }),
        productsApi.lowStock(),
      ]);

      setProducts(productsData.items);
      setLowStockProducts(lowStockData);
    } catch (err) {
      console.error("Failed to load inventory dashboard:", err);
      setError("Failed to load inventory data.");
    } finally {
      setLoading(false);
    }
  } 

  // -----------------------------
  // Dashboard calculations
  // -----------------------------

  const totalProducts = products.length;

  const totalStockValue = products.reduce((total, product) => {
    if (product.quantity == null) {
      return total;
    }

    return total + Number(product.price || 0) * Number(product.quantity);
  }, 0);

  const lowStockCount = lowStockProducts.length;

  const categoryCount = new Set(
    products
      .map((product) => product.category)
      .filter(Boolean)
  ).size;

  // Only show a few alerts on dashboard.
  // Full list is available on Low Stock page.
  const lowStockAlerts = lowStockProducts.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">
          Inventory dashboard
        </h1>

        <p
          className="text-[13.5px]"
          style={{ color: "var(--muted)" }}
        >
          An overview of your stock across the store.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-lg px-4 py-3 text-[13px]"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--rust)",
            color: "var(--rust)",
          }}
        >
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total products"
          value={
            loading
              ? "—"
              : totalProducts.toLocaleString("en-IN")
          }
          icon={Boxes}
          isText
        />

        <StatCard
          label="Total stock value"
          value={
            loading
              ? "—"
              : formatINR(totalStockValue)
          }
          icon={TrendingUp}
          isText
        />

        <StatCard
          label="Low stock"
          value={loading ? "—" : lowStockCount}
          icon={AlertTriangle}
        />

        <StatCard
          label="Categories"
          value={loading ? "—" : categoryCount}
          icon={Layers}
        />
      </div>

      {/* Low Stock Alerts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Low stock alerts</SectionLabel>
        </div>

        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
          }}
        >
          {loading ? (
            <div
              className="px-4 py-6 text-center text-[13px]"
              style={{ color: "var(--muted)" }}
            >
              Loading stock alerts...
            </div>
          ) : lowStockAlerts.length === 0 ? (
            <div
              className="px-4 py-6 text-center text-[13px]"
              style={{ color: "var(--muted)" }}
            >
              No low stock products.
            </div>
          ) : (
            lowStockAlerts.map((item, i) => (
              <div
                key={item.id}
                className="px-4 py-3 flex items-center justify-between gap-3"
                style={{
                  borderBottom:
                    i < lowStockAlerts.length - 1
                      ? "1px solid var(--line)"
                      : "none",
                }}
              >
                <div>
                  <div className="text-[13.5px] font-medium">
                    {item.name}
                  </div>

                  <div
                    className="mono text-[11px] mt-0.5"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.quantity} in stock · min {item.min_stock}
                  </div>
                </div>

                <button
                  onClick={onViewLowStock}
                  className="px-3 py-1.5 rounded-md text-[12px] font-medium shrink-0"
                  style={{
                    border: "1px solid var(--rust)",
                    color: "var(--rust)",
                  }}
                >
                  Restock
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Selling Products */}
      <div>
        <SectionLabel>Top selling products</SectionLabel>

        <div
          className="mt-2 rounded-lg overflow-hidden"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
          }}
        >
          <div
            className="px-4 py-6 text-center text-[13px]"
            style={{ color: "var(--muted)" }}
          >
            Sales analytics will appear here once sales data is connected.
          </div>
        </div>
      </div>
    </div>
  );
}