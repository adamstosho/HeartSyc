import apiClient from "./client"

export const usersAPI = {
  getUsers: (params) => apiClient.get("/users", { params }),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  getDashboardStats: () => apiClient.get("/users/me/dashboard-stats"),
}


