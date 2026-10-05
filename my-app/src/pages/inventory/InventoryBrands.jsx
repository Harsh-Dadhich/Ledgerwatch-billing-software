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

// import { useEffect, useState } from "react";
// import { Plus } from "lucide-react";
// import { brandsApi } from "../../api/Brands";

// export function InventoryBrands({ onAddBrand }) {
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadBrands();
//   }, []);

//   async function loadBrands() {
//     try {
//       const data = await brandsApi.list();
//       setBrands(data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load brands");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const totalBrands = brands.length;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">
//           Brands
//         </h1>

//         <button
//           onClick={onAddBrand}
//           className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
//           style={{
//             background: "var(--brass)",
//             color: "#14171C",
//           }}
//         >
//           <Plus size={15} />
//           Add brand
//         </button>
//       </div>

//       <div
//         className="rounded-lg overflow-hidden"
//         style={{
//           background: "var(--panel)",
//           border: "1px solid var(--line)",
//         }}
//       >
//         <div
//           className="px-4 py-2.5 flex items-center justify-between"
//           style={{ background: "var(--panel2)" }}
//         >
//           <span
//             className="text-[11px] font-medium"
//             style={{ color: "var(--muted)" }}
//           >
//             BRAND NAME
//           </span>

//           <span
//             className="text-[11px] font-medium"
//             style={{ color: "var(--muted)" }}
//           >
//             DESCRIPTION
//           </span>
//         </div>

//         {loading ? (
//           <div className="p-4">Loading...</div>
//         ) : (
//           brands.map((brand) => (
//             <div
//               key={brand.id}
//               className="px-4 py-3 flex items-center justify-between"
//               style={{
//                 borderTop: "1px solid var(--line)",
//               }}
//             >
//               <span className="text-[13.5px]">
//                 {brand.name}
//               </span>

//               <span
//                 className="mono text-[13px]"
//                 style={{ color: "var(--muted)" }}
//               >
//                 {brand.description || "-"}
//               </span>
//             </div>
//           ))
//         )}

//         <div
//           className="px-4 py-3"
//           style={{
//             borderTop: "1px solid var(--line)",
//             background: "var(--panel2)",
//           }}
//         >
//           <span
//             className="mono text-[12px]"
//             style={{ color: "var(--muted)" }}
//           >
//             Total brands: {totalBrands}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useMemo } from "react";
// import { Plus } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// /* ------------------------------------------------------------------ */
// /*  STATIC MOCK DATA — replace with the real analytics endpoint later  */
// /*  Shape each row as: { name, products, units, revenue }              */
// /* ------------------------------------------------------------------ */
// const MOCK_BRANDS = [
//   { name: "Amul", products: 24, units: 500, revenue: 32000 },
//   { name: "Parle", products: 18, units: 430, revenue: 21000 },
//   { name: "Coca Cola", products: 9, units: 390, revenue: 19500 },
//   { name: "Britannia", products: 15, units: 310, revenue: 17200 },
//   { name: "Nestle", products: 12, units: 190, revenue: 12800 },
//   { name: "Dabur", products: 10, units: 70, revenue: 5400 },
// ];

// function formatINR(n) {
//   if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
//   if (n >= 1000) return `₹${Math.round(n / 1000)}k`;
//   return `₹${n}`;
// }

// function StatCard({ label, value, sub }) {
//   return (
//     <div
//       className="rounded-lg p-4"
//       style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
//     >
//       <div className="text-[12px]" style={{ color: "var(--muted)" }}>
//         {label}
//       </div>
//       <div className="disp text-[22px] font-semibold mt-1 leading-tight">
//         {value}
//       </div>
//       {sub && (
//         <div className="mono text-[12px] mt-1" style={{ color: "var(--muted)" }}>
//           {sub}
//         </div>
//       )}
//     </div>
//   );
// }

// function ChartTooltip({ active, payload, valueFormatter }) {
//   if (!active || !payload?.length) return null;
//   const p = payload[0];
//   return (
//     <div
//       className="rounded-md px-3 py-2 text-[12px]"
//       style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
//     >
//       <div className="font-semibold">{p.payload.name}</div>
//       <div className="mono" style={{ color: "var(--muted)" }}>
//         {valueFormatter(p.value)}
//       </div>
//     </div>
//   );
// }

