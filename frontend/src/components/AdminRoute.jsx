import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
