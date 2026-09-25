import { request } from "./client";

export const categoriesApi = {
  list: () => request("/categories"),
  create: (payload) => request("/categories", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id) => request(`/categories/${id}`, { method: "DELETE" }),
};
