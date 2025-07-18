import apiClient from "./client"

export const matchesAPI = {
  getSuggestions: () => apiClient.get("/match/suggestions"),
  sendMatchRequest: (userId) => apiClient.post(`/match/request/${userId}`),
  acceptMatchRequest: (requestId) => apiClient.post(`/match/accept/${requestId}`),
  rejectMatchRequest: (requestId) => apiClient.post(`/match/reject/${requestId}`),
  getReceivedRequests: () => apiClient.get("/match/received"),
  getSentRequests: () => apiClient.get("/match/sent"),
  getMatchedRequests: () => apiClient.get("/match/matched"),
}
