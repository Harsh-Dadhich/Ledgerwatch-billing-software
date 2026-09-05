import { ShoppingCart, Trash2, FileText, BookmarkPlus, Minus, Plus } from "lucide-react";
import { formatINR } from "../../utils/format";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

export function CurrentBillPanel({ cart, onQtyChange, onDiscountChange, onRemove, onClear, paymentMethod, onPaymentMethodChange }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountTotal = cart.reduce((sum, item) => sum + (item.price * item.qty * item.discountPct) / 100, 0);
  const tax = 0; // static preview -- tax rate wiring comes with the real backend
  const total = Math.max(0, subtotal - discountTotal + tax);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
          <span className="disp text-[14px] font-semibold">Current bill</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              disabled={cart.length === 0}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium"
              style={{ border: "1px solid var(--rust)", color: "var(--rust)", opacity: cart.length === 0 ? 0.4 : 1 }}
            >
              <Trash2 size={13} />
              Clear bill
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium"
              style={{ border: "1px solid var(--brass)", color: "var(--brass)" }}
            >
              <BookmarkPlus size={13} />
              Hold bill
            </button>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-2">
            <ShoppingCart size={34} style={{ color: "var(--muted)" }} />
            <div className="text-[14px] font-medium mt-1">No items added yet</div>
            <div className="text-[12.5px]" style={{ color: "var(--muted)" }}>Add products from the left to create a bill</div>
          </div>
        ) : (
          <>
            {/* Mobile: stacked cards, one per line item */}
            <div className="md:hidden flex flex-col">
              {cart.map((item) => {
                const lineTotal = Math.max(0, item.price * item.qty * (1 - item.discountPct / 100));
                return (
                  <div key={item.id} className="px-4 py-3 flex flex-col gap-2" style={{ borderTop: "1px solid var(--line)" }}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13.5px] font-medium">{item.name}</span>
                      <button onClick={() => onRemove(item.id)} style={{ color: "var(--muted)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <button onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))} className="w-7 h-7 flex items-center justify-center rounded" style={{ border: "1px solid var(--line)" }}>
                          <Minus size={12} />
                        </button>
                        <span className="mono text-[13px] w-6 text-center">{item.qty}</span>
                        <button onClick={() => onQtyChange(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center rounded" style={{ border: "1px solid var(--line)" }}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number" min="0" max="100" value={item.discountPct}
                          onChange={(e) => onDiscountChange(item.id, Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                          className="w-14 bg-transparent rounded px-1.5 py-1 text-[12px] mono"
                          style={{ border: "1px solid var(--line)" }}
                        />
                        <span className="text-[11px]" style={{ color: "var(--muted)" }}>% off</span>
                      </div>
                      <span className="mono text-[14px] font-semibold ml-auto">{formatINR(lineTotal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop / tablet: full table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {["Item", "Price", "Qty", "Discount", "Total"].map((h) => (
                      <th key={h} className="px-4 py-2 text-[10.5px] font-medium whitespace-nowrap" style={{ color: "var(--muted)" }}>{h.toUpperCase()}</th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const lineTotal = Math.max(0, item.price * item.qty * (1 - item.discountPct / 100));
                    return (
                      <tr key={item.id} style={{ borderTop: "1px solid var(--line)" }}>
                        <td className="px-4 py-2.5 text-[13px] font-medium whitespace-nowrap">{item.name}</td>
                        <td className="px-4 py-2.5 mono text-[12.5px] whitespace-nowrap">{formatINR(item.price)}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))} className="w-6 h-6 flex items-center justify-center rounded" style={{ border: "1px solid var(--line)" }}>
                              <Minus size={11} />
                            </button>
                            <span className="mono text-[12.5px] w-5 text-center">{item.qty}</span>
                            <button onClick={() => onQtyChange(item.id, item.qty + 1)} className="w-6 h-6 flex items-center justify-center rounded" style={{ border: "1px solid var(--line)" }}>
                              <Plus size={11} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number" min="0" max="100" value={item.discountPct}
                            onChange={(e) => onDiscountChange(item.id, Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                            className="w-14 bg-transparent rounded px-1.5 py-1 text-[12px] mono"
                            style={{ border: "1px solid var(--line)" }}
                          />
                          <span className="text-[11px] ml-1" style={{ color: "var(--muted)" }}>%</span>
                        </td>
                        <td className="px-4 py-2.5 mono text-[13px] font-semibold whitespace-nowrap">{formatINR(lineTotal)}</td>
                        <td className="px-2 py-2.5">
                          <button onClick={() => onRemove(item.id)} style={{ color: "var(--muted)" }}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <PaymentMethodSelector value={paymentMethod} onChange={onPaymentMethodChange} />

      <div className="rounded-lg p-4 flex flex-col gap-2" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <div className="flex items-center justify-between text-[13px]">
          <span style={{ color: "var(--muted)" }}>Subtotal</span>
          <span className="mono">{formatINR(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span style={{ color: "var(--muted)" }}>Discount</span>
          <span className="mono" style={{ color: "var(--teal)" }}>{formatINR(discountTotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span style={{ color: "var(--muted)" }}>Tax (0%)</span>
          <span className="mono">{formatINR(tax)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 mt-1" style={{ borderTop: "1px solid var(--line)" }}>
          <span className="disp text-[16px] font-semibold">Total</span>
          <span className="mono text-[22px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(total)}</span>
        </div>
      </div>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-md py-3 text-[14px] font-semibold disp"
        style={{ background: "var(--brass)", color: "#14171C" }}
      >
        <FileText size={16} />
        Generate bill
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-md py-2.5 text-[13.5px] font-medium"
        style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
      >
        <BookmarkPlus size={15} />
        Save as draft
      </button>
    </div>
  );
}
