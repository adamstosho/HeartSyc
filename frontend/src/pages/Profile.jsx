"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { User, MapPin, Calendar, BookOpen, Briefcase, Shield, Edit, Trash2, Camera, Mail } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { usersAPI } from "../api/users"
import { adminAPI } from "../api/admin"
import LoadingSpinner from "../components/LoadingSpinner"
import { calculateAge, formatDate } from "../utils/helpers"
import { Link, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { matchesAPI } from "../api/matches"

function Profile() {
  const { user: currentUser } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // If id is present and not current user's id, fetch user by id
  const isOwnProfile = !id || id === currentUser?._id
  const { data: viewedUser, isLoading: loadingViewedUser, isError: isUserError } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => usersAPI.getUserById(id),
    enabled: !!id && id !== currentUser?._id,
  })
  const user = isOwnProfile ? currentUser : viewedUser

  // Check if the viewed user is matched with the current user
  const { data: matchedData } = useQuery({
    queryKey: ["match-matched"],
    queryFn: matchesAPI.getMatchedRequests,
    enabled: !isOwnProfile,
  })
  const isMatched =
    isOwnProfile ||
    ((matchedData?.matched || []).some(
      (req) =>
        (req.from?._id === currentUser?._id && req.to?._id === user?._id) ||
        (req.to?._id === currentUser?._id && req.from?._id === user?._id)
    ))

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: () => usersAPI.deleteUser(user?._id),
    onSuccess: () => {
      toast.success("Account deleted successfully")
      localStorage.removeItem("token")
      navigate("/")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete account")
    },
  })

  // Report user mutation
  const reportUserMutation = useMutation({
    mutationFn: (reason) => adminAPI.reportUser(user?._id, reason),
    onSuccess: () => {
      toast.success("Report submitted successfully")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit report")
    },
  })

  const handleDeleteAccount = () => {
    deleteUserMutation.mutate()
    setShowDeleteConfirm(false)
  }

  if (loadingViewedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    )
  }

  if (isUserError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-deep-navy mb-2">User not found</h2>
          <p className="text-slate-gray mb-4">This user may not exist or has been deleted.</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Always show basic info for other users
  if (!isOwnProfile && user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {user.profilePhoto ? (
                <img src={user.profilePhoto || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-mint-green">
                  <span className="text-4xl font-bold text-deep-navy">{user.name?.charAt(0) || "?"}</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-deep-navy">{user.name}</h1>
            <div className="flex items-center space-x-2 text-slate-gray text-sm">
              <Calendar className="h-4 w-4" />
              <span>{user.dob ? `${calculateAge(user.dob)} years old` : "Age not specified"}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-gray text-sm">
              <MapPin className="h-4 w-4" />
              <span>{user.state ? `${user.state}, Nigeria` : "State not specified"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.tribe && <span className="bg-sky-blue/20 text-sky-blue px-2 py-1 rounded-full text-xs font-medium">{user.tribe}</span>}
              {user.religion && <span className="bg-mint-green/20 text-deep-navy px-2 py-1 rounded-full text-xs font-medium">{user.religion}</span>}
            </div>
            {/* New: Education, Employment, Languages, Marital Intent */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-slate-gray" />
                <span className="text-sm text-slate-gray">Education:</span>
                <span className="font-medium text-deep-navy">{user.education || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-slate-gray" />
                <span className="text-sm text-slate-gray">Employment:</span>
                <span className="font-medium text-deep-navy">{user.employmentStatus || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <span className="text-sm text-slate-gray">Languages:</span>
                <div className="flex flex-wrap gap-2">
                  {user.spokenLanguages?.length > 0 ? user.spokenLanguages.map((lang) => (
                    <span key={lang} className="bg-sun-gold/20 text-deep-navy px-2 py-1 rounded-full text-xs font-medium">{lang}</span>
                  )) : <span className="text-slate-gray">Not specified</span>}
                </div>
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <span className="text-sm text-slate-gray">Marital Intent:</span>
                <span className="bg-heart-red/20 text-heart-red px-3 py-1 rounded-full text-sm font-medium capitalize ml-2">{user.maritalIntent || "Not specified"}</span>
              </div>
            </div>
            {/* End new details */}
            {user.bio && <p className="text-slate-gray text-sm line-clamp-3 mt-4">{user.bio}</p>}
          </div>
        </motion.div>
        <div className="text-center text-slate-gray mt-8">
          <p>Connect with this user to see more details!</p>
        </div>
      </div>
    )
  }

  // Own profile (full details and actions)
  const age = user.dob ? calculateAge(user.dob) : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Photo */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto || "/placeholder.svg"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-mint-green">
                  <span className="text-4xl font-bold text-deep-navy">{user.name?.charAt(0) || "?"}</span>
                </div>
              )}
            </div>
            {isOwnProfile && (
            <Link
              to="/profile/edit"
              className="absolute bottom-0 right-0 bg-heart-red text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </Link>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <h1 className="text-3xl font-bold text-deep-navy">{user.name}</h1>
              {user.isVerified && (
                <div className="bg-mint-green text-deep-navy px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-slate-gray">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{age ? `${age} years old` : "Age not specified"}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{user.state ? `${user.state}, Nigeria` : "State not specified"}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
              <Link to="/profile/edit" className="btn-primary flex items-center justify-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">Personal Information</h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-slate-gray" />
              <div>
                <p className="text-sm text-slate-gray">Gender</p>
                <p className="font-medium text-deep-navy capitalize">{user.gender}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-slate-gray" />
              <div>
                <p className="text-sm text-slate-gray">Date of Birth</p>
                <p className="font-medium text-deep-navy">{user.dob ? formatDate(user.dob) : "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-slate-gray" />
              <div>
                <p className="text-sm text-slate-gray">Education</p>
                <p className="font-medium text-deep-navy">{user.education || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-slate-gray" />
              <div>
                <p className="text-sm text-slate-gray">Employment</p>
                <p className="font-medium text-deep-navy">{user.employmentStatus || "Not specified"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cultural Background */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">Cultural Background</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-gray mb-1">Tribe</p>
              <span className="bg-sky-blue/20 text-sky-blue px-3 py-1 rounded-full text-sm font-medium">
                {user.tribe}
              </span>
            </div>

            <div>
              <p className="text-sm text-slate-gray mb-1">Religion</p>
              <span className="bg-mint-green/20 text-deep-navy px-3 py-1 rounded-full text-sm font-medium">
                {user.religion}
              </span>
            </div>

            <div>
              <p className="text-sm text-slate-gray mb-2">Spoken Languages</p>
              <div className="flex flex-wrap gap-2">
                {user.spokenLanguages?.map((language) => (
                  <span
                    key={language}
                    className="bg-sun-gold/20 text-deep-navy px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-gray mb-1">Marital Intent</p>
              <span className="bg-heart-red/20 text-heart-red px-3 py-1 rounded-full text-sm font-medium capitalize">
                {user.maritalIntent}
              </span>
            </div>
          </div>
        </motion.div>

        {/* About Me */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">About Me</h2>
          {user.bio ? (
            <p className="text-slate-gray leading-relaxed">{user.bio}</p>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-gray mb-4">No bio added yet</p>
              <Link to="/profile/edit" className="btn-outline">
                Add Bio
              </Link>
            </div>
          )}
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">Partner Preferences</h2>

          {user.preferences ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-gray mb-2">Preferred Gender</p>
                <p className="font-medium text-deep-navy capitalize">{user.preferences.preferredGender}</p>
              </div>

              <div>
                <p className="text-sm text-slate-gray mb-2">Age Range</p>
                <p className="font-medium text-deep-navy">
                  {user.preferences.ageRange?.min} - {user.preferences.ageRange?.max} years
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-gray mb-2">Preferred Religion</p>
                <p className="font-medium text-deep-navy">{user.preferences.preferredReligion || "Any"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-gray mb-2">Preferred Tribes</p>
                <div className="flex flex-wrap gap-2">
                  {user.preferences.preferredTribes?.length > 0 ? (
                    user.preferences.preferredTribes.map((tribe) => (
                      <span
                        key={tribe}
                        className="bg-sky-blue/20 text-sky-blue px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tribe}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-gray">Any tribe</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-gray mb-4">No preferences set</p>
              <Link to="/profile/edit" className="btn-outline">
                Set Preferences
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal (only for own profile) */}
      {isOwnProfile && showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-deep-navy mb-2">Delete Account</h3>
              <p className="text-slate-gray mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be
                permanently removed.
              </p>
              <div className="flex space-x-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 btn-outline">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {deleteUserMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Profile
