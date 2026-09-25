// import { mockProducts, mockStockHistory } from "../../data/mockInventory";

// export function InventoryStockHistory() {
//   const currentStock = mockStockHistory[mockStockHistory.length - 1]?.balance ?? 0;

//   return (
//     <div>
//       <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">Stock history</h1>

//       <div className="grid sm:grid-cols-2 gap-3 max-w-[480px] mb-6">
//         <select className="w-full rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}>
//           {mockProducts.map((p) => <option key={p.id}>{p.name}</option>)}
//         </select>
//         <select className="w-full rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}>
//           <option>All transaction types</option>
//           <option>Opening</option><option>Purchase</option><option>Sale</option><option>Damage</option><option>Adjustment</option>
//         </select>
//       </div>

//       <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
//         <table className="w-full text-left">
//           <thead>
//             <tr style={{ background: "var(--panel2)" }}>
//               {["Date", "Type", "Qty", "Balance"].map((h) => (
//                 <th key={h} className="px-4 py-2.5 text-[11px] font-medium" style={{ color: "var(--muted)" }}>{h.toUpperCase()}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {mockStockHistory.map((row, i) => (
//               <tr key={i} style={{ borderTop: "1px solid var(--line)", background: "var(--panel)" }}>
//                 <td className="px-4 py-3 mono text-[12.5px]">{row.date}</td>
//                 <td className="px-4 py-3 text-[13px]">{row.type}</td>
//                 <td className="px-4 py-3 mono text-[13px]" style={{ color: row.qty > 0 ? "var(--teal)" : "var(--rust)" }}>
//                   {row.qty > 0 ? `+${row.qty}` : row.qty}
//                 </td>
//                 <td className="px-4 py-3 mono text-[13px]">{row.balance}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--line)", background: "var(--panel2)" }}>
//           <span className="disp text-[13px] font-semibold" style={{ color: "var(--muted)" }}>CURRENT STOCK</span>
//           <span className="mono text-[16px] font-semibold" style={{ color: "var(--brass)" }}>{currentStock}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";

import { productsApi } from "../../api/products";
import { stockTransactionsApi } from "../../api/stockTransactions";

export function InventoryStockHistory() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [transactionType, setTransactionType] = useState("ALL");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [error, setError] = useState("");

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setError("");

        const data = await productsApi.list();

        setProducts(data);

        if (data.length > 0) {
          setSelectedProductId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // Load transactions whenever product changes
  useEffect(() => {
    if (!selectedProductId) {
      setTransactions([]);
      return;
    }

    const loadTransactions = async () => {
      try {
        setLoadingTransactions(true);
        setError("");

        const data =
          await stockTransactionsApi.listForProduct(
            selectedProductId
          );

        setTransactions(data);
      } catch (err) {
        console.error(
          "Failed to load stock transactions:",
          err
        );

        setTransactions([]);
        setError("Failed to load stock history.");
      } finally {
        setLoadingTransactions(false);
      }
    };

    loadTransactions();
  }, [selectedProductId]);

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) => product.id === selectedProductId
      ),
    [products, selectedProductId]
  );

  const filteredTransactions = useMemo(() => {
    if (transactionType === "ALL") {
      return transactions;
    }

    return transactions.filter(
      (transaction) =>
        transaction.transaction_type === transactionType
    );
  }, [transactions, transactionType]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTransactionType = (type) => {
    if (!type) return "—";

    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const formatQuantity = (transaction) => {
    const quantity = transaction.quantity;

    if (
      transaction.transaction_type === "PURCHASE" ||
      transaction.transaction_type === "SALE" ||
      transaction.transaction_type === "DAMAGE"
    ) {
      return transaction.transaction_type === "PURCHASE"
        ? `+${quantity}`
        : `-${quantity}`;
    }

    return quantity;
  };

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">
        Stock history
      </h1>

      <div className="grid sm:grid-cols-2 gap-3 max-w-[480px] mb-6">
        {/* Product */}
        <select
          value={selectedProductId}
          onChange={(e) =>
            setSelectedProductId(e.target.value)
          }
          disabled={loadingProducts}
          className="w-full rounded-md px-3 py-2.5 text-[14px]"
          style={{
            border: "1px solid var(--line)",
            background: "var(--panel)",
            color: "var(--ivory)",
          }}
        >
          {loadingProducts ? (
            <option>Loading products...</option>
          ) : products.length === 0 ? (
            <option>No products found</option>
          ) : (
            products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))
          )}
        </select>

        {/* Transaction type */}
        <select
          value={transactionType}
          onChange={(e) =>
            setTransactionType(e.target.value)
          }
          className="w-full rounded-md px-3 py-2.5 text-[14px]"
          style={{
            border: "1px solid var(--line)",
            background: "var(--panel)",
            color: "var(--ivory)",
          }}
        >
          <option value="ALL">
            All transaction types
          </option>
          <option value="OPENING">Opening</option>
          <option value="PURCHASE">Purchase</option>
          <option value="SALE">Sale</option>
          <option value="DAMAGE">Damage</option>
          <option value="ADJUSTMENT">
            Adjustment
          </option>
        </select>
      </div>

      {error && (
        <div
          className="mb-4 rounded-md px-4 py-3 text-[13px]"
          style={{
            border: "1px solid var(--line)",
            background: "var(--panel)",
            color: "var(--rust)",
          }}
        >
          {error}
        </div>
      )}

      <div
        className="rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
      >
        <table className="w-full text-left">
          <thead>
            <tr style={{ background: "var(--panel2)" }}>
              {["Date", "Type", "Qty", "Notes"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-4 py-2.5 text-[11px] font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    {heading.toUpperCase()}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loadingTransactions ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-[13px]"
                  style={{ color: "var(--muted)" }}
                >
                  Loading stock history...
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-[13px]"
                  style={{ color: "var(--muted)" }}
                >
                  No stock transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => {
                const isPositive =
                  transaction.transaction_type ===
                  "PURCHASE";

                const isNegative =
                  transaction.transaction_type ===
                    "SALE" ||
                  transaction.transaction_type ===
                    "DAMAGE";

                return (
                  <tr
                    key={transaction.id}
                    style={{
                      borderTop:
                        "1px solid var(--line)",
                      background: "var(--panel)",
                    }}
                  >
                    <td className="px-4 py-3 mono text-[12.5px]">
                      {formatDate(
                        transaction.created_at
                      )}
                    </td>

                    <td className="px-4 py-3 text-[13px]">
                      {formatTransactionType(
                        transaction.transaction_type
                      )}
                    </td>

                    <td
                      className="px-4 py-3 mono text-[13px]"
                      style={{
                        color: isPositive
                          ? "var(--teal)"
                          : isNegative
                            ? "var(--rust)"
                            : "var(--ivory)",
                      }}
                    >
                      {formatQuantity(transaction)}
                    </td>

                    <td
                      className="px-4 py-3 text-[13px]"
                      style={{ color: "var(--muted)" }}
                    >
                      {transaction.notes || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            borderTop: "1px solid var(--line)",
            background: "var(--panel2)",
          }}
        >
          <span
            className="disp text-[13px] font-semibold"
            style={{ color: "var(--muted)" }}
          >
            CURRENT STOCK
          </span>

          <span
            className="mono text-[16px] font-semibold"
            style={{ color: "var(--brass)" }}
          >
            {selectedProduct?.quantity ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}