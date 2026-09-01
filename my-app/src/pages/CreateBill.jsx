import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Field } from "../components/common/Field";
import { SectionLabel } from "../components/common/SectionLabel";
import { ProductPicker } from "../components/products/ProductPicker";
import { BillReceipt } from "../components/bills/BillReceipt";
import { formatINR } from "../utils/format";
import { productsApi } from "../api/products";
import { billsApi } from "../api/bills";

export function CreateBill({ lineItems, setLineItems, billDiscount, setBillDiscount, clearDraft }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [priceOverride, setPriceOverride] = useState("");
  const [useDiscount, setUseDiscount] = useState(false);
  const [discount, setDiscount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastBill, setLastBill] = useState(null);
  // Stays the same across retries of one bill attempt (e.g. if a request
  // times out and the button is tapped again) so the backend recognizes
  // it as the same attempt instead of creating a duplicate bill.
  // Regenerated once a bill actually succeeds, starting a fresh attempt.
  const [billKey, setBillKey] = useState(() => crypto.randomUUID());

  useEffect(() => {
    productsApi.list().then((ps) => {
      setProducts(ps);
      if (ps.length) setProductId(ps[0].id);
    });
  }, []);

  const selected = products.find((p) => p.id === productId);
  const discNum = useDiscount ? Math.min(100, Math.max(0, Number(discount) || 0)) : 0;
  const qtyNum = Math.max(1, Number(qty) || 1);
  const effectivePrice = priceOverride !== "" ? Number(priceOverride) || 0 : (selected?.price || 0);
  const lineTotal = selected ? Math.round(effectivePrice * qtyNum * (1 - discNum / 100)) : 0;

  useEffect(() => {
    // reset the price field to the catalogue price whenever the product changes
    setPriceOverride("");
  }, [productId]);

  function addLine(e) {
    e.preventDefault();
    if (!selected) return;
    setLineItems((prev) => [
      ...prev,
      {
        key: Date.now(),
        product_id: selected.id,
        name: selected.name,
        unit_price: effectivePrice,
        quantity: qtyNum,
        discount_pct: discNum,
        line_total: lineTotal,
        was_overridden: priceOverride !== "" && Number(priceOverride) !== selected.price,
      },
    ]);
    setQty(1);
    setPriceOverride("");
    setUseDiscount(false);
    setDiscount("");
  }

  function removeLine(key) {
    setLineItems((prev) => prev.filter((l) => l.key !== key));
  }

  const subtotal = lineItems.reduce((sum, l) => sum + l.line_total, 0);
  const billDiscNum = Math.min(100, Math.max(0, Number(billDiscount) || 0));
  const grandTotal = Math.round(subtotal * (1 - billDiscNum / 100));

  async function finalizeBill() {
    setError("");
    setSubmitting(true);
    try {
      const bill = await billsApi.create({
        items: lineItems.map((l) => ({
          product_id: l.product_id,
          quantity: l.quantity,
          discount_pct: l.discount_pct,
          unit_price: l.unit_price,
        })),
        bill_discount_pct: billDiscNum,
        idempotency_key: billKey,
      });
      setLastBill(bill);
      clearDraft();
      setBillKey(crypto.randomUUID()); // fresh key for the next bill
    } catch (err) {
      setError(err.message || "Could not create bill");
      // billKey intentionally NOT regenerated here -- a retry after a
      // failed/timed-out request should reuse the same key.
    } finally {
      setSubmitting(false);
    }
  }

  if (lastBill) {
    return <BillReceipt bill={lastBill} onNewBill={() => setLastBill(null)} />;
  }

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Create bill</h1>
      <p className="text-[13.5px] mb-7" style={{ color: "var(--muted)" }}>
        Pick a product, adjust price or quantity if needed, and apply discounts per item or on the whole bill.
      </p>

      {products.length === 0 ? (
        <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
          <span style={{ color: "var(--muted)" }}>List a product first before creating a bill.</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-8">
          <form onSubmit={addLine} className="md:col-span-2 flex flex-col gap-4">
            <Field label="Product">
              <ProductPicker products={products} selectedId={productId} onSelect={setProductId} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantity">
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, Number(q) - 1))} className="w-8 h-9 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)" }}>
                    <Minus size={13} />
                  </button>
                  <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)}
                    className="w-full text-center bg-transparent rounded-md px-2 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
                  <button type="button" onClick={() => setQty((q) => Math.max(1, Number(q) + 1))} className="w-8 h-9 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)" }}>
                    <Plus size={13} />
                  </button>
                </div>
              </Field>

              <Field label="Price per piece (₹)">
                <input
                  type="number" min="0" step="0.01"
                  value={priceOverride}
                  placeholder={selected ? String(selected.price) : "0"}
                  onChange={(e) => setPriceOverride(e.target.value)}
                  className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono"
                  style={{ border: "1px solid " + (priceOverride !== "" ? "var(--brass)" : "var(--line)"), background: "var(--panel)" }}
                />
              </Field>
            </div>
            {priceOverride !== "" && selected && Number(priceOverride) !== selected.price && (
              <div className="text-[11px] -mt-2" style={{ color: "var(--brass)" }}>
                Overriding catalogue price of {formatINR(selected.price)} for this bill only.
              </div>
            )}

            <label className="flex items-center gap-2 text-[13px] mt-1" style={{ color: "var(--muted)" }}>
              <input type="checkbox" checked={useDiscount} onChange={(e) => setUseDiscount(e.target.checked)} className="w-4 h-4" />
              Apply a discount to this item
            </label>

            {useDiscount && (
              <Field label="Item discount (%)">
                <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" autoFocus
                  className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
              </Field>
            )}

            <div className="rounded-md p-3 flex items-center justify-between" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
              <span className="text-[12px]" style={{ color: "var(--muted)" }}>Line total</span>
              <span className="mono text-[16px] font-semibold">{formatINR(lineTotal)}</span>
            </div>

            <button type="submit" className="flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
              <Plus size={16} />
              Add to bill
            </button>
          </form>

          <div className="md:col-span-3">
            <SectionLabel>Bill</SectionLabel>
            <div className="mt-2 rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
              {lineItems.length === 0 ? (
                <div className="p-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>No items added yet.</div>
              ) : (
                <>
                  {lineItems.map((l) => (
                    <div key={l.key} className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
                      <div>
                        <div className="text-[13.5px] font-medium flex items-center gap-1.5">
                          {l.name}
                          {l.was_overridden && (
                            <span className="mono text-[9.5px] px-1.5 py-0.5 rounded" style={{ background: "rgba(201,150,62,0.2)", color: "var(--brass)" }}>edited</span>
                          )}
                        </div>
                        <div className="mono text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                          {l.quantity} × {formatINR(l.unit_price)}{l.discount_pct > 0 && ` · −${l.discount_pct}%`}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mono text-[14.5px] font-semibold">{formatINR(l.line_total)}</span>
                        <button onClick={() => removeLine(l.key)} style={{ color: "var(--muted)" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}

                  <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
                    <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>Subtotal</span>
                    <span className="mono text-[14px]">{formatINR(subtotal)}</span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
                    <label className="text-[12.5px] flex items-center gap-2" style={{ color: "var(--muted)" }}>
                      Final bill discount (%)
                    </label>
                    <input
                      type="number" min="0" max="100" value={billDiscount}
                      onChange={(e) => setBillDiscount(e.target.value)}
                      placeholder="0"
                      className="w-20 text-right bg-transparent rounded-md px-2 py-1.5 text-[13px] mono"
                      style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
                    />
                  </div>

                  <div className="px-4 py-4 flex items-center justify-between" style={{ background: "var(--panel2)" }}>
                    <span className="disp text-[14px] font-semibold" style={{ color: "var(--muted)" }}>GRAND TOTAL</span>
                    <span className="mono text-[22px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(grandTotal)}</span>
                  </div>
                  {error && (
                    <div className="text-[12.5px] px-4 py-2" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>{error}</div>
                  )}
                  <button onClick={finalizeBill} disabled={submitting} className="w-full py-3 text-[14px] font-semibold disp" style={{ background: "var(--teal)", color: "#14171C" }}>
                    {submitting ? "Saving bill…" : "Finalize & save bill"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
