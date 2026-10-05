// import { useMemo, useState } from "react";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   BarChart,
//   Bar,
//   Cell,
//   PieChart,
//   Pie,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { formatINR } from "../../utils/format";

// /* ------------------------------------------------------------------ */
// /*  STATIC MOCK DATA — replace each block with real API data later.    */
// /* ------------------------------------------------------------------ */

// // Sales trend: [{ label, value }] — value is total sales (₹) for that day
// const TREND_7 = [
//   { label: "Mon", value: 9200 },
//   { label: "Tue", value: 11400 },
//   { label: "Wed", value: 8700 },
//   { label: "Thu", value: 12800 },
//   { label: "Fri", value: 15100 },
//   { label: "Sat", value: 18900 },
//   { label: "Sun", value: 16400 },
// ];

// const TREND_30 = Array.from({ length: 30 }, (_, i) => ({
//   label: `${i + 1}`,
//   value: 8000 + ((i * 37) % 11) * 900 + (i % 7 === 5 ? 4000 : 0),
// }));

// // Top products: [{ name, value }] — value is units sold
// const TOP_PRODUCTS = [
//   { name: "Coca Cola 750ml", value: 182 },
//   { name: "Amul Milk 500ml", value: 164 },
//   { name: "Parle G", value: 141 },
//   { name: "Britannia Bread", value: 98 },
//   { name: "Maggi 70g", value: 87 },
// ];

// // Payment split: [{ name, value }] — value is total ₹ (or bill count)
// const PAYMENT_SPLIT = [
//   { name: "Cash", value: 60, color: "#C9A24B" },
//   { name: "Online", value: 30, color: "#5FB3A8" },
//   { name: "Due", value: 10, color: "#B8735B" },
// ];

// // Sales by hour: [{ name, value }] — value is total sales (₹) in that window
// const SALES_BY_HOUR = [
//   { name: "9-11 AM", value: 6200 },
//   { name: "11-1 PM", value: 9800 },
//   { name: "1-3 PM", value: 7400 },
//   { name: "3-5 PM", value: 8100 },
//   { name: "5-7 PM", value: 14600 },
//   { name: "7-9 PM", value: 11200 },
// ];

// const AXIS_TICK = { fontSize: 12, fill: "#8A929C" };

// function compact(n) {
//   if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
//   if (n >= 1000) return `₹${Math.round(n / 1000)}k`;
//   return `₹${n}`;
// }

// function ChartCard({ title, hint, action, className = "", children }) {
//   return (
//     <div
//       className={`rounded-lg p-4 ${className}`}
//       style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
//     >
//       <div className="flex items-start justify-between gap-3 mb-3">
//         <div>
//           <div className="disp text-[15px] font-semibold">{title}</div>
//           {hint && (
//             <div className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
//               {hint}
//             </div>
//           )}
//         </div>
//         {action}
//       </div>
//       {children}
//     </div>
//   );
// }

// function ChartTooltip({ active, payload, label, valueFormatter }) {
//   if (!active || !payload?.length) return null;
//   const p = payload[0];
//   return (
//     <div
//       className="rounded-md px-3 py-2 text-[12px]"
//       style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
//     >
//       <div className="font-semibold">{label ?? p.payload.name}</div>
//       <div className="mono" style={{ color: "var(--muted)" }}>
//         {valueFormatter(p.value)}
//       </div>
//     </div>
//   );
// }

// function RangeToggle({ value, onChange }) {
//   const options = [
//     { key: "7", label: "7 days" },
//     { key: "30", label: "30 days" },
//   ];
//   return (
//     <div
//       className="flex rounded-md p-0.5 shrink-0"
//       style={{ border: "1px solid var(--line)" }}
//     >
//       {options.map((o) => {
//         const active = value === o.key;
//         return (
//           <button
//             key={o.key}
//             onClick={() => onChange(o.key)}
//             className="px-2.5 py-1 rounded text-[12px] font-medium"
//             style={{
//               background: active ? "var(--brass)" : "transparent",
//               color: active ? "#14171C" : "var(--muted)",
//             }}
//           >
//             {o.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// export function DashboardCharts() {
//   const [range, setRange] = useState("7");

//   const trendData = range === "7" ? TREND_7 : TREND_30;

//   const paymentTotal = useMemo(
//     () => PAYMENT_SPLIT.reduce((sum, p) => sum + p.value, 0),
//     []
//   );

//   const peak = useMemo(
//     () => SALES_BY_HOUR.reduce((a, b) => (b.value > a.value ? b : a)),
//     []
//   );

