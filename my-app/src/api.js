// Points at your FastAPI backend. Override via a .env file (VITE_API_BASE=...)
// when you deploy, so you don't hardcode localhost into production.
// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// async function request(path, options = {}) {
//   const res = await fetch(`${API_BASE}${path}`, {
//     // Required so the browser sends/receives the httpOnly auth cookies.
//     // Without this, every request after login would look unauthenticated.
//     credentials: "include",
//     headers: { "Content-Type": "application/json", ...(options.headers || {}) },
//     ...options,
//   });

//   if (!res.ok) {
//     let detail = res.statusText;
//     try {
//       const data = await res.json();
//       detail = data.detail || detail;
//     } catch {
//       // response wasn't JSON, fall back to statusText
//     }
//     throw new Error(detail);
//   }

//   if (res.status === 204) return null;
//   return res.json();
// }

// export const api = {
//   // auth
//   signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
//   login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
//   logout: () => request("/auth/logout", { method: "POST" }),
//   me: () => request("/auth/me"),
//   createStaff: (payload) => request("/auth/staff", { method: "POST", body: JSON.stringify(payload) }),

//   // products
//   listProducts: () => request("/products"),
//   createProduct: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
//   updateProduct: (id, payload) => request(`/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
//   deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

//   // bills
//   createBill: (payload) => request("/bills", { method: "POST", body: JSON.stringify(payload) }),
//   listBills: (limit = 50, skip = 0) => request(`/bills?limit=${limit}&skip=${skip}`),
//   getBill: (id) => request(`/bills/${id}`),
//   voidBill: (id) => request(`/bills/${id}`, { method: "DELETE" }),

//   // dashboard
//   dashboardSummary: () => request("/dashboard/summary"),
//   recentActivity: (limit = 10) => request(`/dashboard/recent-activity?limit=${limit}`),
// };

// Points at your FastAPI backend. Override via a .env file (VITE_API_BASE=...)
// when you deploy, so you don't hardcode localhost into production.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    // Required so the browser sends/receives the httpOnly auth cookies.
    // Without this, every request after login would look unauthenticated.
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {
      // response wasn't JSON, fall back to statusText
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // auth
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
  createStaff: (payload) => request("/auth/staff", { method: "POST", body: JSON.stringify(payload) }),
  getStaff: () => request("/auth/staff"),
  deleteStaff: (userId) => request(`/auth/staff/${userId}`, { method: "DELETE" }),
  forgotPassword: (payload) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
  reactivateStaff: (userId) => request(`/auth/staff/${userId}/reactivate`, { method: "POST" }),

  // products
  listProducts: () => request("/products"),
  createProduct: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id, payload) => request(`/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // bills
  createBill: (payload) => request("/bills", { method: "POST", body: JSON.stringify(payload) }),
  listBills: (limit = 50, skip = 0) => request(`/bills?limit=${limit}&skip=${skip}`),
  getBill: (id) => request(`/bills/${id}`),
  voidBill: (id) => request(`/bills/${id}`, { method: "DELETE" }),

  // dashboard
  dashboardSummary: () => request("/dashboard/summary"),
  recentActivity: (limit = 10) => request(`/dashboard/recent-activity?limit=${limit}`),
};