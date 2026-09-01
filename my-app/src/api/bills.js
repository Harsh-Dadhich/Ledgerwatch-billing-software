import { request } from "./client";

export const billsApi = {
  create: (payload) => request("/bills", { method: "POST", body: JSON.stringify(payload) }),
  list: (limit = 50, skip = 0) => request(`/bills?limit=${limit}&skip=${skip}`),
  get: (id) => request(`/bills/${id}`),
  void: (id) => request(`/bills/${id}`, { method: "DELETE" }),
};
