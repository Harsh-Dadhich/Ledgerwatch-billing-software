

// import { request, requestFile } from "./client";

// export const productsApi = {
//   bulkImport: (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     return requestFile("/products/bulk-import", formData);
//   },

//   downloadImportTemplate: async () => {
//     const API_BASE =
//       import.meta.env.VITE_API_BASE || "http://localhost:8000";

//     const res = await fetch(
//       `${API_BASE}/products/bulk-import/template`,
//       {
//         credentials: "include",
//       }
//     );

//     if (!res.ok) {
//       throw new Error("Could not download template");
//     }

//     const blob = await res.blob();

//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");

//     a.href = url;
//     a.download = "product_import_template.csv";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//     URL.revokeObjectURL(url);
//   },

//   list: () => request("/products"),

//   create: (payload) =>
//     request("/products", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),

//   lowStock: () => request("/products/low-stock"),

//   update: (id, payload) =>
//     request(`/products/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(payload),
//     }),

//   remove: (id) =>
//     request(`/products/${id}`, {
//       method: "DELETE",
//     }),
// };

import { request, requestFile } from "./client";

export const productsApi = {
  bulkImport: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return requestFile("/products/bulk-import", formData);
  },

  downloadImportTemplate: async () => {
    const API_BASE =
      import.meta.env.VITE_API_BASE || "http://localhost:8000";

    const res = await fetch(
      `${API_BASE}/products/bulk-import/template`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Could not download template");
    }

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "product_import_template.csv";

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  },

  // Product listing with search + pagination
  list: ({
    page = 1,
    pageSize = 20,
    search = "",
    category = "",
  } = {}) => {
    const params = new URLSearchParams();

    params.set("page", page);
    params.set("page_size", pageSize);

    if (search.trim()) {
      params.set("search", search.trim());
    }
    if (category) {
      params.set("category", category);
    }

    return request(`/products?${params.toString()}`);
  },

  get: (id) => request(`/products/${id}`),

  create: (payload) =>
    request("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  lowStock: () => request("/products/low-stock"),

  update: (id, payload) =>
    request(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    request(`/products/${id}`, {
      method: "DELETE",
    }),
};