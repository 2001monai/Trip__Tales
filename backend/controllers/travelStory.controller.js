import { fileURLToPath } from "url"
import TravelStory from "../models/travelStory.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import path from "path"
import fs from "fs"

export const addTravelStory = async (req, res, next) => {
  const { title, story, visitedLocation, imageUrl, videoUrl, visitedDate, mood, theme, entryType, journalType, structuredData } = req.body

  const userId = req.user.id

  //   validate required field
  if (!title || !story || !visitedDate) {
    return next(errorHandler(400, "Title, story, and visited date are required"))
  }

  // Validate visitedLocation is array if entryType is travel
  if (entryType === "travel" && (!Array.isArray(visitedLocation) || visitedLocation.length === 0)) {
    return next(errorHandler(400, "Please add at least one visited location"))
  }

  //   convert visited date from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate))

  try {
    const placeholderImageUrl = `http://localhost:3000/assets/placeholderImage.png`

    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation: visitedLocation || [],
      userId,
      imageUrl: imageUrl || placeholderImageUrl,
      videoUrl: videoUrl || null,
      visitedDate: parsedVisitedDate,
      mood: mood || "happy",
      theme: theme || "forest",
      entryType: entryType || "travel",
      journalType: journalType || null,
      structuredData: structuredData || {},
    })

    await travelStory.save()

    // Update user gamification
    const user = await User.findById(userId)
    if (!user) {
      return next(errorHandler(404, "User not found"))
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Initialize gamification fields if they don't exist
    if (!user.streak) user.streak = 0
    if (!user.points) user.points = 0
    if (!user.level) user.level = 1
    if (!user.badges) user.badges = []
    if (!user.lastActivityDate) user.lastActivityDate = null

    let newStreak = 1
    if (user.lastActivityDate) {
      const lastDate = new Date(user.lastActivityDate)
      lastDate.setHours(0, 0, 0, 0)
      const diffTime = today - lastDate
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      if (diffDays === 1) {
        newStreak = user.streak + 1
      } else if (diffDays > 1) {
        newStreak = 1
      } else {
        newStreak = user.streak
      }
    }

    user.streak = newStreak
    user.lastActivityDate = today
    user.points += 10

    // Update level
    user.level = Math.floor(user.points / 100) + 1

    // Check for badges
    const badges = [...(user.badges || [])]
    if (newStreak >= 7 && !badges.includes("Week Warrior")) {
      badges.push("Week Warrior")
    }
    if (newStreak >= 30 && !badges.includes("Month Master")) {
      badges.push("Month Master")
    }
    if (user.points >= 100 && !badges.includes("Century Scribe")) {
      badges.push("Century Scribe")
    }
    if (user.level >= 5 && !badges.includes("Level Up Legend")) {
      badges.push("Level Up Legend")
    }

    user.badges = badges

    await user.save()

    res.status(201).json({
      story: travelStory,
      message: "Your entry is added successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const getAllTravelStory = async (req, res, next) => {
  const userId = req.user.id

  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({
      isFavorite: -1,
    })

    res.status(200).json({ stories: travelStories })
  } catch (error) {
    next(error)
  }
}

export const imageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No image uploaded"))
    }

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`

    res.status(201).json({ imageUrl })
  } catch (error) {
    next(error)
  }
}

export const videoUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No video uploaded"))
    }

    const videoUrl = `http://localhost:3000/uploads/${req.file.filename}`

    res.status(201).json({ videoUrl })
  } catch (error) {
    next(error)
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.join(__dirname, "..")

export const deleteImage = async (req, res, next) => {
  const { imageUrl } = req.query

  if (!imageUrl) {
    return next(errorHandler(400, "imageUrl parameter is required!"))
  }

  try {
    // extract the file name from the imageUrl
    const filename = path.basename(imageUrl)

    // Delete the file path
    const filePath = path.join(rootDir, "uploads", filename)

    console.log(filePath)

    // check if the file exists
    if (!fs.existsSync(filePath)) {
      return next(errorHandler(404, "Image not found!"))
    }

    // delete the file
    await fs.promises.unlink(filePath)

    res.status(200).json({ message: "Image deleted successfully!" })
  } catch (error) {
    next(error)
  }
}

export const editTravelStory = async (req, res, next) => {
  const { id } = req.params
  const { title, story, visitedLocation, imageUrl, videoUrl, visitedDate, mood, theme, entryType, journalType, structuredData } = req.body
  const userId = req.user.id

  // validate required field
  if (!title || !story || !visitedDate) {
    return next(errorHandler(400, "Title, story, and visited date are required"))
  }

  // Validate visitedLocation is array if entryType is travel
  if (entryType === "travel" && (!Array.isArray(visitedLocation) || visitedLocation.length === 0)) {
    return next(errorHandler(400, "Please add at least one visited location"))
  }

  //   convert visited date from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate))

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      next(errorHandler(404, "Entry not found!"))
    }

    const placeholderImageUrl = `http://localhost:3000/assets/placeholderImage.png`

    travelStory.title = title
    travelStory.story = story
    travelStory.visitedLocation = visitedLocation || []
    travelStory.imageUrl = imageUrl || placeholderImageUrl
    travelStory.videoUrl = videoUrl || null
    travelStory.visitedDate = parsedVisitedDate
    travelStory.mood = mood || "happy"
    travelStory.theme = theme || "forest"
    travelStory.entryType = entryType || "travel"
    travelStory.journalType = journalType || null
    travelStory.structuredData = structuredData || {}

    await travelStory.save()

    res.status(200).json({
      story: travelStory,
      message: "Entry updated successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const deleteTravelStory = async (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      next(errorHandler(404, "Travel Story not found!"))
    }

    // delete travel story from the database
    await travelStory.deleteOne({ _id: id, userId: userId })

    // Check if the image is not a placeholder before deleting
    const placeholderImageUrl = `http://localhost:3000/assets/placeholderImage.png`

    // Extract the filename from the imageUrl
    const imageUrl = travelStory.imageUrl

    if (imageUrl && imageUrl !== placeholderImageUrl) {
      // Extract the filename from the image url
      const filename = path.basename(imageUrl)
      const filePath = path.join(rootDir, "uploads", filename)

      // Check if the file exists before deleting
      if (file.existsSync(filePath)) {
        // delete the file
        await fs.promises.unlink(filePath) // delete the file asynchronously
      }
    }

    res.status(200).json({ message: "Travel story deleted successfully!" })
  } catch (error) {
    next(error)
  }
}

