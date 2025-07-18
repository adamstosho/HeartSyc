"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { MessageCircle, Search } from "lucide-react"
import { chatAPI } from "../api/chat"
import LoadingSpinner from "../components/LoadingSpinner"
import { formatTime } from "../utils/helpers"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Chat() {
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()

  // Fetch conversations
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: chatAPI.getConversations,
  })

  const filteredConversations =
    conversations?.filter((conversation) =>
      conversation.participants?.some((participant) =>
        participant.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    ) || []

  // Sort conversations by last message timestamp descending
  const sortedConversations = (filteredConversations || []).slice().sort((a, b) => {
    const lastA = getLastMessage(a.messages)
    const lastB = getLastMessage(b.messages)
    return (lastB?.timestamp || 0) - (lastA?.timestamp || 0)
  })

  // Get unread count for the current user
  const getUnreadCount = (messages) =>
    messages?.filter((msg) => msg.unreadBy && msg.unreadBy.includes(user?._id)).length || 0

  const getLastMessage = (messages) => {
    if (!messages || messages.length === 0) return null
    return messages[messages.length - 1]
  }

  const getOtherParticipant = (participants) => {
    return participants?.find((p) => p._id !== user?._id)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-deep-navy mb-2">Messages</h1>
        <p className="text-slate-gray">Continue your conversations with your matches</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            placeholder="Search conversations..."
          />
        </div>
      </motion.div>

      {/* Conversations List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading conversations..." />
          </div>
        ) : sortedConversations.length > 0 ? (
          <div className="space-y-4">
            {sortedConversations.map((conversation, index) => {
              const lastMessage = getLastMessage(conversation.messages)
              const otherParticipant = getOtherParticipant(conversation.participants)
              const unreadCount = getUnreadCount(conversation.messages)

              return (
                <motion.div
                  key={conversation._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/chat/${conversation.matchId}`}
                    className="card hover:shadow-lg transition-shadow cursor-pointer block"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
                        {otherParticipant?.profilePhoto ? (
                          <img
                            src={otherParticipant.profilePhoto || "/placeholder.svg"}
                            alt={otherParticipant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-mint-green">
                            <span className="text-lg font-bold text-deep-navy">
                              {otherParticipant?.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-heart-red text-white text-xs rounded-full px-2 py-0.5 font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-deep-navy truncate">
                            {otherParticipant?.name || "Unknown User"}
                          </h3>
                          {lastMessage && (
                            <span className="text-sm text-slate-gray">{formatTime(lastMessage.timestamp)}</span>
                          )}
                        </div>

                        {lastMessage ? (
                          <p className="text-sm text-slate-gray truncate">{lastMessage.content}</p>
                        ) : (
                          <p className="text-sm text-slate-gray italic">No messages yet - start the conversation!</p>
                        )}
                      </div>

                      {/* Message Icon */}
                      <div className="flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-heart-red" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-gray mb-2">No conversations yet</h3>
            <p className="text-slate-gray mb-4">Start connecting with people to begin conversations</p>
          </div>
        )}
      </motion.div>

      {/* Always show Discover People button below chat list */}
      <div className="flex justify-center mt-8">
        <Link to="/discover" className="btn-primary">
          Discover People
        </Link>
      </div>
    </div>
  )
}

export default Chat
