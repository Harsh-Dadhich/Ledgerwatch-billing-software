import { useState } from "react";
import { formatINR } from "../../utils/format";
import { billsApi } from "../../api/bills";

export function BillDetailModal({ bill, onClose, canVoid, onVoided }) {
  const [confirmingVoid, setConfirmingVoid] = useState(false);
  const [voiding, setVoiding] = useState(false);
  const [voidError, setVoidError] = useState("");

  async function handleVoid() {
    setVoiding(true);
    setVoidError("");
    try {
      await billsApi.void(bill.id);
      onVoided(bill.id);
    } catch (err) {
      setVoidError(err.message || "Could not void this bill");
      setConfirmingVoid(false);
    } finally {
      setVoiding(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-lg relative">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div>
            {canVoid && !confirmingVoid && (
              <button onClick={() => setConfirmingVoid(true)} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--rust)", color: "var(--rust)" }}>
                Void bill
              </button>
            )}
            {confirmingVoid && (
              <div className="flex items-center gap-2">
                <span className="text-[12.5px]" style={{ color: "var(--rust)" }}>Void this bill? This can't be undone.</span>
                <button onClick={handleVoid} disabled={voiding} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ background: "var(--rust)", color: "var(--ivory)" }}>
                  {voiding ? "Voiding…" : "Confirm"}
                </button>
                <button onClick={() => setConfirmingVoid(false)} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
              Print
            </button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
              Close
            </button>
          </div>
        </div>
        {voidError && (
          <div className="mb-2 text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
            {voidError}
          </div>
        )}
        <div id="receipt" className="rounded-lg p-6" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
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
    </div>
  );
}
