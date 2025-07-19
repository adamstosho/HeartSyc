import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Heart, User, Mail, Lock, Eye, EyeOff, Calendar, MapPin } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"

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

const languages = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Fulfulde",
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
  "Other",
]

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { register: registerUser, loading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
  } = useForm()

  const watchedValues = watch()

  const nextStep = async () => {
    const fieldsToValidate =
      currentStep === 1
        ? ["name", "email", "password", "gender", "dob"]
        : ["tribe", "religion", "state", "spokenLanguages", "maritalIntent"]

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const onSubmit = async (data) => {
    // Format the data according to API requirements
    const formattedData = {
      ...data,
      preferences: {
        preferredGender: data.preferredGender,
        preferredReligion: data.preferredReligion,
        preferredTribes: data.preferredTribes || [],
        ageRange: {
          min: Number.parseInt(data.minAge) || 18,
          max: Number.parseInt(data.maxAge) || 50,
        },
      },
    }

    // Remove preference fields from root level
    delete formattedData.preferredGender
    delete formattedData.preferredReligion
    delete formattedData.preferredTribes
    delete formattedData.minAge
    delete formattedData.maxAge

    const result = await registerUser(formattedData)
    if (result.success) {
      navigate("/dashboard")
    } else {
      setError("root", { message: result.error })
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-deep-navy">Basic Information</h3>
        <p className="text-sm text-slate-gray">Tell us about yourself</p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            className="input-field pl-10"
            placeholder="Enter your full name"
          />
        </div>
        {errors.name && <p className="mt-1 text-sm text-heart-red">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            className="input-field pl-10"
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-heart-red">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            className="input-field pl-10 pr-10"
            placeholder="Create a password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-heart-red">{errors.password.message}</p>}
      </div>

      {/* Gender and DOB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-gray mb-2">Gender</label>
          <select {...register("gender", { required: "Gender is required" })} className="input-field">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-heart-red">{errors.gender.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-gray mb-2">Date of Birth</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("dob", { required: "Date of birth is required" })}
              type="date"
              className="input-field pl-10"
              max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </div>
          {errors.dob && <p className="mt-1 text-sm text-heart-red">{errors.dob.message}</p>}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-deep-navy">Cultural Background</h3>
        <p className="text-sm text-slate-gray">Help us understand your heritage</p>
      </div>

      {/* Tribe and Religion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-gray mb-2">Tribe</label>
          <select {...register("tribe", { required: "Tribe is required" })} className="input-field">
            <option value="">Select your tribe</option>
            {tribes.map((tribe) => (
              <option key={tribe} value={tribe}>
                {tribe}
              </option>
            ))}
          </select>
          {errors.tribe && <p className="mt-1 text-sm text-heart-red">{errors.tribe.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-gray mb-2">Religion</label>
          <select {...register("religion", { required: "Religion is required" })} className="input-field">
            <option value="">Select your religion</option>
            {religions.map((religion) => (
              <option key={religion} value={religion}>
                {religion}
              </option>
            ))}
          </select>
          {errors.religion && <p className="mt-1 text-sm text-heart-red">{errors.religion.message}</p>}
        </div>
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">State of Origin</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <select {...register("state", { required: "State is required" })} className="input-field pl-10">
            <option value="">Select your state</option>
            {nigerianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        {errors.state && <p className="mt-1 text-sm text-heart-red">{errors.state.message}</p>}
      </div>

      {/* Spoken Languages */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">Spoken Languages</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-light-gray rounded-lg p-3">
          {languages.map((language) => (
            <label key={language} className="flex items-center space-x-2">
              <input
                {...register("spokenLanguages", { required: "Select at least one language" })}
                type="checkbox"
                value={language}
                className="rounded border-gray-300 text-heart-red focus:ring-heart-red"
              />
              <span className="text-sm text-slate-gray">{language}</span>
            </label>
          ))}
        </div>
        {errors.spokenLanguages && <p className="mt-1 text-sm text-heart-red">{errors.spokenLanguages.message}</p>}
      </div>

      {/* Marital Intent */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">Marital Intent</label>
        <select {...register("maritalIntent", { required: "Marital intent is required" })} className="input-field">
          <option value="">What are you looking for?</option>
          <option value="marriage">Marriage</option>
          <option value="serious relationship">Serious Relationship</option>
          <option value="friendship">Friendship First</option>
        </select>
        {errors.maritalIntent && <p className="mt-1 text-sm text-heart-red">{errors.maritalIntent.message}</p>}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-deep-navy">Additional Information</h3>
        <p className="text-sm text-slate-gray">Optional but helps with better matches</p>
      </div>

      {/* Education and Employment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-gray mb-2">Education Level</label>
          <select {...register("education")} className="input-field">
            <option value="">Select education level</option>
            <option value="Secondary School">Secondary School</option>
            <option value="OND">OND</option>
            <option value="HND">HND</option>
            <option value="BSc">Bachelor's Degree</option>
            <option value="MSc">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-gray mb-2">Employment Status</label>
          <select {...register("employmentStatus")} className="input-field">
            <option value="">Select employment status</option>
            <option value="Employed">Employed</option>
            <option value="Self-employed">Self-employed</option>
            <option value="Student">Student</option>
            <option value="Unemployed">Unemployed</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">About You</label>
        <textarea
          {...register("bio")}
          rows={4}
          className="input-field resize-none"
          placeholder="Tell us about yourself, your interests, and what makes you unique..."
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-deep-navy">Partner Preferences</h3>
        <p className="text-sm text-slate-gray">Help us find your perfect match</p>
      </div>

      {/* Preferred Gender and Religion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-gray mb-2">Preferred Gender</label>
          <select
            {...register("preferredGender", { required: "Preferred gender is required" })}
            className="input-field"
          >
            <option value="">Select preferred gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.preferredGender && <p className="mt-1 text-sm text-heart-red">{errors.preferredGender.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-gray mb-2">Preferred Religion</label>
          <select {...register("preferredReligion")} className="input-field">
            <option value="">Any religion</option>
            {religions.map((religion) => (
              <option key={religion} value={religion}>
                {religion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">Preferred Age Range</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              {...register("minAge", {
                required: "Minimum age is required",
                min: { value: 18, message: "Minimum age must be 18" },
                max: { value: 100, message: "Invalid age" },
              })}
              type="number"
              className="input-field"
              placeholder="Min age"
              min="18"
              max="100"
            />
            {errors.minAge && <p className="mt-1 text-sm text-heart-red">{errors.minAge.message}</p>}
          </div>
          <div>
            <input
              {...register("maxAge", {
                required: "Maximum age is required",
                min: { value: 18, message: "Maximum age must be at least 18" },
                max: { value: 100, message: "Invalid age" },
              })}
              type="number"
              className="input-field"
              placeholder="Max age"
              min="18"
              max="100"
            />
            {errors.maxAge && <p className="mt-1 text-sm text-heart-red">{errors.maxAge.message}</p>}
          </div>
        </div>
      </div>

      {/* Preferred Tribes */}
      <div>
        <label className="block text-sm font-medium text-slate-gray mb-2">Preferred Tribes (Optional)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-light-gray rounded-lg p-3">
          {tribes.map((tribe) => (
            <label key={tribe} className="flex items-center space-x-2">
              <input
                {...register("preferredTribes")}
                type="checkbox"
                value={tribe}
                className="rounded border-gray-300 text-heart-red focus:ring-heart-red"
              />
              <span className="text-sm text-slate-gray">{tribe}</span>
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-gray">Leave empty to match with all tribes</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-heart-red via-sky-blue to-mint-green flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center shadow-lg"
          >
            <Heart className="h-10 w-10 text-heart-red" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-white">Join HeartSync Today</h2>
          <p className="mt-2 text-sm text-white/80">Create your profile and start your journey to finding love</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2">
          <motion.div
            initial={{ width: "25%" }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="bg-white h-2 rounded-full"
          />
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Error Message */}
            {errors.root && (
              <div className="bg-heart-red/10 border border-heart-red/20 rounded-lg p-3 mt-6">
                <p className="text-sm text-heart-red">{errors.root.message}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={prevStep}
                  className="btn-outline"
                >
                  Previous
                </motion.button>
              )}

              {currentStep < 4 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={nextStep}
                  className={`btn-primary ${currentStep === 1 ? "ml-auto" : ""}`}
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 ml-auto"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Heart className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-white/60">
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:underline font-medium">
              Sign in here
            </Link>
          </p>
          <p className="text-xs text-white/40 mt-2">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-white hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-white hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
