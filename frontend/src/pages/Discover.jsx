"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Search, Filter, X, RefreshCw, Users } from "lucide-react"
import { usersAPI } from "../api/users"
import { matchesAPI } from "../api/matches"
import UserCard from "../components/UserCard"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]

const tribes = [
  "Yoruba",
  "Igbo",
  "Hausa",
  "Fulani",
  "Ijaw",
  "Kanuri",
  "Ibibio",
  "Tiv",
  "Edo",
  "Nupe",
  "Urhobo",
  "Igala",
  "Idoma",
  "Efik",
  "Jukun",
  "Gbagyi",
  "Esan",
  "Itsekiri",
  "Ogoni",
  "Other",
]

const religions = ["Christianity", "Islam", "Traditional", "Other"]

function Discover() {
  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    tribe: "",
    state: "",
    minAge: "",
    maxAge: "",
    page: 1,
    limit: 12,
  })
  const [resetCounter, setResetCounter] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Fetch users with filters
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", filters, resetCounter],
    queryFn: () => usersAPI.getUsers(filters),
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }))
  }

  const clearFilters = () => {
    setFilters({
      gender: "",
      religion: "",
      tribe: "",
      state: "",
      minAge: "",
      maxAge: "",
      page: 1,
      limit: 12,
    })
    setResetCounter((c) => c + 1)
  }

  const handleSendRequest = (userId) => {
    sendRequestMutation.mutate(userId)
  }

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`)
  }

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-deep-navy mb-2">Discover People</h1>
            <p className="text-slate-gray">Find your perfect match from thousands of verified profiles</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <button onClick={() => refetch()} className="btn-secondary flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-deep-navy">Filter Results</h2>
            <button
              onClick={clearFilters}
              className="text-heart-red hover:text-red-600 font-medium flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                className="input-field"
              >
                <option value="">Any gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">Religion</label>
              <select
                value={filters.religion}
                onChange={(e) => handleFilterChange("religion", e.target.value)}
                className="input-field"
              >
                <option value="">Any religion</option>
                {religions.map((religion) => (
                  <option key={religion} value={religion}>
                    {religion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">Tribe</label>
              <select
                value={filters.tribe}
                onChange={(e) => handleFilterChange("tribe", e.target.value)}
                className="input-field"
              >
                <option value="">Any tribe</option>
                {tribes.map((tribe) => (
                  <option key={tribe} value={tribe}>
                    {tribe}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">State</label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange("state", e.target.value)}
                className="input-field"
              >
                <option value="">Any state</option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">Min Age</label>
              <input
                type="number"
                value={filters.minAge}
                onChange={(e) => handleFilterChange("minAge", e.target.value)}
                className="input-field"
                placeholder="18"
                min="18"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">Max Age</label>
              <input
                type="number"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange("maxAge", e.target.value)}
                className="input-field"
                placeholder="50"
                min="18"
                max="100"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Finding amazing people for you..." />
          </div>
        ) : usersData?.results?.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-gray">
                Showing {usersData.results.length} of {usersData.total} results
              </p>
              <div className="flex items-center space-x-2 text-sm text-slate-gray">
                <Users className="h-4 w-4" />
                <span>
                  Page {usersData.page} of {usersData.totalPages}
                </span>
              </div>
            </div>

            {/* User Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {usersData.results.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <UserCard user={user} onSendRequest={handleSendRequest} onViewProfile={handleViewProfile} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {usersData.totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, usersData.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filters.page === page ? "bg-heart-red text-white" : "bg-white text-slate-gray hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === usersData.totalPages}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-gray mb-2">No results found</h3>
            <p className="text-slate-gray mb-4">Try adjusting your filters or search criteria to find more people</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Discover
