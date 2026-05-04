import React from "react"
import moment from "moment"
import { FaLocationDot } from "react-icons/fa6"
import { FaHeart, FaSmile, FaFrown, FaLaughSquint, FaLeaf, FaRocket, FaClock, FaPlay } from "react-icons/fa"
import { getThemeStyles, THEMES } from "../utils/themes"

const TravelStoryCard = ({
  imageUrl,
  videoUrl,
  title,
  story,
  date,
  visitedLocation,
  isFavourite,
  mood,
  entryType,
  journalType,
  theme,
  onEdit,
  onClick,
  onFavouriteClick,
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

  const moodInfo = getMoodIcon(mood)
  const MoodIcon = moodInfo.icon
  const themeData = getThemeStyles(theme || "forest")
  const themeName = THEMES[theme || "forest"]?.name || "Forest"

  return (
    <div
      className="story-card border rounded-lg overflow-hidden hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer"
      style={{
        backgroundColor: themeData.cardBg,
        borderColor: themeData.borderColor,
      }}
    >
      {videoUrl ? (
        <div className="w-full h-56 bg-black relative group">
          <video
            src={videoUrl}
            alt={title}
            className="w-full h-56 object-cover rounded-lg"
            onClick={onClick}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all" onClick={onClick}>
            <FaPlay className="text-4xl text-white" />
          </div>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-56 object-cover rounded-lg"
          onClick={onClick}
        />
      )}

      <div className="absolute top-4 left-4 flex gap-2">
        <span
          className="text-xs font-semibold px-2 py-1 rounded"
          style={{
            backgroundColor: themeData.accentColor,
            color: themeData.primaryColor,
          }}
          title={`Theme: ${themeName}`}
        >
          🎨 {themeName}
        </span>
        {videoUrl && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
            style={{
              backgroundColor: "#FF6B6B",
              color: "white",
            }}
            title="Video included"
          >
            <FaPlay size={10} /> VIDEO
          </span>
        )}
      </div>

      <button
        className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
        onClick={onFavouriteClick}
      >
        <FaHeart
          className={`icon-btn ${
            isFavourite ? "text-red-500" : "text-white"
          } hover:text-red-500`}
        />
      </button>

      <div className="p-4" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6
              className="story-title text-[16px] font-medium"
              style={{ color: themeData.accentColor }}
            >
              {title}
            </h6>

            <span
              className="text-xs"
              style={{
                color: themeData.textColor,
                opacity: 0.7,
              }}
            >
              {date ? moment(date).format("Do MMM YYYY") : "-"}
            </span>
          </div>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: `${moodInfo.color}20` }}
            title={mood}
          >
            <MoodIcon style={{ color: moodInfo.color }} size={20} />
          </div>
        </div>

        <p
          className="story-text text-sm mt-2"
          style={{ color: themeData.textColor }}
        >
          {story?.slice(0, 60)}
        </p>

        <div
          className="inline-flex items-center gap-2 text-[13px] rounded mt-3 px-2 py-1"
          style={{
            backgroundColor: `${themeData.accentColor}30`,
            color: themeData.accentColor,
          }}
        >
          {entryType === "journal" ? (
            <>
              <FaLocationDot className="text-sm" />
              {journalType ? journalType.replace("-", " ").toUpperCase() : "JOURNAL"}
            </>
          ) : (
            <>
              <FaLocationDot className="text-sm" />
              {visitedLocation.map((item, index) =>
                visitedLocation.length === index + 1 ? `${item}` : `${item},`
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TravelStoryCard

