const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  preferredGender: { type: String, enum: ['male', 'female'], required: true },
  preferredReligion: { type: String },
  preferredTribes: [{ type: String }],
  ageRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  dob: { type: Date, required: true },
  tribe: { type: String, required: true },
  religion: { type: String, required: true },
  state: { type: String, required: true },
  spokenLanguages: [{ type: String, required: true }],
  maritalIntent: { type: String, required: true },
  education: { type: String },
  employmentStatus: { type: String },
  bio: { type: String, maxlength: 500 },
  preferences: { type: preferencesSchema, required: true },
  isVerified: { type: Boolean, default: false },
  profilePhoto: { type: String },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileViews: { type: Number, default: 0 },
  connectionRate: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema); 