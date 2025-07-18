import apiClient from "./client"

export const authAPI = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  register: (userData) => apiClient.post("/auth/register", userData),
  getCurrentUser: () => apiClient.get("/auth/me"),
}
