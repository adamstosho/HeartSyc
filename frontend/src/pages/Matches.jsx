"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Heart, MessageCircle, Clock, Users } from "lucide-react"
import { matchesAPI } from "../api/matches"
import LoadingSpinner from "../components/LoadingSpinner"
import { calculateAge } from "../utils/helpers"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

function Matches() {
  const [activeTab, setActiveTab] = useState("suggestions")
  const queryClient = useQueryClient()

  // Fetch match suggestions
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["match-suggestions"],
    queryFn: matchesAPI.getSuggestions,
  })

  // Accept match request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: matchesAPI.acceptMatchRequest,
    onSuccess: () => {
      toast.success("Match request accepted!")
      queryClient.invalidateQueries(["match-requests"])
      queryClient.invalidateQueries(["conversations"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to accept request")
    },
  })

  // Reject match request mutation
  const rejectRequestMutation = useMutation({
    mutationFn: matchesAPI.rejectMatchRequest,
    onSuccess: () => {
      toast.success("Match request rejected")
      queryClient.invalidateQueries(["match-requests"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reject request")
    },
  })

  // Send match request mutation
  const sendRequestMutation = useMutation({
    mutationFn: matchesAPI.sendMatchRequest,
    onSuccess: () => {
      toast.success("Match request sent!")
      queryClient.invalidateQueries(["match-suggestions"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send match request")
    },
  })

  const handleSendRequest = (userId) => {
    sendRequestMutation.mutate(userId)
  }

  const handleAcceptRequest = (requestId) => {
    acceptRequestMutation.mutate(requestId)
  }

  const handleRejectRequest = (requestId) => {
    rejectRequestMutation.mutate(requestId)
  }

  const tabs = [
    { id: "suggestions", label: "Suggestions", icon: Heart },
    { id: "received", label: "Received", icon: Clock },
    { id: "sent", label: "Sent", icon: Users },
    { id: "matched", label: "Matched", icon: MessageCircle },
  ]

  const renderSuggestions = () => (
    <div>
      {suggestionsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Finding your perfect matches..." />
        </div>
      ) : suggestions?.suggestions?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.suggestions.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              {/* Profile Photo */}
              <div className="relative mb-4">
                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-mint-green">
                      <span className="text-3xl font-bold text-deep-navy">{user.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                {user.isVerified && (
                  <div className="absolute top-2 right-2 bg-mint-green text-deep-navy px-2 py-1 rounded-full text-xs font-semibold">
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-deep-navy">{user.name}</h3>
                  <p className="text-sm text-slate-gray">
                    {calculateAge(user.dob)} years old • {user.state}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-sky-blue/20 text-sky-blue px-2 py-1 rounded-full text-xs font-medium">
                    {user.tribe}
                  </span>
                  <span className="bg-mint-green/20 text-deep-navy px-2 py-1 rounded-full text-xs font-medium">
                    {user.religion}
                  </span>
                </div>

                {user.bio && <p className="text-sm text-slate-gray line-clamp-2">{user.bio}</p>}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendRequest(user._id)}
                    disabled={sendRequestMutation.isPending}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Connect</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-gray mb-2">No suggestions available</h3>
          <p className="text-slate-gray mb-4">Complete your profile to get better match suggestions</p>
          <Link to="/profile/edit" className="btn-primary">
            Complete Profile
          </Link>
        </div>
      )}
    </div>
  )

  // Fetch received, sent, and matched requests
  const { data: receivedData, isLoading: receivedLoading } = useQuery({
    queryKey: ["match-received"],
    queryFn: matchesAPI.getReceivedRequests,
  })
  const { data: sentData, isLoading: sentLoading } = useQuery({
    queryKey: ["match-sent"],
    queryFn: matchesAPI.getSentRequests,
  })
  const { data: matchedData, isLoading: matchedLoading } = useQuery({
    queryKey: ["match-matched"],
    queryFn: matchesAPI.getMatchedRequests,
  })

  const renderReceived = () => (
    <div>
      {receivedLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading received requests..." />
        </div>
      ) : receivedData?.received?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receivedData.received.map((req, index) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {req.from && req.from.profilePhoto ? (
                    <img src={req.from.profilePhoto} alt={req.from.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-mint-green">
                      <span className="text-2xl font-bold text-deep-navy">{req.from && req.from.name ? req.from.name.charAt(0) : "?"}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-deep-navy">{req.from && req.from.name ? req.from.name : "Unknown"}</h3>
                  <p className="text-sm text-slate-gray">{req.from && req.from.state ? req.from.state : ""}{req.from && req.from.tribe ? `, ${req.from.tribe}` : ""}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(req._id)}
                  disabled={acceptRequestMutation.isPending}
                  className="btn-primary flex-1"
                >Accept</button>
                <button
                  onClick={() => handleRejectRequest(req._id)}
                  disabled={rejectRequestMutation.isPending}
                  className="btn-outline flex-1"
                >Reject</button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        renderPlaceholder("No received requests", "Match requests from others will appear here", Clock)
      )}
    </div>
  )

  const renderSent = () => (
    <div>
      {sentLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading sent requests..." />
        </div>
      ) : sentData?.sent?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sentData.sent.map((req, index) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {req.to.profilePhoto ? (
                    <img src={req.to.profilePhoto} alt={req.to.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-mint-green">
                      <span className="text-2xl font-bold text-deep-navy">{req.to.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-deep-navy">{req.to.name}</h3>
                  <p className="text-sm text-slate-gray">{req.to.state}, {req.to.tribe}</p>
                </div>
              </div>
              <div className="text-slate-gray text-sm">Status: {req.status}</div>
            </motion.div>
          ))}
        </div>
      ) : (
        renderPlaceholder("No sent requests", "Your sent match requests will appear here", Users)
      )}
    </div>
  )

  const renderMatched = () => (
    <div>
      {matchedLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading matches..." />
        </div>
      ) : matchedData?.matched?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedData.matched.map((req, index) => {
            const other = req.from._id === req.to._id ? req.from : (req.from._id === req.to._id ? req.to : (req.from._id === req.user?._id ? req.to : req.from));
            // fallback: show both
            return (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {req.from.profilePhoto ? (
                      <img src={req.from.profilePhoto} alt={req.from.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-mint-green">
                        <span className="text-2xl font-bold text-deep-navy">{req.from.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-deep-navy">{req.from.name} & {req.to.name}</h3>
                    <p className="text-sm text-slate-gray">Matched</p>
                  </div>
                </div>
                <Link to={`/chat/${req._id}`} className="btn-primary w-full flex items-center justify-center space-x-2 mt-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      ) : (
        renderPlaceholder("No matches yet", "Your successful matches will appear here for chatting", MessageCircle)
      )}
    </div>
  )

  const renderPlaceholder = (title, description, icon) => (
    <div className="card text-center py-12">
      {icon && <icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />}
      <h3 className="text-lg font-semibold text-slate-gray mb-2">{title}</h3>
      <p className="text-slate-gray">{description}</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-deep-navy mb-2">My Matches</h1>
        <p className="text-slate-gray">Manage your connections and discover new matches</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="border-b border-light-gray">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-heart-red text-heart-red"
                    : "border-transparent text-slate-gray hover:text-deep-navy hover:border-gray-300"
                }`}
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {activeTab === "suggestions" && renderSuggestions()}
        {activeTab === "received" && renderReceived()}
        {activeTab === "sent" && renderSent()}
        {activeTab === "matched" && renderMatched()}
      </motion.div>
    </div>
  )
}

export default Matches
