import React, { useState } from "react"
import { IoMdAdd, IoMdClose } from "react-icons/io"
import { MdOutlineDeleteOutline, MdOutlineUpdate } from "react-icons/md"
import DateSelector from "./DateSelector"
import ImageSelector from "./ImageSelector"
import VideoSelector from "./VideoSelector"
import TagInput from "./TagInput"
import MoodSelector from "./MoodSelector"
import { THEMES } from "../utils/themes"
import axiosInstance from "../utils/axiosInstance"
import moment from "moment"
import { toast } from "react-toastify"
import uploadImage from "../utils/uploadImage"
import uploadVideo from "../utils/uploadVideo"

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
  getUser,
  setAllStories,
  allStories,
}) => {
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)
  const [title, setTitle] = useState(storyInfo?.title || "")
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null)
  const [storyVideo, setStoryVideo] = useState(storyInfo?.videoUrl || null)
  const [story, setStory] = useState(storyInfo?.story || "")
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  )
  const [mood, setMood] = useState(storyInfo?.mood || "happy")
  const [theme, setTheme] = useState(storyInfo?.theme || "forest")
  const [entryType, setEntryType] = useState(storyInfo?.entryType || "travel")
  const [journalType, setJournalType] = useState(storyInfo?.journalType || "")
  const [error, setError] = useState("")


  const getStoryPlaceholder = () => {
    if (entryType === "travel") return "Your Story"
    switch (journalType) {
      case "gratitude":
        return "What are you grateful for today? List 3 things..."
      case "daily-reflection":
        return "What happened today? What did you learn? How do you feel?"
      case "goal-tracking":
        return "What goals did you work on? Progress made? Next steps?"
      case "travel-journal":
        return "Describe your travel experiences, places visited, memories..."
      case "dream-journal":
        return "Describe your dream. What happened? How did it make you feel?"
      default:
        return "Your Journal Entry"
    }
  }

  const addNewTravelStory = async () => {
    try {
      let imageUrl = ""
      let videoUrl = ""

      // Upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg)
        imageUrl = imgUploadRes.imageUrl || ""
      }

      // Upload video if present
      if (storyVideo) {
        const vidUploadRes = await uploadVideo(storyVideo)
        videoUrl = vidUploadRes.videoUrl || ""
      }

      const response = await axiosInstance.post("/travel-story/add", {
        title,
        story,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        mood,
        theme,
        entryType,
        journalType: entryType === "journal" ? journalType : null,
      })

      if (response.data && response.data.story) {
        toast.success("Story added successfully!")

        // Update local state instantly
        if (setAllStories && allStories) {
          setAllStories([response.data.story, ...allStories])
        } else {
          getAllTravelStories()
        }
        getUser()

        onClose()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
        toast.error(error.response.data.message)
      } else {
        setError("Something went wrong! Please try again.")
        toast.error("Failed to add story")
      }
      console.log(error)
    }
  }

  const updateTravelStory = async () => {
    const storyId = storyInfo._id

    try {
      let imageUrl = ""
      let videoUrl = ""

      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        videoUrl: storyInfo.videoUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        mood,
        theme,
        entryType,
        journalType: entryType === "journal" ? journalType : null,
      }

      if (typeof storyImg === "object") {
        // Upload new image
        const imageUploadRes = await uploadImage(storyImg)

        imageUrl = imageUploadRes.imageUrl || ""

        postData = {
          ...postData,
          imageUrl: imageUrl,
        }
      }

      if (typeof storyVideo === "object") {
        // Upload new video
        const videoUploadRes = await uploadVideo(storyVideo)

        videoUrl = videoUploadRes.videoUrl || ""

        postData = {
          ...postData,
          videoUrl: videoUrl,
        }
      }

      const response = await axiosInstance.post(
        "/travel-story/edit-story/" + storyId,
        postData
      )

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!")

        // Update local state instantly
        if (setAllStories && allStories) {
          setAllStories(
            allStories.map((story) =>
              story._id === storyId ? response.data.story : story
            )
          )
        } else {
          getAllTravelStories()
        }
        getUser()

        onClose()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong! Please try again.")
      }
    }
  }

  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter the title")
      return
    }

    if (!story) {
      setError("Please enter the story")
      return
    }

    if (entryType === "travel" && (!visitedLocation || visitedLocation.length === 0)) {
      setError("Please add at least one visited location")
      return
    }

    if (entryType === "journal" && !journalType) {
      setError("Please select a journal type")
      return
    }

    setError("")

    if (type === "edit") {
      updateTravelStory()
    } else {
      addNewTravelStory()
    }
  }

  const handleDeleteStoryImage = async () => {
    // Only allow deletion if editing an existing story
    if (!storyInfo || !storyInfo._id) {
      toast.error("Cannot delete image for new entries")
      return
    }

    // Deleting the image
    const deleteImageResponse = await axiosInstance.delete(
      "/travel-story/delete-image",
      {
        params: {
          imageUrl: storyInfo.imageUrl,
        },
      }
    )

    if (deleteImageResponse.data) {
      const storyId = storyInfo._id

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      }

      // updating story

      const response = await axiosInstance.post(
        "/travel-story/edit-story/" + storyId,
        postData
      )

      if (response.data) {
        toast.success("Story image deleted successfully")

        setStoryImg(null)

        // Update local state instantly
        if (setAllStories && allStories) {
          setAllStories(
            allStories.map((story) =>
              story._id === storyInfo._id ? { ...story, imageUrl: "" } : story
            )
          )
        } else {
          getAllTravelStories()
        }
      }
    }
  }

  const handleDeleteStoryVideo = async () => {
    // Only allow deletion if editing an existing story
    if (!storyInfo || !storyInfo._id) {
      toast.error("Cannot delete video for new entries")
      return
    }

    // Deleting the video
    const deleteVideoResponse = await axiosInstance.delete(
      "/travel-story/delete-image",
      {
        params: {
          imageUrl: storyInfo.videoUrl,
        },
      }
    )

    if (deleteVideoResponse.data) {
      const storyId = storyInfo._id

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        videoUrl: "",
      }

      // updating story

      const response = await axiosInstance.post(
        "/travel-story/edit-story/" + storyId,
        postData
      )

      if (response.data) {
        toast.success("Story video deleted successfully")

        setStoryVideo(null)

        // Update local state instantly
        if (setAllStories && allStories) {
          setAllStories(
            allStories.map((story) =>
              story._id === storyInfo._id ? { ...story, videoUrl: "" } : story
            )
          )
        } else {
          getAllTravelStories()
        }
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Entry" : "Update Entry"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button class="btn-small" onClick={handleAddOrUpdateClick}>
                <IoMdAdd className="text-lg" /> ADD ENTRY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdOutlineUpdate className="text-lg" /> UPDATE ENTRY
                </button>

                <button className="btn-small btn-delete">
                  <MdOutlineDeleteOutline className="text-lg" /> DELETE ENTRY
                </button>
              </>
            )}

            <button class="" onClick={onClose}>
              <IoMdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-1 flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>

          <input
            type="text"
            className="text-2xl text-slate-900 outline-none"
            placeholder="Once Upon A Time..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="my-3">
            <label className="input-label">ENTRY TYPE</label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
              className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-sm w-full"
            >
              <option value="travel">Travel Story</option>
              <option value="journal">Journal Entry</option>
            </select>
          </div>

          {entryType === "journal" && (
            <div className="my-3">
              <label className="input-label">JOURNAL TYPE</label>
              <select
                value={journalType}
                onChange={(e) => setJournalType(e.target.value)}
                className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-sm w-full"
              >
                <option value="">Select Journal Type</option>
                <option value="gratitude">Gratitude Journal</option>
                <option value="daily-reflection">Daily Reflection</option>
                <option value="goal-tracking">Goal Tracking</option>
                <option value="travel-journal">Travel Journal</option>
                <option value="dream-journal">Dream Journal</option>
              </select>
            </div>
          )}

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <MoodSelector mood={mood} setMood={setMood} />

          <div className="my-3">
            <label className="input-label">THEME</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-sm w-full"
            >
              {Object.entries(THEMES).map(([key, themeData]) => (
                <option key={key} value={key}>
                  {themeData.name} - {themeData.description}
                </option>
              ))}
            </select>
            {/* Theme Preview */}
            <div className="mt-2 p-3 rounded-sm" style={{ background: THEMES[theme].bgGradient }}>
              <p style={{ color: THEMES[theme].textColor }} className="text-xs font-medium">
                Preview: This is how your story will look with <strong>{THEMES[theme].name}</strong> theme
              </p>
            </div>
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImage={handleDeleteStoryImage}
          />

          <div className="mt-4">
            <label className="input-label">VIDEO (Optional)</label>
            <VideoSelector
              video={storyVideo}
              setVideo={setStoryVideo}
              handleDeleteVideo={handleDeleteStoryVideo}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>

            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-sm"
              placeholder={getStoryPlaceholder()}
              rows={10}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>

          <div className="pt-3">
            {entryType === "travel" && (
              <>
                <label className="input-label">VISITED LOCATIONS</label>
                <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditTravelStory
