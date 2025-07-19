import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Home, ArrowLeft, Heart } from "lucide-react"

function NotFound() {
  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl font-bold text-heart-red mb-4">404</div>
          <div className="flex justify-center space-x-2 mb-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
            >
              <Heart className="h-8 w-8 text-heart-red" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
            >
              <Heart className="h-8 w-8 text-sky-blue" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
            >
              <Heart className="h-8 w-8 text-mint-green" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h1 className="text-3xl font-bold text-deep-navy mb-4">Page Not Found</h1>
          <p className="text-slate-gray mb-8 leading-relaxed">
            Oops! It looks like this page has found its perfect match... somewhere else. Don't worry, your love story is
            still waiting to be written!
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="btn-primary flex items-center justify-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Go Home</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => window.history.back()}
                className="btn-outline flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Fun Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-4 bg-heart-red/10 rounded-lg"
        >
          <p className="text-sm text-heart-red font-medium">
            💡 Pro tip: While you're here, why not check out some amazing profiles on HeartSync?
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound
