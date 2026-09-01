import { useState } from "react";
import { X } from "lucide-react";
import { Field } from "../common/Field";
import { productsApi } from "../../api/products";

export function EditProductModal({ product, onClose, onSaved }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [quantity, setQuantity] = useState(String(product.quantity ?? 0));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const priceNum = Number(price);
    if (!name.trim() || !priceNum || priceNum <= 0) {
      setError("Enter a valid name and price.");
      return;
    }
    setSaving(true);
    try {
      const updated = await productsApi.update(product.id, {
        name: name.trim(),
        price: priceNum,
        quantity: quantity === "" ? undefined : Number(quantity),
      });
      onSaved(updated);
    } catch (err) {
      setError(err.message || "Could not update product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-[400px] rounded-lg p-6 relative" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
          <X size={18} />
        </button>
        <h2 className="disp text-[18px] font-semibold mb-5">Edit product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Product name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
              style={{ border: "1px solid var(--line)" }}
            />
          </Field>
          <Field label="Price per piece (₹)">
            <input
              type="number" min="0" step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono"
              style={{ border: "1px solid var(--line)" }}
            />
          </Field>
          <Field label="Quantity in stock">
            <input
              type="number" min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono"
              style={{ border: "1px solid var(--line)" }}
            />
          </Field>
          {error && (
            <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded-md py-2.5 text-[14px] font-semibold disp"
            style={{ background: "var(--brass)", color: "#14171C" }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
