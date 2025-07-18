import apiClient from "./client"

export const adminAPI = {
  getAllUsers: () => apiClient.get("/admin/users"),
  verifyUser: (id) => apiClient.post(`/admin/verify-user/${id}`),
  banUser: (id) => apiClient.post(`/admin/ban-user/${id}`),
  getReports: () => apiClient.get("/admin/reports"),
  reportUser: (id, reason) => apiClient.post(`/admin/report-user/${id}`, { reason }),
  unbanUser: (id) => apiClient.post(`/admin/unban-user/${id}`),
  deleteUser: (id) => apiClient.delete(`/admin/delete-user/${id}`),
  getStats: () => apiClient.get("/admin/stats"),
}
