import { useState } from "react";
import { Plus } from "lucide-react";
import { Field } from "../components/common/Field";
import { ProductCard } from "../components/products/ProductCard";
import { productsApi } from "../api/products";

export function CreateProduct({ onCreated }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const priceNum = Number(price) || 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name || !priceNum) return;
    setLoading(true);
    try {
      const payload = { name, price: priceNum };
      // Leaving quantity blank omits the key entirely -- the backend
      // treats that as "not tracking inventory for this product" rather
      // than "zero stock," so it's never blocked from being sold.
      if (quantity !== "") payload.quantity = Number(quantity);
      await productsApi.create(payload);
      onCreated();
    } catch (err) {
      setError(err.message || "Could not create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">List a new product</h1>
      <p className="text-[13.5px] mb-7" style={{ color: "var(--muted)" }}>
        Set the name and price per piece. Discounts are applied per-bill, not here.
      </p>
      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 flex flex-col gap-4">
          <Field label="Product name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kanjivaram Silk Saree"
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
          </Field>
          <Field label="Price per piece (₹)">
            <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0"
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
          </Field>
          <Field label="Quantity in stock (optional)">
            <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Leave blank to not track stock"
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
          </Field>
          {error && (
            <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>{error}</div>
          )}
          <button type="submit" disabled={loading} className="mt-2 flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp"
            style={{ background: "var(--brass)", color: "#14171C" }}>
            <Plus size={16} />
            {loading ? "Adding…" : "Add product"}
          </button>
        </form>
        <div className="md:col-span-2">
          <div className="mono text-[11px] mb-2" style={{ color: "var(--muted)" }}>LIVE PREVIEW</div>
          <ProductCard product={{ name: name || "Untitled product", price: priceNum, quantity: quantity === "" ? 0 : Number(quantity) }} preview />
        </div>
      </div>
    </div>
  );
}