// export function InventoryBrands({ onAddBrand, onViewProducts }) {
//   const data = MOCK_BRANDS;

//   const stats = useMemo(() => {
//     const byRevenue = [...data].sort((a, b) => b.revenue - a.revenue);
//     const byUnits = [...data].sort((a, b) => b.units - a.units);
//     return {
//       total: data.length,
//       topBrand: byUnits[0],
//       highestRevenue: byRevenue[0],
//       lowest: byRevenue[byRevenue.length - 1],
//       byRevenue,
//     };
//   }, [data]);

//   const barData = stats.byRevenue.map((b) => ({
//     name: b.name,
//     value: b.revenue,
//   }));

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">
//           Brands
//         </h1>

//         <button
//           onClick={onAddBrand}
//           className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
//           style={{ background: "var(--brass)", color: "#14171C" }}
//         >
//           <Plus size={15} />
//           Add brand
//         </button>
//       </div>

//       {/* Top cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <StatCard label="Total brands" value={stats.total} />
//         <StatCard
//           label="Top brand"
//           value={stats.topBrand.name}
//           sub={`${stats.topBrand.units} units sold`}
//         />
//         <StatCard
//           label="Highest revenue"
//           value={stats.highestRevenue.name}
//           sub={formatINR(stats.highestRevenue.revenue)}
//         />
//         <StatCard
//           label="Lowest performing"
//           value={stats.lowest.name}
//           sub={formatINR(stats.lowest.revenue)}
//         />
//       </div>

//       {/* Chart */}
//       <div
//         className="rounded-lg p-4 mb-6"
//         style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
//       >
//         <div className="disp text-[15px] font-semibold">Revenue by brand</div>
//         <div className="text-[12px] mt-0.5 mb-3" style={{ color: "var(--muted)" }}>
//           Which brands bring in the most money
//         </div>

//         <div style={{ width: "100%", height: Math.max(180, barData.length * 36) }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={barData}
//               layout="vertical"
//               margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
//             >
//               <XAxis type="number" hide />
//               <YAxis
//                 type="category"
//                 dataKey="name"
//                 width={92}
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fontSize: 12, fill: "#8A929C" }}
//               />
//               <Tooltip
//                 cursor={{ fill: "rgba(255,255,255,0.04)" }}
//                 content={<ChartTooltip valueFormatter={formatINR} />}
//               />
//               <Bar
//                 dataKey="value"
//                 fill="#C9A24B"
//                 radius={[0, 4, 4, 0]}
//                 barSize={16}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Table */}
//       <div
//         className="rounded-lg overflow-x-auto"
//         style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
//       >
//         <table className="w-full text-[13px] min-w-[480px]">
//           <thead>
//             <tr
//               className="text-left"
//               style={{ background: "var(--panel2)", color: "var(--muted)" }}
//             >
//               <th className="font-medium px-4 py-3">Brand</th>
//               <th className="font-medium px-4 py-3 text-right">Products</th>
//               <th className="font-medium px-4 py-3 text-right">Units sold</th>
//               <th className="font-medium px-4 py-3 text-right">Revenue</th>
//               <th className="px-4 py-3" />
//             </tr>
//           </thead>
//           <tbody>
//             {stats.byRevenue.map((b) => (
//               <tr key={b.name} style={{ borderTop: "1px solid var(--line)" }}>
//                 <td className="px-4 py-3 disp font-semibold">{b.name}</td>
//                 <td className="px-4 py-3 mono text-right">{b.products}</td>
//                 <td className="px-4 py-3 mono text-right">{b.units}</td>
//                 <td className="px-4 py-3 mono text-right">
//                   {formatINR(b.revenue)}
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <button
//                     onClick={() => onViewProducts?.(b.name)}
//                     className="text-[12px] font-semibold"
//                     style={{ color: "var(--brass)" }}
//                   >
//                     View products
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr
//               style={{
//                 borderTop: "1px solid var(--line)",
//                 background: "var(--panel2)",
//               }}
//             >
//               <td
//                 colSpan={5}
//                 className="px-4 py-3 mono text-[12px]"
//                 style={{ color: "var(--muted)" }}
//               >
//                 Total brands: {stats.total}
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatINR } from "../../utils/format";
import { dashboardApi } from "../../api/dashboard";

