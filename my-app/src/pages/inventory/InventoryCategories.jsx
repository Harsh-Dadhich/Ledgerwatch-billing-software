// import { useState } from "react";
// import { Plus, Search } from "lucide-react";
// import { mockCategories } from "../../data/mockInventory";

// export function InventoryCategories() {
//   const [query, setQuery] = useState("");
//   const filtered = query.trim()
//     ? mockCategories.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
//     : mockCategories;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">Categories</h1>
//         <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
//           <Plus size={15} /> Add
//         </button>
//       </div>

//       <div className="relative mb-6 max-w-[360px]">
//         <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search category…"
//           className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
//           style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
//         />
//       </div>

//       <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {filtered.map((c) => (
//           <div key={c.name} className="card-hover rounded-lg p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//             <div className="disp text-[15px] font-semibold">{c.name}</div>
//             <div className="mono text-[12px] mt-1" style={{ color: "var(--muted)" }}>{c.productCount} products</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { Plus, Search } from "lucide-react";
// import { categoriesApi } from "../../api/Categories";

// export function InventoryCategories({ onAddCategory }) {
//   const [query, setQuery] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   async function loadCategories() {
//     try {
//       const data = await categoriesApi.list();
//       setCategories(data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const filtered = query.trim()
//     ? categories.filter((c) =>
//         c.name.toLowerCase().includes(query.trim().toLowerCase())
//       )
//     : categories;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">
//           Categories
//         </h1>

//         <button
//           onClick={onAddCategory}
//           className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
//           style={{
//             background: "var(--brass)",
//             color: "#14171C",
//           }}
//         >
//           <Plus size={15} />
//           Add
//         </button>
//       </div>

//       <div className="relative mb-6 max-w-[360px]">
//         <Search
//           size={15}
//           className="absolute left-3 top-1/2 -translate-y-1/2"
//           style={{ color: "var(--muted)" }}
//         />

