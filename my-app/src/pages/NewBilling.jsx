import { useState } from "react";
import { CustomerDetailsCard } from "../components/newbilling/CustomerDetailsCard";
import { ProductCatalogPanel } from "../components/newbilling/ProductCatalogPanel";
import { CurrentBillPanel } from "../components/newbilling/CurrentBillPanel";
import { billsApi } from "../api/bills";

/**
 * "Generate bill" now calls the real backend (payment_method included).
 * Everything else on this page -- product catalogue, customer details --
 * is still the static mock preview until the inventory backend work
 * (SKU/barcode/category fields) lands.
 */
export function NewBilling() {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastBill, setLastBill] = useState(null);
  // Same idempotency pattern as the original Create Bill tab -- stays
  // the same across retries of one attempt, regenerated only on success.
  const [billKey, setBillKey] = useState(() => crypto.randomUUID());

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, discountPct: 0 }];
    });
  }

  function updateQty(id, qty) {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  }

  function updateDiscount(id, discountPct) {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, discountPct } : item)));
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearBill() {
    setCart([]);
    setError("");
  }

  async function generateBill() {
    if (cart.length === 0) return;
    setError("");
    setSubmitting(true);
    try {
      // NOTE: cart items here come from mock product data (see
      // data/mockBillingProducts.js), whose ids aren't real Product
      // documents yet -- this call will 404 against the live API until
      // the catalogue in this tab is wired to real products (next step,
      // alongside the Inventory schema work). The request shape itself
      // is already correct and won't need to change then.
      const bill = await billsApi.create({
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
          discount_pct: item.discountPct,
        })),
        bill_discount_pct: 0,
        payment_method: paymentMethod,
        idempotency_key: billKey,
      });
      setLastBill(bill);
      setCart([]);
      setBillKey(crypto.randomUUID());
    } catch (err) {
      setError(err.message || "Could not create bill");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Create bill</h1>
      <p className="text-[13.5px] mb-6" style={{ color: "var(--muted)" }}>
        Add products to the bill and generate an invoice for your customer.
      </p>

      {lastBill && (
        <div className="mb-6 rounded-lg p-4 flex items-center justify-between flex-wrap gap-2" style={{ background: "rgba(63,167,150,0.12)", border: "1px solid var(--teal)" }}>
          <div className="text-[13px]">
            Bill <span className="mono">{lastBill.bill_number}</span> saved · paid via {lastBill.payment_method}.
          </div>
          <span className="mono text-[16px] font-semibold" style={{ color: "var(--teal)" }}>
            ₹{Number(lastBill.grand_total).toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-5 items-start">
        <div className="lg:col-span-3 flex flex-col gap-5">
          <CustomerDetailsCard />
          <ProductCatalogPanel onAdd={addToCart} />
        </div>
        <div className="lg:col-span-2">
          <CurrentBillPanel
            cart={cart}
            onQtyChange={updateQty}
            onDiscountChange={updateDiscount}
            onRemove={removeItem}
            onClear={clearBill}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onGenerateBill={generateBill}
            generating={submitting}
          />
        </div>
      </div>
    </div>
  );
}
