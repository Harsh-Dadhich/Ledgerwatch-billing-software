import { request } from "./client";

export const stockTransactionsApi = {
  listForProduct: (productId) =>
    request(`/stock-transactions/product/${productId}`),

  create: (payload) =>
    request("/stock-transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};