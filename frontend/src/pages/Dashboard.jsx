"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Heart, Users, MessageCircle, Star, TrendingUp, Calendar } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { matchesAPI } from "../api/matches"
import { chatAPI } from "../api/chat"
import { usersAPI } from "../api/users"
import UserCard from "../components/UserCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

function Dashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  // Fetch real dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: usersAPI.getDashboardStats,
  })

  // Fetch match suggestions
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["match-suggestions"],
    queryFn: matchesAPI.getSuggestions,
  })

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: chatAPI.getConversations,
  })

  const handleSendRequest = async (userId) => {
    try {
      await matchesAPI.sendMatchRequest(userId)
      toast.success("Match request sent!") // Using toast for success message
      queryClient.invalidateQueries(["dashboard-stats"])
    } catch (error) {
      toast.error("Failed to send match request") // Using toast for error message
    }
  }

  const handleViewProfile = async (userId) => {
    // Navigate to user profile or open modal
    // After viewing, refetch stats
    // (Assume navigation happens elsewhere)
    queryClient.invalidateQueries(["dashboard-stats"])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="bg-gradient-to-r from-heart-red to-sky-blue rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-white/90 text-lg">
                {user?.isVerified
                  ? "Your profile is verified. Start connecting with amazing people!"
                  : "Complete your profile verification to unlock all features."}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 p-4 rounded-full">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {!user?.isVerified && (
            <div className="mt-4">
              <Link
                to="/profile/edit"
                className="bg-white text-heart-red hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <Star className="h-4 w-4" />
                <span>Complete Verification</span>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statsLoading ? (
          <div className="col-span-4 flex justify-center py-8">
            <LoadingSpinner text="Loading stats..." />
          </div>
        ) : (
          [
          {
            title: "Total Matches",
              value: dashboardStats?.totalMatches || 0,
            icon: Users,
            color: "bg-heart-red",
            change: "+12%",
          },
          {
            title: "Active Chats",
              value: dashboardStats?.activeChats || 0,
            icon: MessageCircle,
            color: "bg-sky-blue",
            change: "+8%",
          },
          {
            title: "Profile Views",
              value: dashboardStats?.profileViews || 0,
            icon: TrendingUp,
            color: "bg-mint-green",
            change: "+23%",
          },
          {
            title: "Connection Rate",
              value: `${dashboardStats?.connectionRate || 0}%`,
            icon: Star,
            color: "bg-sun-gold",
            change: "+5%",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-gray">{stat.title}</p>
                <p className="text-2xl font-bold text-deep-navy">{stat.value}</p>
                <p className="text-sm text-mint-green font-medium">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
          ))
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Link to="/discover" className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="text-center">
            <div className="bg-heart-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-heart-red/20 transition-colors">
              <Users className="h-8 w-8 text-heart-red" />
            </div>
            <h3 className="text-lg font-semibold text-deep-navy mb-2">Discover People</h3>
            <p className="text-slate-gray text-sm">Browse through profiles and find your perfect match</p>
          </div>
        </Link>

        <Link to="/matches" className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="text-center">
            <div className="bg-sky-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-blue/20 transition-colors">
              <Heart className="h-8 w-8 text-sky-blue" />
            </div>
            <h3 className="text-lg font-semibold text-deep-navy mb-2">My Matches</h3>
            <p className="text-slate-gray text-sm">View your matches and connection requests</p>
          </div>
        </Link>

        <Link to="/chat" className="card hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="text-center">
            <div className="bg-mint-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-mint-green/20 transition-colors">
              <MessageCircle className="h-8 w-8 text-deep-navy" />
            </div>
            <h3 className="text-lg font-semibold text-deep-navy mb-2">Messages</h3>
            <p className="text-slate-gray text-sm">Continue conversations with your connections</p>
          </div>
        </Link>
      </motion.div>

      {/* Recent Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-deep-navy">Suggested For You</h2>
          <Link to="/discover" className="text-heart-red hover:text-red-600 font-medium flex items-center space-x-1">
            <span>View All</span>
            <TrendingUp className="h-4 w-4" />
          </Link>
        </div>

        {suggestionsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Finding your perfect matches..." />
          </div>
        ) : suggestions?.suggestions?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.suggestions.slice(0, 3).map((suggestion) => (
              <UserCard
                key={suggestion._id}
                user={suggestion}
                onSendRequest={handleSendRequest}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-gray mb-2">No suggestions yet</h3>
            <p className="text-slate-gray mb-4">Complete your profile to get better match suggestions</p>
            <Link to="/profile/edit" className="btn-primary">
              Complete Profile
            </Link>
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-2xl font-bold text-deep-navy mb-6">Recent Activity</h2>

        <div className="card">
          {conversationsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : conversations?.length > 0 ? (
            <div className="space-y-4">
              {conversations.slice(0, 5).map((conversation) => (
                <div
                  key={conversation._id}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-heart-red rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-deep-navy">New message in conversation</p>
                    <p className="text-sm text-slate-gray">
                      {conversation.messages?.length > 0
                        ? `Last message: ${new Date(conversation.messages[conversation.messages.length - 1].timestamp).toLocaleDateString()}`
                        : "No messages yet"}
                    </p>
                  </div>
                  <Link to={`/chat/${conversation.matchId}`} className="text-heart-red hover:text-red-600 font-medium">
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-gray mb-2">No recent activity</h3>
              <p className="text-slate-gray">Start connecting with people to see your activity here</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
