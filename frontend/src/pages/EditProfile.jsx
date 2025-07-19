import { useState } from "react"
import { motion } from "framer-motion"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { User, Mail, Calendar, MapPin, BookOpen, Briefcase, Camera, Save, ArrowLeft } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { usersAPI } from "../api/users"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"
import axios from "axios"

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

function EditProfile() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || "")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      gender: user?.gender || "",
      dob: user?.dob?.split("T")[0] || "",
      tribe: user?.tribe || "",
      religion: user?.religion || "",
      state: user?.state || "",
      spokenLanguages: user?.spokenLanguages || [],
      maritalIntent: user?.maritalIntent || "",
      education: user?.education || "",
      employmentStatus: user?.employmentStatus || "",
      bio: user?.bio || "",
      preferredGender: user?.preferences?.preferredGender || "",
      preferredReligion: user?.preferences?.preferredReligion || "",
      preferredTribes: user?.preferences?.preferredTribes || [],
      minAge: user?.preferences?.ageRange?.min || 18,
      maxAge: user?.preferences?.ageRange?.max || 50,
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => usersAPI.updateUser(user._id, data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      queryClient.invalidateQueries(["user", user._id])
      toast.success("Profile updated successfully!")
      navigate("/profile")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile")
    },
  })

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const onSubmit = async (data) => {
    // Format the data according to API requirements
    const formattedData = {
      ...data,
      preferences: {
        preferredGender: data.preferredGender,
        preferredReligion: data.preferredReligion,
        preferredTribes: data.preferredTribes,
        ageRange: {
          min: Number.parseInt(data.minAge),
          max: Number.parseInt(data.maxAge),
        },
      },
    }

    // Remove preference fields from root level
    delete formattedData.preferredGender
    delete formattedData.preferredReligion
    delete formattedData.preferredTribes
    delete formattedData.minAge
    delete formattedData.maxAge

    // Handle profile photo upload to Cloudinary
    if (profilePhoto && profilePhoto instanceof File) {
      const formData = new FormData()
      formData.append("file", profilePhoto)
      formData.append("upload_preset", uploadPreset)
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        )
        formattedData.profilePhoto = response.data.secure_url
      } catch (err) {
        toast.error("Failed to upload profile photo. Please try again.")
        return
      }
    } else if (photoPreview) {
      // If no new file, but preview exists (e.g., already set)
      formattedData.profilePhoto = photoPreview
    }

    updateProfileMutation.mutate(formattedData)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-2 text-slate-gray hover:text-deep-navy mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Profile</span>
        </button>
        <h1 className="text-3xl font-bold text-deep-navy">Edit Profile</h1>
        <p className="text-slate-gray">Update your information to get better matches</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">Profile Photo</h2>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {photoPreview ? (
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-mint-green">
                    <span className="text-2xl font-bold text-deep-navy">{user.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-heart-red text-white p-2 rounded-full hover:bg-red-600 transition-colors cursor-pointer">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
            <div>
              <p className="text-sm text-slate-gray mb-2">
                Upload a clear photo of yourself. This helps others recognize you.
              </p>
              <p className="text-xs text-slate-gray">Supported formats: JPG, PNG. Max size: 5MB</p>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">Education Level</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <select {...register("education")} className="input-field pl-10">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">Employment Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select {...register("employmentStatus")} className="input-field pl-10">
                  <option value="">Select employment status</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Student">Student</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cultural Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">Cultural Background</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
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
              {errors.spokenLanguages && (
                <p className="mt-1 text-sm text-heart-red">{errors.spokenLanguages.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-gray mb-2">Marital Intent</label>
              <select
                {...register("maritalIntent", { required: "Marital intent is required" })}
                className="input-field"
              >
                <option value="">What are you looking for?</option>
                <option value="marriage">Marriage</option>
                <option value="serious relationship">Serious Relationship</option>
                <option value="friendship">Friendship First</option>
              </select>
              {errors.maritalIntent && <p className="mt-1 text-sm text-heart-red">{errors.maritalIntent.message}</p>}
            </div>
          </div>
        </motion.div>

        {/* About Me */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">About Me</h2>

          <div>
            <label className="block text-sm font-medium text-slate-gray mb-2">Bio</label>
            <textarea
              {...register("bio")}
              rows={6}
              className="input-field resize-none"
              placeholder="Tell us about yourself, your interests, and what makes you unique..."
            />
            <p className="mt-1 text-xs text-slate-gray">
              A good bio helps others understand who you are and what you're looking for.
            </p>
          </div>
        </motion.div>

        {/* Partner Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-deep-navy mb-6">Partner Preferences</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {errors.preferredGender && (
                <p className="mt-1 text-sm text-heart-red">{errors.preferredGender.message}</p>
              )}
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

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">Minimum Age</label>
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
              <label className="block text-sm font-medium text-slate-gray mb-2">Maximum Age</label>
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

            <div className="md:col-span-2">
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
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end space-x-4"
        >
          <button type="button" onClick={() => navigate("/profile")} className="btn-outline">
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="btn-primary flex items-center space-x-2"
          >
            {updateProfileMutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}

export default EditProfile