//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search category..."
//           className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
//           style={{
//             border: "1px solid var(--line)",
//             background: "var(--panel)",
//           }}
//         />
//       </div>

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {filtered.map((category) => (
//             <div
//               key={category.id}
//               className="card-hover rounded-lg p-4"
//               style={{
//                 background: "var(--panel)",
//                 border: "1px solid var(--line)",
//               }}
//             >
//               <div className="disp text-[15px] font-semibold">
//                 {category.name}
//               </div>

//               <div
//                 className="mono text-[12px] mt-1"
//                 style={{ color: "var(--muted)" }}
//               >
//                 {category.description || "No description"}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// } 

// import { useMemo, useState } from "react";
// import { Plus, Search } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// /* ------------------------------------------------------------------ */
// /*  STATIC MOCK DATA — replace with the real analytics endpoint later  */
// /*  Shape each row as:                                                 */
// /*  { name, products, stock, units, revenue }                          */
// /* ------------------------------------------------------------------ */
// const MOCK_CATEGORIES = [
//   { name: "Beverages", products: 43, stock: 321, units: 800, revenue: 48000 },
//   { name: "Snacks", products: 67, stock: 541, units: 760, revenue: 64000 },
//   { name: "Dairy", products: 22, stock: 112, units: 410, revenue: 27000 },
//   { name: "Staples", products: 31, stock: 260, units: 520, revenue: 38000 },
//   { name: "Personal Care", products: 18, stock: 96, units: 90, revenue: 9500 },
//   { name: "Household", products: 14, stock: 74, units: 60, revenue: 6200 },
// ];

// const CHART_COLORS = [
//   "#C9A24B", // brass
//   "#5B8DB8",
//   "#7FB685",
//   "#B8735B",
//   "#8E7CC3",
//   "#6B7480",
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

// function ChartCard({ title, hint, children }) {
//   return (
//     <div
//       className="rounded-lg p-4"
//       style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
//     >
//       <div className="disp text-[15px] font-semibold">{title}</div>
//       {hint && (
//         <div className="text-[12px] mt-0.5 mb-3" style={{ color: "var(--muted)" }}>
//           {hint}
//         </div>
//       )}
//       {children}
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

// export function InventoryCategories({ onAddCategory, onViewProducts }) {
//   const [query, setQuery] = useState("");

//   const data = MOCK_CATEGORIES;

//   const stats = useMemo(() => {
//     const byRevenue = [...data].sort((a, b) => b.revenue - a.revenue);
//     const byUnits = [...data].sort((a, b) => b.units - a.units);
//     return {
//       total: data.length,
//       best: byUnits[0],
//       slowest: byUnits[byUnits.length - 1],
//       revenue: data.reduce((sum, c) => sum + c.revenue, 0),
//       byRevenue,
//       byUnits,
//     };
//   }, [data]);

//   const donutData = stats.byRevenue.map((c) => ({
//     name: c.name,
//     value: c.revenue,
//   }));

//   const barData = stats.byUnits.map((c) => ({ name: c.name, value: c.units }));

//   const filtered = query.trim()
//     ? stats.byRevenue.filter((c) =>
//         c.name.toLowerCase().includes(query.trim().toLowerCase())
//       )
//     : stats.byRevenue;

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">
//           Categories
//         </h1>

//         <button
//           onClick={onAddCategory}
//           className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
//           style={{ background: "var(--brass)", color: "#14171C" }}
//         >
//           <Plus size={15} />
//           Add
//         </button>
//       </div>

//       {/* Top cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <StatCard label="Total categories" value={stats.total} />
//         <StatCard
//           label="Best selling"
//           value={stats.best.name}
//           sub={`${stats.best.units} units sold`}
//         />
//         <StatCard
//           label="Slowest"
//           value={stats.slowest.name}
//           sub={`${stats.slowest.units} units sold`}
//         />
//         <StatCard label="Category revenue" value={formatINR(stats.revenue)} />
//       </div>

//       {/* Charts */}
//       <div className="grid md:grid-cols-2 gap-4 mb-6">
//         <ChartCard
//           title="Revenue by category"
//           hint="Where most of your money comes from"
//         >
//           <div className="flex items-center gap-4">
//             <div style={{ width: 170, height: 170 }} className="shrink-0">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={donutData}
//                     dataKey="value"
//                     nameKey="name"
//                     innerRadius={48}
//                     outerRadius={80}
//                     paddingAngle={2}
//                     stroke="none"
//                   >
//                     {donutData.map((_, i) => (
//                       <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     content={<ChartTooltip valueFormatter={formatINR} />}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <ul className="flex-1 min-w-0 space-y-1.5">
//               {donutData.map((d, i) => (
//                 <li
//                   key={d.name}
//                   className="flex items-center gap-2 text-[13px]"
//                 >
//                   <span
//                     className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
//                     style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
//                   />
//                   <span className="truncate flex-1">{d.name}</span>
//                   <span className="mono" style={{ color: "var(--muted)" }}>
//                     {Math.round((d.value / stats.revenue) * 100)}%
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </ChartCard>

//         <ChartCard
//           title="Units sold by category"
//           hint="Use this to decide what to restock"
//         >
//           <div style={{ width: "100%", height: 190 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={barData}
//                 layout="vertical"
//                 margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
//               >
//                 <XAxis type="number" hide />
//                 <YAxis
//                   type="category"
//                   dataKey="name"
//                   width={92}
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 12, fill: "#8A929C" }}
//                 />
//                 <Tooltip
//                   cursor={{ fill: "rgba(255,255,255,0.04)" }}
//                   content={
//                     <ChartTooltip valueFormatter={(v) => `${v} units`} />
//                   }
//                 />
//                 <Bar
//                   dataKey="value"
//                   fill="#C9A24B"
//                   radius={[0, 4, 4, 0]}
//                   barSize={14}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </ChartCard>
//       </div>

//       {/* Search */}
//       <div className="relative mb-4 max-w-[360px]">
//         <Search
//           size={15}
//           className="absolute left-3 top-1/2 -translate-y-1/2"
//           style={{ color: "var(--muted)" }}
//         />
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search category..."
//           className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
//           style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
//         />
//       </div>

//       {/* Table */}
//       <div
//         className="rounded-lg overflow-x-auto"
//         style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
//       >
//         <table className="w-full text-[13px] min-w-[560px]">
//           <thead>
//             <tr
//               className="text-left"
//               style={{ color: "var(--muted)", borderBottom: "1px solid var(--line)" }}
//             >
//               <th className="font-medium px-4 py-3">Category</th>
//               <th className="font-medium px-4 py-3 text-right">Products</th>
//               <th className="font-medium px-4 py-3 text-right">Stock qty</th>
//               <th className="font-medium px-4 py-3 text-right">Units sold</th>
//               <th className="font-medium px-4 py-3 text-right">Revenue</th>
//               <th className="px-4 py-3" />
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((c) => (
//               <tr
//                 key={c.name}
//                 style={{ borderBottom: "1px solid var(--line)" }}
//               >
//                 <td className="px-4 py-3 disp font-semibold">{c.name}</td>
//                 <td className="px-4 py-3 mono text-right">{c.products}</td>
//                 <td className="px-4 py-3 mono text-right">{c.stock}</td>
//                 <td className="px-4 py-3 mono text-right">{c.units}</td>
//                 <td className="px-4 py-3 mono text-right">
//                   {formatINR(c.revenue)}
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <button
//                     onClick={() => onViewProducts?.(c.name)}
//                     className="text-[12px] font-semibold"
//                     style={{ color: "var(--brass)" }}
//                   >
//                     View products
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filtered.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="px-4 py-6 text-center"
//                   style={{ color: "var(--muted)" }}
//                 >
//                   No categories match your search.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
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
/*  GET /dashboard/category-analytics?days=N returns one row per       */
/*  category (including ones with no products or sales):               */
/*  { id, name, products, stock, low_stock, units, revenue }           */
/* ------------------------------------------------------------------ */

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

const CHART_COLORS = ["#C9A24B", "#5B8DB8", "#7FB685", "#B8735B", "#8E7CC3"];
const OTHERS_COLOR = "#6B7480";
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

function pctLabel(value, total) {
  if (!total) return "0%";
  const p = (value / total) * 100;
  return p > 0 && p < 1 ? "<1%" : `${Math.round(p)}%`;
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

function ChartCard({ title, hint, children }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div className="disp text-[15px] font-semibold">{title}</div>
      {hint && (
        <div className="text-[12px] mt-0.5 mb-3" style={{ color: "var(--muted)" }}>
          {hint}
        </div>
      )}
      {children}
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

// refreshKey: optional. Bump it from the parent to refetch (e.g. after a category is added).
export function InventoryCategories({ onAddCategory, onViewProducts, refreshKey = 0 }) {
  const [query, setQuery] = useState("");
  const [days, setDays] = useState(30);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    // keep the previous data on screen while a new range loads
    setState((s) => ({ ...s, loading: true, error: false }));
    dashboardApi
      .categoryAnalytics(days)
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

    const sold = list.filter((r) => r.units > 0);
    const best = sold.length
      ? sold.reduce((a, b) => (b.units > a.units ? b : a))
      : null;

    // "Slowest" only makes sense across categories that actually hold products
    const stocked = list.filter((r) => r.products > 0);
    let slowest =
      stocked.length > 1
        ? stocked.reduce((a, b) => (b.units < a.units ? b : a))
        : null;
    if (slowest && best && slowest.name === best.name) slowest = null;

    const revenue = list.reduce((sum, r) => sum + r.revenue, 0);

    // donut: top 5 by revenue, the rest grouped as "Others"
    const withRevenue = byRevenue.filter((r) => r.revenue > 0);
    const donut = withRevenue.slice(0, 5).map((r, i) => ({
      name: r.name,
      value: r.revenue,
      color: CHART_COLORS[i],
    }));
    const othersSum = withRevenue.slice(5).reduce((sum, r) => sum + r.revenue, 0);
    if (othersSum > 0) {
      donut.push({ name: "Others", value: othersSum, color: OTHERS_COLOR });
    }

    const bars = [...sold]
      .sort((a, b) => b.units - a.units)
      .slice(0, 8)
      .map((r) => ({ name: r.name, value: r.units }));

    return { byRevenue, best, slowest, revenue, donut, bars, total: list.length };
  }, [rows]);

  const filtered = query.trim()
    ? view.byRevenue.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : view.byRevenue;

  const rangeLabel = `last ${days} days`;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="disp text-[26px] font-semibold tracking-tight">
          Categories
        </h1>

        <button
          onClick={onAddCategory}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-semibold disp"
          style={{ background: "var(--brass)", color: "#14171C" }}
        >
          <Plus size={15} />
          Add
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
            <div>Couldn't load categories.</div>
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
          No categories yet. Use Add to create your first one.
        </Placeholder>
      )}

      {rows && rows.length > 0 && (
        <div style={{ opacity: state.loading ? 0.6 : 1, transition: "opacity 120ms" }}>
          {/* Top cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total categories" value={view.total} />
            <StatCard
              label="Best selling"
              value={view.best ? view.best.name : "—"}
              sub={
                view.best
                  ? `${fmtQty(view.best.units)} units sold`
                  : "No sales in this period"
              }
            />
            <StatCard
              label="Slowest"
              value={view.slowest ? view.slowest.name : "—"}
              sub={
                view.slowest
                  ? `${fmtQty(view.slowest.units)} units sold`
                  : "Not enough data yet"
              }
            />
            <StatCard
              label="Category revenue"
              value={compact(view.revenue)}
              sub={rangeLabel}
            />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ChartCard
              title="Revenue by category"
              hint="Where most of your money comes from"
            >
              {view.donut.length === 0 ? (
                <Placeholder height={170}>No sales in this period.</Placeholder>
              ) : (
                <div className="flex items-center gap-4">
                  <div style={{ width: 170, height: 170 }} className="shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={view.donut}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={80}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {view.donut.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={
                            <ChartTooltip
                              valueFormatter={(v) =>
                                `${formatINR(v)} · ${pctLabel(v, view.revenue)}`
                              }
                            />
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <ul className="flex-1 min-w-0 space-y-1.5">
                    {view.donut.map((d) => (
                      <li
                        key={d.name}
                        className="flex items-center gap-2 text-[13px]"
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ background: d.color }}
                        />
                        <span className="truncate flex-1">{d.name}</span>
                        <span className="mono" style={{ color: "var(--muted)" }}>
                          {pctLabel(d.value, view.revenue)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ChartCard>

            <ChartCard
              title="Units sold by category"
              hint="Use this to decide what to restock"
            >
              {view.bars.length === 0 ? (
                <Placeholder height={170}>No sales in this period.</Placeholder>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: Math.max(140, view.bars.length * 30 + 20),
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
                        content={
                          <ChartTooltip
                            valueFormatter={(v) => `${fmtQty(v)} units`}
                          />
                        }
                      />
                      <Bar
                        dataKey="value"
                        fill="#C9A24B"
                        radius={[0, 4, 4, 0]}
                        barSize={14}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
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
              placeholder="Search category..."
              className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
              style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
            />
          </div>

          {/* Table */}
          <div
            className="rounded-lg overflow-x-auto"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <table className="w-full text-[13px] min-w-[640px]">
              <thead>
                <tr
                  className="text-left"
                  style={{
                    color: "var(--muted)",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <th className="font-medium px-4 py-3">Category</th>
                  <th className="font-medium px-4 py-3 text-right">Products</th>
                  <th className="font-medium px-4 py-3 text-right">Stock qty</th>
                  <th className="font-medium px-4 py-3 text-right">Low stock</th>
                  <th className="font-medium px-4 py-3 text-right">Units sold</th>
                  <th className="font-medium px-4 py-3 text-right">Revenue</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id ?? c.name}
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <td className="px-4 py-3 disp font-semibold">{c.name}</td>
                    <td className="px-4 py-3 mono text-right">{c.products}</td>
                    <td className="px-4 py-3 mono text-right">{fmtQty(c.stock)}</td>
                    <td
                      className="px-4 py-3 mono text-right"
                      style={{ color: c.low_stock > 0 ? "#B8735B" : "var(--muted)" }}
                    >
                      {c.low_stock > 0 ? c.low_stock : "—"}
                    </td>
                    <td className="px-4 py-3 mono text-right">{fmtQty(c.units)}</td>
                    <td className="px-4 py-3 mono text-right">
                      {formatINR(c.revenue)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewProducts?.(c.name)}
                        className="text-[12px] font-semibold"
                        style={{ color: "var(--brass)" }}
                      >
                        View products
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center"
                      style={{ color: "var(--muted)" }}
                    >
                      No categories match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}