/* ------------------------------------------------------------------ */
/*  brandAnalytics(days) returns one row per brand (including brands   */
/*  with no products or sales):                                        */
/*  { id, name, products, stock, low_stock, units, revenue }           */
/*  id is null for rows that have no brand record, such as             */
/*  "Unbranded"; those rows are shown in the chart and table but are   */
/*  left out of the top cards.                                         */
/* ------------------------------------------------------------------ */

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

const AXIS_TICK = { fontSize: 12, fill: "#8A929C" };

/* ----------------------------- helpers ----------------------------- */

function compact(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}k`;
  return `₹${Math.round(n)}`;
}

function fmtQty(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/* ---------------------------- UI pieces ---------------------------- */

function StatCard({ label, value, sub }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div className="text-[12px]" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="disp text-[22px] font-semibold mt-1 leading-tight truncate">
        {value}
      </div>
      {sub && (
        <div className="mono text-[12px] mt-1" style={{ color: "var(--muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Placeholder({ height, children }) {
  return (
    <div
      className="flex items-center justify-center text-[13px] text-center"
      style={{ height, color: "var(--muted)" }}
    >
      {children}
    </div>
  );
}

function ChartTooltip({ active, payload, valueFormatter }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div
      className="rounded-md px-3 py-2 text-[12px]"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div className="font-semibold">{p.payload.name}</div>
      <div className="mono" style={{ color: "var(--muted)" }}>
        {valueFormatter(p.value)}
      </div>
    </div>
  );
}

function RangeToggle({ value, onChange }) {
  return (
    <div
      className="flex rounded-md p-0.5 shrink-0"
      style={{ border: "1px solid var(--line)" }}
    >
      {RANGES.map((r) => {
        const active = value === r.days;
        return (
          <button
            key={r.days}
            onClick={() => onChange(r.days)}
            className="px-2.5 py-1 rounded text-[12px] font-medium"
            style={{
              background: active ? "var(--brass)" : "transparent",
              color: active ? "#14171C" : "var(--muted)",
            }}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ main ------------------------------- */

// refreshKey: optional. Bump it from the parent to refetch (e.g. after a brand is added).
export function InventoryBrands({ onAddBrand, onViewProducts, refreshKey = 0 }) {
  const [days, setDays] = useState(30);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    // keep the previous data on screen while a new range loads
    setState((s) => ({ ...s, loading: true, error: false }));
    dashboardApi
      .brandAnalytics(days)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: false });
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setState({ data: null, loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [days, refreshKey, attempt]);

  const rows = state.data;

  const view = useMemo(() => {
    const list = rows || [];

    const byRevenue = [...list].sort(
      (a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name)
    );

    // the cards only look at real brand records, not "Unbranded"
    const real = list.filter((r) => r.id);

    const sold = real.filter((r) => r.units > 0);
    const topBrand = sold.length
      ? sold.reduce((a, b) => (b.units > a.units ? b : a))
      : null;

    const earning = real.filter((r) => r.revenue > 0);
    const highest = earning.length
      ? earning.reduce((a, b) => (b.revenue > a.revenue ? b : a))
      : null;

    // "Lowest" only makes sense across brands that actually hold products
    const stocked = real.filter((r) => r.products > 0);
    let lowest =
      stocked.length > 1
        ? stocked.reduce((a, b) => (b.revenue < a.revenue ? b : a))
        : null;
    if (lowest && highest && lowest.name === highest.name) lowest = null;

    const bars = byRevenue
      .filter((r) => r.revenue > 0)
      .slice(0, 8)
      .map((r) => ({ name: r.name, value: r.revenue }));

    return { byRevenue, total: real.length, topBrand, highest, lowest, bars };
  }, [rows]);

  const rangeLabel = `last ${days} days`;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="disp text-[26px] font-semibold tracking-tight">
          Brands
        </h1>

        <button
          onClick={onAddBrand}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
          style={{ background: "var(--brass)", color: "#14171C" }}
        >
          <Plus size={15} />
          Add brand
        </button>
      </div>

      {/* Range */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-[12px]" style={{ color: "var(--muted)" }}>
          Sales shown for the {rangeLabel}
        </div>
        <RangeToggle value={days} onChange={setDays} />
      </div>

      {/* Body states */}
      {!rows && state.loading && <Placeholder height={160}>Loading…</Placeholder>}

      {!rows && state.error && (
        <Placeholder height={160}>
          <div>
            <div>Couldn't load brands.</div>
            <button
              onClick={() => setAttempt((a) => a + 1)}
              className="mt-2 text-[12px] font-semibold"
              style={{ color: "var(--brass)" }}
            >
              Try again
            </button>
          </div>
        </Placeholder>
      )}

      {rows && rows.length === 0 && (
        <Placeholder height={160}>
          No brands yet. Use Add brand to create your first one.
        </Placeholder>
      )}

      {rows && rows.length > 0 && (
        <div style={{ opacity: state.loading ? 0.6 : 1, transition: "opacity 120ms" }}>
          {/* Top cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total brands" value={view.total} />
            <StatCard
              label="Top brand"
              value={view.topBrand ? view.topBrand.name : "—"}
              sub={
                view.topBrand
                  ? `${fmtQty(view.topBrand.units)} units sold`
                  : "No sales in this period"
              }
            />
            <StatCard
              label="Highest revenue"
              value={view.highest ? view.highest.name : "—"}
              sub={
                view.highest
                  ? compact(view.highest.revenue)
                  : "No sales in this period"
              }
            />
            <StatCard
              label="Lowest performing"
              value={view.lowest ? view.lowest.name : "—"}
              sub={view.lowest ? compact(view.lowest.revenue) : "Not enough data yet"}
            />
          </div>

          {/* Chart */}
          <div
            className="rounded-lg p-4 mb-6"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <div className="disp text-[15px] font-semibold">Revenue by brand</div>
            <div
              className="text-[12px] mt-0.5 mb-3"
              style={{ color: "var(--muted)" }}
            >
              Which brands bring in the most money
            </div>

            {view.bars.length === 0 ? (
              <Placeholder height={140}>No sales in this period.</Placeholder>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: Math.max(140, view.bars.length * 36),
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={view.bars}
                    layout="vertical"
                    margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      axisLine={false}
                      tickLine={false}
                      tick={AXIS_TICK}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      content={<ChartTooltip valueFormatter={formatINR} />}
                    />
                    <Bar
                      dataKey="value"
                      fill="#C9A24B"
                      radius={[0, 4, 4, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Table */}
          <div
            className="rounded-lg overflow-x-auto"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <table className="w-full text-[13px] min-w-[480px]">
              <thead>
                <tr
                  className="text-left"
                  style={{ background: "var(--panel2)", color: "var(--muted)" }}
                >
                  <th className="font-medium px-4 py-3">Brand</th>
                  <th className="font-medium px-4 py-3 text-right">Products</th>
                  <th className="font-medium px-4 py-3 text-right">Units sold</th>
                  <th className="font-medium px-4 py-3 text-right">Revenue</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {view.byRevenue.map((b) => (
                  <tr
                    key={b.id ?? b.name}
                    style={{ borderTop: "1px solid var(--line)" }}
                  >
                    <td className="px-4 py-3 disp font-semibold">{b.name}</td>
                    <td className="px-4 py-3 mono text-right">{b.products}</td>
                    <td className="px-4 py-3 mono text-right">{fmtQty(b.units)}</td>
                    <td className="px-4 py-3 mono text-right">
                      {formatINR(b.revenue)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewProducts?.(b.name)}
                        className="text-[12px] font-semibold"
                        style={{ color: "var(--brass)" }}
                      >
                        View products
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    borderTop: "1px solid var(--line)",
                    background: "var(--panel2)",
                  }}
                >
                  <td
                    colSpan={5}
                    className="px-4 py-3 mono text-[12px]"
                    style={{ color: "var(--muted)" }}
                  >
                    Total brands: {view.total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}