//   return (
//     <div className="grid md:grid-cols-2 gap-4">
//       {/* Chart 1: Sales trend */}
//       <ChartCard
//         title="Sales trend"
//         hint={range === "7" ? "Last 7 days" : "Last 30 days"}
//         action={<RangeToggle value={range} onChange={setRange} />}
//         className="md:col-span-2"
//       >
//         <div style={{ width: "100%", height: 220 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={trendData}
//               margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
//             >
//               <CartesianGrid
//                 stroke="rgba(255,255,255,0.06)"
//                 strokeDasharray="3 3"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="label"
//                 axisLine={false}
//                 tickLine={false}
//                 tick={AXIS_TICK}
//                 interval={range === "30" ? 4 : 0}
//               />
//               <YAxis
//                 axisLine={false}
//                 tickLine={false}
//                 tick={AXIS_TICK}
//                 width={48}
//                 tickFormatter={compact}
//               />
//               <Tooltip
//                 cursor={{ stroke: "rgba(255,255,255,0.15)" }}
//                 content={<ChartTooltip valueFormatter={formatINR} />}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#C9A24B"
//                 strokeWidth={2.5}
//                 dot={range === "7" ? { r: 3, fill: "#C9A24B", strokeWidth: 0 } : false}
//                 activeDot={{ r: 5 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </ChartCard>

//       {/* Chart 2: Top products */}
//       <ChartCard title="Top products" hint="Units sold">
//         <div style={{ width: "100%", height: 210 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={TOP_PRODUCTS}
//               layout="vertical"
//               margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
//             >
//               <XAxis type="number" hide />
//               <YAxis
//                 type="category"
//                 dataKey="name"
//                 width={112}
//                 axisLine={false}
//                 tickLine={false}
//                 tick={AXIS_TICK}
//               />
//               <Tooltip
//                 cursor={{ fill: "rgba(255,255,255,0.04)" }}
//                 content={<ChartTooltip valueFormatter={(v) => `${v} units`} />}
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
//       </ChartCard>

//       {/* Chart 3: Payment method split */}
//       <ChartCard title="Payment methods" hint="How customers pay">
//         <div className="flex items-center gap-4">
//           <div style={{ width: 170, height: 170 }} className="shrink-0">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={PAYMENT_SPLIT}
//                   dataKey="value"
//                   nameKey="name"
//                   innerRadius={48}
//                   outerRadius={80}
//                   paddingAngle={2}
//                   stroke="none"
//                 >
//                   {PAYMENT_SPLIT.map((p) => (
//                     <Cell key={p.name} fill={p.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   content={
//                     <ChartTooltip
//                       valueFormatter={(v) =>
//                         `${Math.round((v / paymentTotal) * 100)}%`
//                       }
//                     />
//                   }
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <ul className="flex-1 min-w-0 space-y-2">
//             {PAYMENT_SPLIT.map((p) => (
//               <li key={p.name} className="flex items-center gap-2 text-[13px]">
//                 <span
//                   className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
//                   style={{ background: p.color }}
//                 />
//                 <span className="flex-1">{p.name}</span>
//                 <span className="mono" style={{ color: "var(--muted)" }}>
//                   {Math.round((p.value / paymentTotal) * 100)}%
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </ChartCard>

//       {/* Chart 4: Sales by hour */}
//       <ChartCard
//         title="Sales by hour"
//         hint={`Peak time: ${peak.name}`}
//         className="md:col-span-2"
//       >
//         <div style={{ width: "100%", height: 200 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={SALES_BY_HOUR}
//               margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
//             >
//               <CartesianGrid
//                 stroke="rgba(255,255,255,0.06)"
//                 strokeDasharray="3 3"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="name"
//                 axisLine={false}
//                 tickLine={false}
//                 tick={AXIS_TICK}
//               />
//               <YAxis
//                 axisLine={false}
//                 tickLine={false}
//                 tick={AXIS_TICK}
//                 width={48}
//                 tickFormatter={compact}
//               />
//               <Tooltip
//                 cursor={{ fill: "rgba(255,255,255,0.04)" }}
//                 content={<ChartTooltip valueFormatter={formatINR} />}
//               />
//               <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={44}>
//                 {SALES_BY_HOUR.map((h) => (
//                   <Cell
//                     key={h.name}
//                     fill={h.name === peak.name ? "#C9A24B" : "#5B6572"}
//                   />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </ChartCard>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatINR } from "../../utils/format";
import { dashboardApi } from "../../api/dashboard";

/* ------------------------------------------------------------------ */
/*  Expected API responses (all scoped to the store, voided excluded)  */
/*                                                                     */
/*  salesTrend(days)       -> [{ date: "2026-10-03", total, orders }]  */
/*  topProducts(days, n)   -> [{ product_id, name, units, revenue }]   */
/*  paymentSplit(days)     -> [{ method: "cash", total, count }]       */
/*  salesByHour(days)      -> [{ hour: 0-23, total, orders }]          */
/* ------------------------------------------------------------------ */

