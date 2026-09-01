import { request } from "./client";

export const authApi = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
  createStaff: (payload) => request("/auth/staff", { method: "POST", body: JSON.stringify(payload) }),
  getStaff: () => request("/auth/staff"),
  deleteStaff: (userId) => request(`/auth/staff/${userId}`, { method: "DELETE" }),
  reactivateStaff: (userId) => request(`/auth/staff/${userId}/reactivate`, { method: "POST" }),
  forgotPassword: (payload) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
};
