import { motion } from "framer-motion"

function LoadingSpinner({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className={`${sizeClasses[size]} border-2 border-heart-red border-t-transparent rounded-full`}
      />
      {text && <p className="text-slate-gray text-sm">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
