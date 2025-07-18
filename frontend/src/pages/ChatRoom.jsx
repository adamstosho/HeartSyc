"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { Send, ArrowLeft, MoreVertical, Phone, Video, Flag } from "lucide-react"
import { chatAPI } from "../api/chat"
import { adminAPI } from "../api/admin"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import { formatTime } from "../utils/helpers"
import toast from "react-hot-toast"

function ChatRoom() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const messagesEndRef = useRef(null)
  const queryClient = useQueryClient()

  // Fetch chat
  const { data: chat, isLoading } = useQuery({
    queryKey: ["chat", matchId],
    queryFn: () => chatAPI.getChat(matchId),
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  })

  // Mark messages as read when chat is loaded or receives new messages
  useEffect(() => {
    if (chat && chat._id) {
      chatAPI.markAsRead(matchId)
    }
  }, [chat, matchId])

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content) => chatAPI.sendMessage(matchId, content),
    onSuccess: () => {
      setMessage("")
      queryClient.invalidateQueries(["chat", matchId])
      queryClient.invalidateQueries(["conversations"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send message")
    },
  })

  // Report user mutation
  const reportUserMutation = useMutation({
    mutationFn: ({ userId, reason }) => adminAPI.reportUser(userId, reason),
    onSuccess: () => {
      toast.success("Report submitted successfully")
      setShowReportModal(false)
      setReportReason("")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit report")
    },
  })

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat?.messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim())
    }
  }

  const getOtherParticipant = () => {
    return chat?.participants?.find((p) => p._id !== user?._id)
  }

  const handleReport = () => {
    const otherUser = getOtherParticipant()
    if (otherUser && reportReason.trim()) {
      reportUserMutation.mutate({
        userId: otherUser._id,
        reason: reportReason.trim(),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading conversation..." />
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-deep-navy mb-2">Conversation not found</h2>
          <p className="text-slate-gray mb-4">This conversation may not exist or you don't have access to it.</p>
          <button onClick={() => navigate("/chat")} className="btn-primary">
            Back to Messages
          </button>
        </div>
      </div>
    )
  }

  const otherParticipant = getOtherParticipant()

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-light-gray p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/chat")} className="text-slate-gray hover:text-deep-navy">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {otherParticipant?.profilePhoto ? (
                <img
                  src={otherParticipant.profilePhoto || "/placeholder.svg"}
                  alt={otherParticipant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-mint-green">
                  <span className="text-sm font-bold text-deep-navy">{otherParticipant?.name?.charAt(0) || "?"}</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-deep-navy">{otherParticipant?.name || "Unknown User"}</h2>
              <p className="text-sm text-slate-gray">
                {otherParticipant?.state ? `${otherParticipant.state}, Nigeria` : "Location unknown"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-gray hover:text-deep-navy hover:bg-gray-100 rounded-lg">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 text-slate-gray hover:text-deep-navy hover:bg-gray-100 rounded-lg">
            <Video className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-slate-gray hover:text-deep-navy hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    setShowReportModal(true)
                    setShowOptions(false)
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Report User
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages?.length > 0 ? (
          chat.messages.map((msg, index) => {
            const isOwnMessage = msg.sender === user?._id
            const showAvatar = index === 0 || chat.messages[index - 1].sender !== msg.sender

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  {!isOwnMessage && showAvatar && (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {otherParticipant?.profilePhoto ? (
                        <img
                          src={otherParticipant.profilePhoto || "/placeholder.svg"}
                          alt={otherParticipant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-mint-green">
                          <span className="text-xs font-bold text-deep-navy">
                            {otherParticipant?.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`${!isOwnMessage && !showAvatar ? "ml-10" : ""}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage ? "bg-heart-red text-white" : "bg-gray-100 text-deep-navy"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className={`text-xs text-slate-gray mt-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-gray mb-2">Start the conversation</h3>
              <p className="text-slate-gray">Send a message to break the ice!</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-t border-light-gray p-4"
      >
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input-field"
            disabled={sendMessageMutation.isPending}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-heart-red hover:bg-red-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sendMessageMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flag className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-deep-navy mb-2">Report User</h3>
              <p className="text-slate-gray">Help us keep HeartSync safe by reporting inappropriate behavior</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-gray mb-2">Reason for reporting</label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="Please describe the issue..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowReportModal(false)
                  setReportReason("")
                }}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim() || reportUserMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {reportUserMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Flag className="h-4 w-4" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ChatRoom
