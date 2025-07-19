import React from "react"
import { authAPI } from "../api/auth"
import toast from "react-hot-toast"

const AuthContext = React.createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_USER":
      return { ...state, user: action.payload, loading: false, error: null }
    case "SET_TOKEN":
      return { ...state, token: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = React.useReducer(authReducer, initialState)

  React.useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const user = await authAPI.getCurrentUser()
          dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
          localStorage.removeItem("token")
          dispatch({ type: "LOGOUT" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const { token } = await authAPI.login(credentials)
      localStorage.setItem("token", token)
      dispatch({ type: "SET_TOKEN", payload: token })

      const user = await authAPI.getCurrentUser()
      dispatch({ type: "SET_USER", payload: user })

      toast.success("Welcome back to HeartSync!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const { token } = await authAPI.register(userData)
      localStorage.setItem("token", token)
      dispatch({ type: "SET_TOKEN", payload: token })

      const user = await authAPI.getCurrentUser()
      dispatch({ type: "SET_USER", payload: user })

      toast.success("Welcome to HeartSync! Your journey begins now.")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    dispatch({ type: "LOGOUT" })
    toast.success("Logged out successfully")
  }

  const updateUser = (userData) => {
    dispatch({ type: "SET_USER", payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
