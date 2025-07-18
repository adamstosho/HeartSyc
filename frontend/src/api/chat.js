import apiClient from "./client"

export const chatAPI = {
  getChat: (matchId) => apiClient.get(`/chat/${matchId}`),
  sendMessage: (matchId, content) => apiClient.post(`/chat/${matchId}`, { content }),
  getConversations: () => apiClient.get("/chat/conversations"),
  markAsRead: (matchId) => apiClient.post(`/chat/${matchId}/read`),
}
