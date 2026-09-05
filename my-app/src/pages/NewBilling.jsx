import { useState } from "react";
import { CustomerDetailsCard } from "../components/newbilling/CustomerDetailsCard";
import { ProductCatalogPanel } from "../components/newbilling/ProductCatalogPanel";
import { CurrentBillPanel } from "../components/newbilling/CurrentBillPanel";

/**
 * Static UI preview of a redesigned billing screen. Lives entirely in
 * local component state -- no API calls -- so it can be reviewed and
 * iterated on before any backend work starts. The existing "Create
 * bill" tab (pages/CreateBill.jsx) is completely untouched and keeps
 * working exactly as it did before this was added.
 */
export function NewBilling() {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

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
  }

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Create bill</h1>
      <p className="text-[13.5px] mb-6" style={{ color: "var(--muted)" }}>
        Add products to the bill and generate an invoice for your customer.
      </p>

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
          />
        </div>
      </div>
    </div>
  );
}