export const updateIsFavourite = async (req, res, next) => {
  const { id } = req.params
  const { isFavorite } = req.body
  const userId = req.user.id

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId })

    if (!travelStory) {
      return next(errorHandler(404, "Travel story not found!"))
    }

    travelStory.isFavorite = isFavorite

    await travelStory.save()

    res
      .status(200)
      .json({ story: travelStory, message: "Updated successfully!" })
  } catch (error) {
    next(error)
  }
}

export const searchTravelStory = async (req, res, next) => {
  const { query } = req.query
  const userId = req.user.id

  if (!query) {
    return next(errorHandler(404, "Query is required!"))
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavorite: -1 })

    res.status(200).json({
      stories: searchResults,
    })
  } catch (error) {
    next(error)
  }
}

export const filterTravelStories = async (req, res, next) => {
  const { startDate, endDate } = req.query
  const userId = req.user.id

  try {
    const start = new Date(parseInt(startDate))
    const end = new Date(parseInt(endDate))

    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavorite: -1 })

    res.status(200).json({ stories: filteredStories })
  } catch (error) {
    next(error)
  }
}

export const getMoodStats = async (req, res, next) => {
  try {
    const userId = req.user.id

    if (!userId) {
      return next(errorHandler(401, "User not authenticated"))
    }

    const allStories = await TravelStory.find({ userId: userId })

    // Calculate mood counts
    const moodCounts = {
      happy: 0,
      sad: 0,
      excited: 0,
      peaceful: 0,
      adventurous: 0,
      nostalgic: 0,
    }

    allStories.forEach((story) => {
      const mood = story.mood || "happy"
      if (moodCounts.hasOwnProperty(mood)) {
        moodCounts[mood]++
      }
    })

    // Get weekly mood data (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const weeklyStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: sevenDaysAgo },
    }).sort({ visitedDate: 1 })

    // Group by date for weekly chart
    const weeklyMoodData = {}
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split("T")[0]
      const dayLabel = days[date.getDay()]

      weeklyMoodData[dateKey] = {
        date: dayLabel,
        happy: 0,
        sad: 0,
        excited: 0,
        peaceful: 0,
        adventurous: 0,
        nostalgic: 0,
      }
    }

    weeklyStories.forEach((story) => {
      const dateKey = story.visitedDate.toISOString().split("T")[0]
      const mood = story.mood || "happy"

      if (weeklyMoodData[dateKey]) {
        weeklyMoodData[dateKey][mood]++
      }
    })

    const weeklyData = Object.values(weeklyMoodData)

    // Get most common mood
    let mostCommonMood = "happy"
    let maxCount = 0

    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostCommonMood = mood
      }
    })

    // Calculate emotional insights
    const totalStories = allStories.length
    const positiveCount = moodCounts.happy + moodCounts.excited + moodCounts.adventurous
    const peacefulCount = moodCounts.peaceful
    const negativeCount = moodCounts.sad

    const insights = {
      totalStories,
      positivePercentage:
        totalStories > 0 ? Math.round((positiveCount / totalStories) * 100) : 0,
      peacefulPercentage:
        totalStories > 0 ? Math.round((peacefulCount / totalStories) * 100) : 0,
      negativePercentage:
        totalStories > 0 ? Math.round((negativeCount / totalStories) * 100) : 0,
    }

    res.status(200).json({
      moodCounts,
      weeklyData,
      mostCommonMood,
      insights,
    })
  } catch (error) {
    next(error)
  }
}
