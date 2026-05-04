import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Gamification fields
    streak: {
      type: Number,
      default: 0,
    },

    lastActivityDate: {
      type: Date,
      default: null,
    },

    badges: {
      type: [String],
      default: [],
    },

    points: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    profilePictureUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
