import { useEffect, useState } from "react";
import { Loader2, Package, TrendingUp } from "lucide-react";
import { FullScreenLoader } from "../components/common/FullScreenLoader";
import { SectionLabel } from "../components/common/SectionLabel";
import { StatCard } from "../components/common/StatCard";
import { BillDetailModal } from "../components/bills/BillDetailModal";
import { useRollingNumber } from "../hooks/useRollingNumber";
import { formatINR, groupBillsByDate, timestamp } from "../utils/format";
import { dashboardApi } from "../api/dashboard";
import { billsApi } from "../api/bills";

const BILLS_PAGE_SIZE = 10;

export function Dashboard({ canVoid }) {
  const [summary, setSummary] = useState(null);
  const [bills, setBills] = useState([]);
  const [page, setPage] = useState(0); // 0-indexed
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [clock, setClock] = useState(timestamp());
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  function loadPage(pageIndex) {
    setPageLoading(true);
    billsApi.list(BILLS_PAGE_SIZE, pageIndex * BILLS_PAGE_SIZE)
      .then((b) => {
        setBills(b);
        // Fetched a full page -> there might be more after it. Fetched
        // fewer than a full page -> this is definitely the last page.
        setHasNextPage(b.length === BILLS_PAGE_SIZE);
      })
      .finally(() => setPageLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([dashboardApi.summary(), billsApi.list(BILLS_PAGE_SIZE, 0)])
      .then(([s, b]) => {
        setSummary(s);
        setBills(b);
        setHasNextPage(b.length === BILLS_PAGE_SIZE);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(timestamp()), 1000);
    return () => clearInterval(id);
  }, []);

  function goToPage(nextPage) {
    setPage(nextPage);
    loadPage(nextPage);
  }

  const todaySales = useRollingNumber(summary?.total_sales || 0);
  const orders = useRollingNumber(summary?.order_count || 0);

  if (loading) return <FullScreenLoader />;

  const grouped = groupBillsByDate(bills);
  const dateKeys = Object.keys(grouped);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mono text-[11px] mb-2" style={{ color: "var(--brass)" }}>TODAY · {clock}</div>
        <h1 className="disp text-[28px] md:text-[34px] font-semibold tracking-tight">Today's sales</h1>
        <div className="mono text-[46px] md:text-[58px] font-semibold leading-none mt-2 tabular-nums">
          {formatINR(todaySales)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Orders today" value={orders} icon={Package} />
        <StatCard label="Avg. ticket size" value={formatINR(summary?.avg_ticket)} icon={TrendingUp} isText />
      </div>

      <div>
        <SectionLabel>All bills</SectionLabel>
        <div className="mt-2 rounded-lg overflow-hidden relative" style={{ background: "var(--panel)", border: "1px solid var(--line)", minHeight: 120 }}>
          {pageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: "rgba(27,31,38,0.7)" }}>
              <Loader2 size={20} className="spin" style={{ color: "var(--brass)" }} />
            </div>
          )}
          {bills.length === 0 ? (
            <div className="p-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>
              {page === 0 ? "No bills yet." : "No bills on this page."}
            </div>
          ) : (
            dateKeys.map((dateKey) => (
              <div key={dateKey}>
                <div className="px-4 py-2 mono text-[11px]" style={{ background: "var(--panel2)", color: "var(--muted)", position: "sticky", top: 0 }}>
                  {dateKey.toUpperCase()}
                </div>
                {grouped[dateKey].map((bill) => (
                  <button
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <div>
                      <div className="mono text-[12.5px]">{bill.bill_number}</div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: "var(--muted)" }}>
                        {bill.salesperson_name} · {new Date(bill.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                      </div>
                    </div>
                    <span className="mono text-[14px] font-semibold" style={{ color: "var(--teal)" }}>{formatINR(bill.grand_total)}</span>
                  </button>
                ))}
              </div>
            ))
          )}

          {(page > 0 || hasNextPage) && (
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--line)", background: "var(--panel2)" }}>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 0 || pageLoading}
                className="px-3 py-1.5 rounded-md text-[12.5px] font-medium"
                style={{ color: page === 0 ? "var(--muted)" : "var(--brass)", opacity: page === 0 ? 0.4 : 1 }}
              >
                ← Previous
              </button>
              <span className="mono text-[11px]" style={{ color: "var(--muted)" }}>Page {page + 1}</span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={!hasNextPage || pageLoading}
                className="px-3 py-1.5 rounded-md text-[12.5px] font-medium"
                style={{ color: !hasNextPage ? "var(--muted)" : "var(--brass)", opacity: !hasNextPage ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
          canVoid={canVoid}
          onVoided={() => {
            setSelectedBill(null);
            loadPage(page);
            dashboardApi.summary().then(setSummary);
          }}
        />
      )}
    </div>
  );
}
