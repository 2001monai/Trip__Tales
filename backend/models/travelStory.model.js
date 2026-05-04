import mongoose, { Schema } from "mongoose"

const travelStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    story: {
      type: String,
      required: true,
    },

    visitedLocation: {
      type: [String],
      default: [],
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      default: null,
    },

    visitedDate: {
      type: Date,
      required: true,
    },

    mood: {
      type: String,
      enum: ["happy", "sad", "excited", "peaceful", "adventurous", "nostalgic"],
      default: "happy",
    },

    // Journal fields
    entryType: {
      type: String,
      enum: ["travel", "journal"],
      default: "travel",
    },

    journalType: {
      type: String,
      enum: ["gratitude", "daily-reflection", "goal-tracking", "travel-journal", "dream-journal"],
      default: null,
    },

    structuredData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    theme: {
      type: String,
      enum: ["forest", "greece", "desert", "ocean", "mountain", "urban", "tropical"],
      default: "forest",
    },
  },
  { timestamps: true }
)

const TravelStory = mongoose.model("TravelStory", travelStorySchema)

export default TravelStory
