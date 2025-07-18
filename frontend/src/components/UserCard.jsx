"use client"

import { motion } from "framer-motion"
import { Heart, MapPin, Calendar, BookOpen, Briefcase, MessageCircle } from "lucide-react"
import { calculateAge } from "../utils/helpers"

function UserCard({ user, onSendRequest, onViewProfile, showActions = true }) {
  const age = calculateAge(user.dob)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card max-w-sm mx-auto"
    >
      {/* Profile Photo */}
      <div className="relative mb-4">
        <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
          {user.profilePhoto ? (
            <img src={user.profilePhoto || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-mint-green">
              <span className="text-4xl font-bold text-deep-navy">{user.name.charAt(0)}</span>
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
          <h3 className="text-xl font-bold text-deep-navy">{user.name}</h3>
          <div className="flex items-center space-x-2 text-slate-gray text-sm">
            <Calendar className="h-4 w-4" />
            <span>{age} years old</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-gray text-sm">
          <MapPin className="h-4 w-4" />
          <span>{user.state}, Nigeria</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-gray text-sm">
            <BookOpen className="h-4 w-4" />
            <span>{user.education || "Education not specified"}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-gray text-sm">
            <Briefcase className="h-4 w-4" />
            <span>{user.employmentStatus || "Employment not specified"}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-sky-blue/20 text-sky-blue px-2 py-1 rounded-full text-xs font-medium">{user.tribe}</span>
          <span className="bg-mint-green/20 text-deep-navy px-2 py-1 rounded-full text-xs font-medium">
            {user.religion}
          </span>
        </div>

        {/* Bio */}
        {user.bio && <p className="text-slate-gray text-sm line-clamp-3">{user.bio}</p>}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSendRequest(user._id)}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>Connect</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewProfile(user._id)}
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>View</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default UserCard
