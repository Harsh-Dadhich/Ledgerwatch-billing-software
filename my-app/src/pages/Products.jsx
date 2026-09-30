// import { useEffect, useState } from "react";
// import { Search } from "lucide-react";
// import { FullScreenLoader } from "../components/common/FullScreenLoader";
// import { ProductCard } from "../components/products/ProductCard";
// import { EditProductModal } from "../components/products/EditProductModal";
// import { productsApi } from "../api/products";

// export function Products({ canEdit }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [editingProduct, setEditingProduct] = useState(null);

//   useEffect(() => {
//     productsApi.list().then(setProducts).finally(() => setLoading(false));
//   }, []);

//   if (loading) return <FullScreenLoader />;

//   const filtered = query.trim()
//     ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
//     : products;

//   async function handleDelete(productId) {
//     try {
//       await productsApi.remove(productId);
//       setProducts((prev) => prev.filter((p) => p.id !== productId));
//     } catch (err) {
//       alert(err.message || "Could not delete product");
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-1">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">Catalogue</h1>
//         <span className="mono text-[12px]" style={{ color: "var(--muted)" }}>
//           {query ? `${filtered.length} of ${products.length}` : `${products.length} listed`}
//         </span>
//       </div>
//       <p className="text-[13.5px] mb-4" style={{ color: "var(--muted)" }}>Everything currently live for sale.</p>

//       {products.length > 0 && (
//         <div className="relative mb-6 max-w-[360px]">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search products…"
//             className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
//             style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
//           />
//         </div>
//       )}

//       {products.length === 0 ? (
//         <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
//           <span style={{ color: "var(--muted)" }}>Nothing listed yet. Create your first product to see it here.</span>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
//           <span style={{ color: "var(--muted)" }}>No products match "{query}".</span>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {filtered.map((p) => (
//             <ProductCard
//               key={p.id}
//               product={p}
//               onEdit={canEdit ? () => setEditingProduct(p) : undefined}
//               onDelete={canEdit ? () => handleDelete(p.id) : undefined}
//             />
//           ))}
//         </div>
//       )}

//       {editingProduct && (
//         <EditProductModal
//           product={editingProduct}
//           onClose={() => setEditingProduct(null)}
//           onSaved={(updated) => {
//             setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
//             setEditingProduct(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

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

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [editingProduct, setEditingProduct] = useState(null);

  /*
   * Load products from backend.
   *
   * Search + pagination are handled server-side.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);

        const response = await productsApi.list({
          page,
          pageSize,
          search: query,
        });

        if (cancelled) return;

        setProducts(response.items || []);
        setTotal(response.total || 0);
        setTotalPages(response.total_pages || 0);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load products:", err);

        setProducts([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [page, query]);

  /*
   * Whenever search changes, go back to page 1.
   */
  useEffect(() => {
    setPage(1);
  }, [query]);

  async function handleDelete(productId) {
    try {
      await productsApi.remove(productId);

      /*
       * Remove immediately from current page.
       */
      setProducts((prev) =>
        prev.filter((p) => p.id !== productId)
      );

      /*
       * Keep total count accurate.
       */
      setTotal((prev) =>
        Math.max(0, prev - 1)
      );

      /*
       * If the deleted product was the only item
       * on the current page, move back one page.
       */
      if (
        products.length === 1 &&
        page > 1
      ) {
        setPage((prev) => prev - 1);
      }
    } catch (err) {
      alert(
        err.message ||
          "Could not delete product"
      );
    }
  }

  function handleSaved(updated) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updated.id
          ? updated
          : p
      )
    );

    setEditingProduct(null);
  }

  if (loading && products.length === 0) {
    return <FullScreenLoader />;
  }

  const startItem =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endItem =
    total === 0
      ? 0
      : Math.min(
          page * pageSize,
          total
        );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="disp text-[26px] font-semibold tracking-tight">
          Catalogue
        </h1>

        <span
          className="mono text-[12px]"
          style={{
            color: "var(--muted)",
          }}
        >
          {total} listed
        </span>
      </div>

      <p
        className="text-[13.5px] mb-4"
        style={{
          color: "var(--muted)",
        }}
      >
        Everything currently live for sale.
      </p>

      {/* Search */}
      <div className="relative mb-6 max-w-[360px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{
            color: "var(--muted)",
          }}
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search products…"
          className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
          style={{
            border:
              "1px solid var(--line)",
            background:
              "var(--panel)",
          }}
        />
      </div>

      {/* Loading while changing page/search */}
      {loading && products.length > 0 && (
        <div
          className="text-[12px] mb-3"
          style={{
            color: "var(--muted)",
          }}
        >
          Loading products...
        </div>
      )}

      {/* Empty catalogue */}
      {total === 0 && !query.trim() ? (
        <div
          className="rounded-lg p-10 text-center"
          style={{
            border:
              "1px dashed var(--line)",
          }}
        >
          <span
            style={{
              color: "var(--muted)",
            }}
          >
            Nothing listed yet. Create your
            first product to see it here.
          </span>
        </div>
      ) : total === 0 && query.trim() ? (
        /* No search results */
        <div
          className="rounded-lg p-10 text-center"
          style={{
            border:
              "1px dashed var(--line)",
          }}
        >
          <span
            style={{
              color: "var(--muted)",
            }}
          >
            No products match "{query}".
          </span>
        </div>
      ) : (
        <>
          {/* Product grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={
                  canEdit
                    ? () =>
                        setEditingProduct(p)
                    : undefined
                }
                onDelete={
                  canEdit
                    ? () =>
                        handleDelete(p.id)
                    : undefined
                }
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
            <span
              className="text-[12px]"
              style={{
                color: "var(--muted)",
              }}
            >
              Showing {startItem} – {endItem} of{" "}
              {total} products
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={
                  page <= 1 || loading
                }
                onClick={() =>
                  setPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                className="px-3 py-1.5 rounded-md text-[12px]"
                style={{
                  border:
                    "1px solid var(--line)",
                  opacity:
                    page <= 1 || loading
                      ? 0.5
                      : 1,
                }}
              >
                Previous
              </button>

              <span className="px-2 py-1.5 text-[12px] mono">
                {page} /{" "}
                {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={
                  page >= totalPages ||
                  totalPages === 0 ||
                  loading
                }
                onClick={() =>
                  setPage((p) =>
                    Math.min(
                      totalPages,
                      p + 1
                    )
                  )
                }
                className="px-3 py-1.5 rounded-md text-[12px]"
                style={{
                  border:
                    "1px solid var(--line)",
                  opacity:
                    page >= totalPages ||
                    totalPages === 0 ||
                    loading
                      ? 0.5
                      : 1,
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() =>
            setEditingProduct(null)
          }
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}