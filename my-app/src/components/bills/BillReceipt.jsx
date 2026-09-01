import { formatINR } from "../../utils/format";

export function BillReceipt({ bill, onNewBill }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="disp text-[26px] font-semibold tracking-tight">Bill saved</h1>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
            Print
          </button>
          <button onClick={onNewBill} className="px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
            New bill
          </button>
        </div>
      </div>

      <div id="receipt" className="rounded-lg p-6 max-w-[480px]" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <div className="text-center mb-5">
          <div className="disp text-[16px] font-semibold">Ledgerwatch</div>
          <div className="mono text-[11px] mt-1" style={{ color: "var(--muted)" }}>{bill.bill_number}</div>
          <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>{new Date(bill.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
          <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>Billed by {bill.salesperson_name}</div>
        </div>

        <div style={{ borderTop: "1px dashed var(--line)", borderBottom: "1px dashed var(--line)" }} className="py-3 flex flex-col gap-2">
          {bill.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-[13px]">
              <div>
                <div>{item.name}</div>
                <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>
                  {item.quantity} × {formatINR(item.unit_price)}{item.discount_pct > 0 && ` · −${item.discount_pct}%`}
                </div>
              </div>
              <span className="mono">{formatINR(item.line_total)}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--muted)" }}>
            <span>Subtotal</span>
            <span className="mono">{formatINR(bill.subtotal)}</span>
          </div>
          {bill.bill_discount_pct > 0 && (
            <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--rust)" }}>
              <span>Bill discount</span>
              <span className="mono">−{bill.bill_discount_pct}%</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-1 pt-2" style={{ borderTop: "1px solid var(--line)" }}>
            <span className="disp text-[14px] font-semibold">Total</span>
            <span className="mono text-[19px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(bill.grand_total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
