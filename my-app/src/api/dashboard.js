import { request } from "./client";

export const dashboardApi = {
  summary: () => request("/dashboard/summary"),
  recentActivity: (limit = 10) => request(`/dashboard/recent-activity?limit=${limit}`),
  salesTrend:   (days = 7)           => request(`/dashboard/sales-trend?days=${days}`),
  topProducts:  (days = 30, limit = 5) => request(`/dashboard/top-products?days=${days}&limit=${limit}`),
  paymentSplit: (days = 30)          => request(`/dashboard/payment-split?days=${days}`),
  salesByHour:  (days = 30)          => request(`/dashboard/sales-by-hour?days=${days}`),
  categoryAnalytics: (days = 30) => request(`/categories/category-analytics?days=${days}`),
  brandAnalytics: (days = 30) => request(`/brands/brand-analytics?days=${days}`),
};
