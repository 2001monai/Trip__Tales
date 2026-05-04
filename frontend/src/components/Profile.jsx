import React, { useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getInitials } from "../utils/helper"
import { updateUser } from "../redux/slice/userSlice"
import axiosInstance from "../utils/axiosInstance"

const Profile = ({ onLogout }) => {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("profilePicture", file)

      console.log("Uploading file:", file.name, file.size, file.type)

      const response = await axiosInstance.post("/user/upload-profile-picture", formData)

      console.log("Upload response:", response.data)

      if (response.data.user) {
        dispatch(updateUser(response.data.user))
        alert("Profile picture updated successfully!")
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      console.error("Error response:", error.response)
      const errorMsg = error.response?.data?.message || error.message || "Failed to upload profile picture"
      alert(errorMsg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="profile-picture-container">
        {currentUser?.profilePictureUrl ? (
          <>
            <img
              src={currentUser.profilePictureUrl}
              alt={currentUser?.username}
              className="profile-picture"
              style={{ borderColor: "rgba(100, 116, 139, 0.5)" }}
              onClick={handleProfilePictureClick}
              title="Click to change profile picture"
            />
          </>
        ) : (
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 cursor-pointer hover:bg-slate-200 transition"
            onClick={handleProfilePictureClick}
            title="Click to add profile picture"
          >
            {getInitials(currentUser?.username)}
          </div>
        )}
        <button
          className="profile-picture-upload"
          onClick={handleProfilePictureClick}
          disabled={uploading}
          title="Upload profile picture"
        >
          {uploading ? "..." : "📷"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden-file-input"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      <div>
        <p className="text-lg font-medium">{currentUser.username || ""}</p>
        <div className="text-sm text-slate-600">
          <p>Level: {currentUser.level || 1} | Points: {currentUser.points || 0}</p>
          <p>Streak: {currentUser.streak || 0} 🔥</p>
          {currentUser.badges && currentUser.badges.length > 0 && (
            <p>Badges: {currentUser.badges.join(", ")}</p>
          )}
        </div>
        <button className="text-sm text-red-600 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile

