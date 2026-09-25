import { request } from "./client";

export const brandsApi = {
  list: () => request("/brands"),
  create: (payload) => request("/brands", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/brands/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id) => request(`/brands/${id}`, { method: "DELETE" }),
};