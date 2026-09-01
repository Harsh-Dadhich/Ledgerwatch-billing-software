import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { FullScreenLoader } from "../components/common/FullScreenLoader";
import { ProductCard } from "../components/products/ProductCard";
import { EditProductModal } from "../components/products/EditProductModal";
import { productsApi } from "../api/products";

export function Products({ canEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    productsApi.list().then(setProducts).finally(() => setLoading(false));
  }, []);

  if (loading) return <FullScreenLoader />;

  const filtered = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : products;

  async function handleDelete(productId) {
    try {
      await productsApi.remove(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      alert(err.message || "Could not delete product");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="disp text-[26px] font-semibold tracking-tight">Catalogue</h1>
        <span className="mono text-[12px]" style={{ color: "var(--muted)" }}>
          {query ? `${filtered.length} of ${products.length}` : `${products.length} listed`}
        </span>
      </div>
      <p className="text-[13.5px] mb-4" style={{ color: "var(--muted)" }}>Everything currently live for sale.</p>

      {products.length > 0 && (
        <div className="relative mb-6 max-w-[360px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
            style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
          />
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
          <span style={{ color: "var(--muted)" }}>Nothing listed yet. Create your first product to see it here.</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
          <span style={{ color: "var(--muted)" }}>No products match "{query}".</span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={canEdit ? () => setEditingProduct(p) : undefined}
              onDelete={canEdit ? () => handleDelete(p.id) : undefined}
            />
          ))}
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={(updated) => {
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
