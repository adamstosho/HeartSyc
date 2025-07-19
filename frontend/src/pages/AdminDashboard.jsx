import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Users, Ban, Flag, CheckCircle, Search, MoreVertical } from "lucide-react"
import { adminAPI } from "../api/admin"
import LoadingSpinner from "../components/LoadingSpinner"
import { calculateAge, formatDate } from "../utils/helpers"
import toast from "react-hot-toast"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const queryClient = useQueryClient()

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminAPI.getAllUsers,
  })

  // Fetch reports
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: adminAPI.getReports,
  })

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminAPI.getStats,
  })

  // Invalidate stats after user/report actions
  const invalidateStats = () => {
    queryClient.invalidateQueries(["admin-stats"])
  }

  // Verify user mutation
  const verifyUserMutation = useMutation({
    mutationFn: adminAPI.verifyUser,
    onSuccess: () => {
      toast.success("User verified successfully")
      queryClient.invalidateQueries(["admin-users"])
      invalidateStats()
      setShowUserModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to verify user")
    },
  })

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: adminAPI.banUser,
    onSuccess: () => {
      toast.success("User banned successfully")
      queryClient.invalidateQueries(["admin-users"])
      invalidateStats()
      setShowUserModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to ban user")
    },
  })

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: adminAPI.unbanUser,
    onSuccess: () => {
      toast.success("User unbanned successfully")
      queryClient.invalidateQueries(["admin-users"])
      invalidateStats()
      setShowUserModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to unban user")
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: adminAPI.deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully")
      queryClient.invalidateQueries(["admin-users"])
      invalidateStats()
      setShowUserModal(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user")
    },
  })

  const filteredUsers =
    users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "reports", label: "Reports", icon: Flag },
  ]

  const handleVerifyUser = (userId) => {
    verifyUserMutation.mutate(userId)
  }

  const handleBanUser = (userId) => {
    banUserMutation.mutate(userId)
  }

  const handleUnbanUser = (userId) => {
    unbanUserMutation.mutate(userId)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(userId)
    }
  }

  const openUserModal = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const openReportModal = (report) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const renderUsers = () => (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            placeholder="Search users by name or email..."
          />
        </div>
      </div>

      {/* Users Table */}
      {usersLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading users..." />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto || "/placeholder.svg"}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-mint-green">
                              <span className="text-sm font-bold text-deep-navy">{user.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-deep-navy">{user.name}</div>
                          <div className="text-sm text-slate-gray">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-deep-navy">
                        {calculateAge(user.dob)} years • {user.gender}
                      </div>
                      <div className="text-sm text-slate-gray">
                        {user.state} • {user.tribe} • {user.religion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isVerified ? "bg-mint-green text-deep-navy" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                        {user.isBanned && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Banned
                          </span>
                        )}
                        {user.role === "admin" && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-sky-blue text-white">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-gray">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openUserModal(user)} className="text-heart-red hover:text-red-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )

  const renderReports = () => (
    <div>
      {reportsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading reports..." />
        </div>
      ) : reports?.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div key={index} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Flag className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-deep-navy">User Report</h3>
                    <p className="text-sm text-slate-gray mt-1">{report.reason}</p>
                    <p className="text-xs text-slate-gray mt-2">Reported on {new Date(report.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-gray mt-2">Reporter: {report.reporter?.name || 'Unknown'} ({report.reporter?.email || ''})</p>
                    <p className="text-xs text-slate-gray mt-2">Reported User: {report.reported?.name || 'Unknown'} ({report.reported?.email || ''})</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-lg" onClick={() => openReportModal(report)}>
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Flag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-gray mb-2">No reports</h3>
          <p className="text-slate-gray">All user reports will appear here</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-deep-navy mb-2">Admin Dashboard</h1>
        <p className="text-slate-gray">Manage users, verify profiles, and handle reports</p>
      </motion.div>

      {/* Stats */}
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
            title: "Total Users",
              value: stats?.totalUsers || 0,
            icon: Users,
            color: "bg-sky-blue",
          },
          {
            title: "Verified Users",
              value: stats?.verifiedUsers || 0,
            icon: CheckCircle,
            color: "bg-mint-green",
          },
          {
            title: "Banned Users",
              value: stats?.bannedUsers || 0,
            icon: Ban,
            color: "bg-red-500",
          },
          {
            title: "Total Reports",
              value: stats?.totalReports || 0,
            icon: Flag,
            color: "bg-sun-gold",
          },
            {
              title: "Recent Signups (7d)",
              value: stats?.recentUsers || 0,
              icon: Users,
              color: "bg-purple-500",
            },
            {
              title: "Total Admins",
              value: stats?.totalAdmins || 0,
              icon: Users,
              color: "bg-blue-900",
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
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
          ))
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {activeTab === "users" && renderUsers()}
        {activeTab === "reports" && renderReports()}
      </motion.div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
                {selectedUser.profilePhoto ? (
                  <img
                    src={selectedUser.profilePhoto || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-mint-green">
                    <span className="text-2xl font-bold text-deep-navy">{selectedUser.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-deep-navy mb-1">{selectedUser.name}</h3>
              <p className="text-slate-gray">{selectedUser.email}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-gray">Age:</span>
                  <span className="ml-2 font-medium">{calculateAge(selectedUser.dob)}</span>
                </div>
                <div>
                  <span className="text-slate-gray">Gender:</span>
                  <span className="ml-2 font-medium capitalize">{selectedUser.gender}</span>
                </div>
                <div>
                  <span className="text-slate-gray">State:</span>
                  <span className="ml-2 font-medium">{selectedUser.state}</span>
                </div>
                <div>
                  <span className="text-slate-gray">Tribe:</span>
                  <span className="ml-2 font-medium">{selectedUser.tribe}</span>
                </div>
                <div>
                  <span className="text-slate-gray">Religion:</span>
                  <span className="ml-2 font-medium">{selectedUser.religion}</span>
                </div>
                <div>
                  <span className="text-slate-gray">Joined:</span>
                  <span className="ml-2 font-medium">{formatDate(selectedUser.createdAt)}</span>
                </div>
              </div>

              {selectedUser.bio && (
                <div>
                  <span className="text-slate-gray text-sm">Bio:</span>
                  <p className="mt-1 text-sm">{selectedUser.bio}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setShowUserModal(false)} className="flex-1 btn-outline">
                Close
              </button>

              {!selectedUser.isVerified && !selectedUser.isBanned && (
                <button
                  onClick={() => handleVerifyUser(selectedUser._id)}
                  disabled={verifyUserMutation.isPending}
                  className="flex-1 bg-mint-green hover:bg-green-500 text-deep-navy font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {verifyUserMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Verify</span>
                    </>
                  )}
                </button>
              )}

              {!selectedUser.isBanned && (
                <button
                  onClick={() => handleBanUser(selectedUser._id)}
                  disabled={banUserMutation.isPending}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {banUserMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Ban className="h-4 w-4" />
                      <span>Ban</span>
                    </>
                  )}
                </button>
              )}

              {selectedUser.isBanned && (
                <button
                  onClick={() => handleUnbanUser(selectedUser._id)}
                  disabled={unbanUserMutation.isPending}
                  className="flex-1 bg-mint-green hover:bg-green-500 text-deep-navy font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {unbanUserMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Unban</span>
                    </>
                  )}
                </button>
              )}

              {selectedUser.role !== "admin" && (
                <button
                  onClick={() => handleDeleteUser(selectedUser._id)}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 bg-gray-800 hover:bg-black text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {deleteUserMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Ban className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center mb-6">
              <Flag className="h-10 w-10 text-red-600 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-deep-navy mb-1">User Report</h3>
              <p className="text-slate-gray mb-2">{selectedReport.reason}</p>
              <p className="text-xs text-slate-gray mb-2">Reported on {new Date(selectedReport.createdAt).toLocaleDateString()}</p>
              <div className="mb-2">
                <span className="font-semibold text-slate-gray">Reporter:</span> {selectedReport.reporter?.name || 'Unknown'} ({selectedReport.reporter?.email || ''})
              </div>
              <div className="mb-2">
                <span className="font-semibold text-slate-gray">Reported User:</span> {selectedReport.reported?.name || 'Unknown'} ({selectedReport.reported?.email || ''})
              </div>
            </div>
            {/* Actions for reported user */}
            <div className="flex flex-col space-y-2 mb-4">
              {!selectedReport.reported?.isBanned && (
                <button
                  onClick={() => handleBanUser(selectedReport.reported._id)}
                  disabled={banUserMutation.isPending}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {banUserMutation.isPending ? <LoadingSpinner size="sm" /> : <><Ban className="h-4 w-4" /><span>Ban</span></>}
                </button>
              )}
              {selectedReport.reported?.role !== "admin" && (
                <button
                  onClick={() => handleDeleteUser(selectedReport.reported._id)}
                  disabled={deleteUserMutation.isPending}
                  className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {deleteUserMutation.isPending ? <LoadingSpinner size="sm" /> : <><Ban className="h-4 w-4" /><span>Delete</span></>}
                </button>
              )}
            </div>
            <button onClick={() => setShowReportModal(false)} className="w-full btn-outline mt-2">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
