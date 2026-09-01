import { request } from "./client";

export const dashboardApi = {
  summary: () => request("/dashboard/summary"),
  recentActivity: (limit = 10) => request(`/dashboard/recent-activity?limit=${limit}`),
};
