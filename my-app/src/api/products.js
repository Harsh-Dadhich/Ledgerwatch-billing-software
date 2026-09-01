import { request } from "./client";

export const productsApi = {
  list: () => request("/products"),
  create: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
};
