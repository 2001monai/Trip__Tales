import React from "react"
import { IoMdClose } from "react-icons/io"
import { MdOutlineDelete, MdOutlineUpdate } from "react-icons/md"
import moment from "moment"
import { FaLocationDot } from "react-icons/fa6"
import { FaSmile, FaFrown, FaLaughSquint, FaLeaf, FaRocket, FaClock } from "react-icons/fa"
import { getThemeStyles, THEMES } from "../../utils/themes"

const ViewTravelStory = ({
  storyInfo,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  const getMoodIcon = (moodType) => {
    const moodIcons = {
      happy: { icon: FaSmile, color: "#FFD700" },
      sad: { icon: FaFrown, color: "#87CEEB" },
      excited: { icon: FaLaughSquint, color: "#FF69B4" },
      peaceful: { icon: FaLeaf, color: "#90EE90" },
      adventurous: { icon: FaRocket, color: "#FF8C00" },
      nostalgic: { icon: FaClock, color: "#DDA0DD" },
    }
    return moodIcons[moodType] || moodIcons.happy
  }

  const moodInfo = getMoodIcon(storyInfo?.mood)
  const MoodIcon = moodInfo.icon
  const themeData = getThemeStyles(storyInfo?.theme || "forest")
  const themeName = THEMES[storyInfo?.theme || "forest"]?.name || "Forest"

  return (
    <div
      className="relative rounded-lg p-6"
      style={{
        background: themeData.bgGradient,
        color: themeData.textColor,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span
            className="text-sm font-semibold px-3 py-1 rounded inline-block"
            style={{
              backgroundColor: themeData.accentColor,
              color: themeData.primaryColor,
            }}
            title={`Theme: ${themeName}`}
          >
            🎨 {themeName}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-3 bg-white/20 p-2 rounded-l-lg">
            <button className="btn-small" onClick={onEditClick}>
              <MdOutlineUpdate className="text-lg" /> UPDATE ENTRY
            </button>

            <button className="btn-small btn-delete" onClick={onDeleteClick}>
              <MdOutlineDelete className="text-lg" /> DELETE ENTRY
            </button>

            <button className="cursor-pointer" onClick={onClose}>
              <IoMdClose className="text-lg text-white/60" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1
            className="text-2xl font-bold"
            style={{ color: themeData.accentColor }}
          >
            {storyInfo && storyInfo.title}
          </h1>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="text-xs"
                style={{
                  color: themeData.textColor,
                  opacity: 0.8,
                }}
              >
                {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
              </span>

              <div
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{ backgroundColor: `${moodInfo.color}20` }}
                title={storyInfo?.mood}
              >
                <MoodIcon style={{ color: moodInfo.color }} size={16} />
              </div>
            </div>

            <div
              className="inline-flex items-center gap-2 text-[13px] rounded-sm px-2 py-1"
              style={{
                backgroundColor: `${themeData.accentColor}30`,
                color: themeData.accentColor,
              }}
            >
              <FaLocationDot className="text-sm" />

              {storyInfo && storyInfo.entryType === "journal" ? (
                storyInfo.journalType ? storyInfo.journalType.replace("-", " ").toUpperCase() : "JOURNAL"
              ) : (
                storyInfo &&
                storyInfo.visitedLocation.map((item, index) =>
                  storyInfo.visitedLocation.length === index + 1
                    ? `${item}`
                    : `${item},`
                )
              )}
            </div>
          </div>
        </div>

        <img
          src={storyInfo && storyInfo.imageUrl}
          alt="story image"
          className="w-full h-[300px] object-cover rounded-lg border-2"
          style={{ borderColor: themeData.borderColor }}
        />

        {storyInfo && storyInfo.videoUrl && (
          <div className="mt-4">
            <video
              src={storyInfo.videoUrl}
              controls
              className="w-full h-[300px] object-cover rounded-lg border-2"
              style={{ borderColor: themeData.borderColor }}
            />
          </div>
        )}

        <div className="mt-4">
          <p
            className="text-sm leading-6 text-justify whitespace-pre-line"
            style={{ color: themeData.textColor }}
          >
            {storyInfo.story}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ViewTravelStory

