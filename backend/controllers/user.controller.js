import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"

export const getUsers = async (req, res, next) => {
  const userId = req.user.id

  const validUser = await User.findOne({ _id: userId })

  if (!validUser) {
    return next(errorHandler(401, "Unauthorized"))
  }

  const { password: pass, ...rest } = validUser._doc

  res.status(200).json(rest)
}

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been loggedout successfully!")
  } catch (error) {
    next(error)
  }
}

export const uploadProfilePicture = async (req, res, next) => {
  try {
    console.log("Upload request received")
    console.log("File received:", req.file)
    console.log("User ID:", req.user?.id)

    const userId = req.user.id

    if (!req.file) {
      console.log("No file in request")
      return next(errorHandler(400, "No file uploaded"))
    }

    const validUser = await User.findOne({ _id: userId })

    if (!validUser) {
      console.log("User not found:", userId)
      return next(errorHandler(401, "Unauthorized"))
    }

    // File path - use full URL
    const profilePictureUrl = `http://localhost:3000/uploads/${req.file.filename}`

    console.log("Saving profile picture URL:", profilePictureUrl)

    // Update user with profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePictureUrl },
      { new: true }
    )

    console.log("User updated successfully")

    const { password: pass, ...rest } = updatedUser._doc

    res.status(200).json({ message: "Profile picture uploaded successfully", user: rest })
  } catch (error) {
    console.error("Upload error:", error)
    next(error)
  }
}