const WINDOW_DAYS = 30; // used by every chart except the trend (it has its own toggle)
const TOP_PRODUCTS_LIMIT = 5;

const AXIS_TICK = { fontSize: 12, fill: "#8A929C" };

const METHOD_STYLE = {
  cash: { label: "Cash", color: "#C9A24B" },
  online: { label: "Online", color: "#5FB3A8" },
  due: { label: "Due", color: "#B8735B" },
};
const FALLBACK_COLOR = "#6B7480";

/* ----------------------------- helpers ----------------------------- */

function compact(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}k`;
  return `₹${n}`;
}

// "2026-10-03" -> Date at UTC midnight, so formatting in UTC never shifts the day
function parseDay(str) {
  const [y, m, d] = str.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function buildTrend(rows, days) {
  return rows.map((r) => {
    const d = parseDay(r.date);
    return {
      label:
        days === 7
          ? d.toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" })
          : d.toLocaleDateString("en-IN", { day: "numeric", timeZone: "UTC" }),
      full: d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
      value: Number(r.total) || 0,
    };
  });
}

function buildTopProducts(rows) {
  return rows
    .map((r) => ({ name: r.name, value: Number(r.units) || 0 }))
    .sort((a, b) => b.value - a.value);
}

function buildPayment(rows) {
  return rows
    .filter((r) => Number(r.total) > 0)
    .map((r) => {
      const key = String(r.method).toLowerCase();
      const style = METHOD_STYLE[key];
      return {
        name: style?.label ?? key.charAt(0).toUpperCase() + key.slice(1),
        value: Number(r.total),
        color: style?.color ?? FALLBACK_COLOR,
      };
    });
}

const h12 = (h) => (h % 12 === 0 ? 12 : h % 12);
const ampm = (h) => (h % 24 < 12 ? "AM" : "PM");

function windowLabel(start) {
  const end = (start + 2) % 24;
  return ampm(start) === ampm(end)
    ? `${h12(start)}-${h12(end)} ${ampm(end)}`
    : `${h12(start)} ${ampm(start)}-${h12(end)} ${ampm(end)}`;
}

// 24 hourly rows -> 2-hour windows, trimmed to the first/last window with sales
function buildHourWindows(rows) {
  const totals = new Array(12).fill(0);
  rows.forEach((r) => {
    const i = Math.floor(Number(r.hour) / 2);
    if (i >= 0 && i < 12) totals[i] += Number(r.total) || 0;
  });

  const first = totals.findIndex((t) => t > 0);
  if (first === -1) return [];
  let last = totals.length - 1;
  while (totals[last] === 0) last--;

  return totals
    .slice(first, last + 1)
    .map((total, k) => ({ name: windowLabel((first + k) * 2), value: total }));
}

// Fetch with loading/error state; ignores stale responses; resets on dep change.
function useApi(fetcher, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: false });
    fetcher()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

/* ---------------------------- UI pieces ---------------------------- */

function ChartCard({ title, hint, action, className = "", children }) {
  return (
    <div
      className={`rounded-lg p-4 ${className}`}
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="disp text-[15px] font-semibold">{title}</div>
          {hint && (
            <div className="text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
              {hint}
            </div>
          )}
        </div>
        {action}
      </div>
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

function ChartBody({ state, isEmpty, emptyText, height, children }) {
  if (state.loading) return <Placeholder height={height}>Loading…</Placeholder>;
  if (state.error)
    return <Placeholder height={height}>Couldn't load this chart.</Placeholder>;
  if (isEmpty) return <Placeholder height={height}>{emptyText}</Placeholder>;
  return children;
}

function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div
      className="rounded-md px-3 py-2 text-[12px]"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div className="font-semibold">{p.payload.full ?? label ?? p.payload.name}</div>
      <div className="mono" style={{ color: "var(--muted)" }}>
        {valueFormatter(p.value)}
      </div>
    </div>
  );
}

function RangeToggle({ value, onChange }) {
  const options = [
    { key: "7", label: "7 days" },
    { key: "30", label: "30 days" },
  ];
  return (
    <div
      className="flex rounded-md p-0.5 shrink-0"
      style={{ border: "1px solid var(--line)" }}
    >
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className="px-2.5 py-1 rounded text-[12px] font-medium"
            style={{
              background: active ? "var(--brass)" : "transparent",
              color: active ? "#14171C" : "var(--muted)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ main ------------------------------- */

// refreshKey: bump it from the parent to refetch everything (e.g. after a bill is voided)
export function DashboardCharts({ refreshKey = 0 }) {
  const [range, setRange] = useState("7");
  const rangeDays = range === "7" ? 7 : 30;

  const trendState = useApi(
    () => dashboardApi.salesTrend(rangeDays),
    [rangeDays, refreshKey]
  );
  const topState = useApi(
    () => dashboardApi.topProducts(WINDOW_DAYS, TOP_PRODUCTS_LIMIT),
    [refreshKey]
  );
  const paymentState = useApi(
    () => dashboardApi.paymentSplit(WINDOW_DAYS),
    [refreshKey]
  );
  const hourState = useApi(
    () => dashboardApi.salesByHour(WINDOW_DAYS),
    [refreshKey]
  );

  const trendData = useMemo(
    () => buildTrend(trendState.data || [], rangeDays),
    [trendState.data, rangeDays]
  );
  const topData = useMemo(
    () => buildTopProducts(topState.data || []),
    [topState.data]
  );
  const paymentData = useMemo(
    () => buildPayment(paymentState.data || []),
    [paymentState.data]
  );
  const hourData = useMemo(
    () => buildHourWindows(hourState.data || []),
    [hourState.data]
  );

  const paymentTotal = paymentData.reduce((sum, p) => sum + p.value, 0);
  const peak = hourData.length
    ? hourData.reduce((a, b) => (b.value > a.value ? b : a))
    : null;
  const trendHasSales = trendData.some((d) => d.value > 0);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Chart 1: Sales trend */}
      <ChartCard
        title="Sales trend"
        hint={`Last ${rangeDays} days`}
        action={<RangeToggle value={range} onChange={setRange} />}
        className="md:col-span-2"
      >
        <ChartBody
          state={trendState}
          isEmpty={!trendHasSales}
          emptyText="No sales in this period."
          height={220}
        >
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK}
                  interval={rangeDays === 30 ? 4 : 0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK}
                  width={48}
                  tickFormatter={compact}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                  content={<ChartTooltip valueFormatter={formatINR} />}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#C9A24B"
                  strokeWidth={2.5}
                  dot={
                    rangeDays === 7
                      ? { r: 3, fill: "#C9A24B", strokeWidth: 0 }
                      : false
                  }
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartBody>
      </ChartCard>

      {/* Chart 2: Top products */}
      <ChartCard title="Top products" hint={`Units sold, last ${WINDOW_DAYS} days`}>
        <ChartBody
          state={topState}
          isEmpty={topData.length === 0}
          emptyText="No products sold yet."
          height={210}
        >
          <div style={{ width: "100%", height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topData}
                layout="vertical"
                margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={112}
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  content={<ChartTooltip valueFormatter={(v) => `${v} units`} />}
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
        </ChartBody>
      </ChartCard>

      {/* Chart 3: Payment method split */}
      <ChartCard
        title="Payment methods"
        hint={`Share of sales, last ${WINDOW_DAYS} days`}
      >
        <ChartBody
          state={paymentState}
          isEmpty={paymentData.length === 0}
          emptyText="No payments recorded yet."
          height={170}
        >
          <div className="flex items-center gap-4">
            <div style={{ width: 170, height: 170 }} className="shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {paymentData.map((p) => (
                      <Cell key={p.name} fill={p.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <ChartTooltip
                        valueFormatter={(v) =>
                          `${formatINR(v)} · ${Math.round((v / paymentTotal) * 100)}%`
                        }
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="flex-1 min-w-0 space-y-2">
              {paymentData.map((p) => (
                <li key={p.name} className="flex items-center gap-2 text-[13px]">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: p.color }}
                  />
                  <span className="flex-1">{p.name}</span>
                  <span className="mono" style={{ color: "var(--muted)" }}>
                    {Math.round((p.value / paymentTotal) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartBody>
      </ChartCard>

      {/* Chart 4: Sales by hour */}
      <ChartCard
        title="Sales by hour"
        hint={
          peak
            ? `Peak time: ${peak.name} · last ${WINDOW_DAYS} days`
            : `Last ${WINDOW_DAYS} days`
        }
        className="md:col-span-2"
      >
        <ChartBody
          state={hourState}
          isEmpty={hourData.length === 0}
          emptyText="Not enough bills yet to show peak hours."
          height={200}
        >
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourData}
                margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK}
                  width={48}
                  tickFormatter={compact}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  content={<ChartTooltip valueFormatter={formatINR} />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={44}>
                  {hourData.map((h) => (
                    <Cell
                      key={h.name}
                      fill={peak && h.name === peak.name ? "#C9A24B" : "#5B6572"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartBody>
      </ChartCard>
    </div>
  );
}