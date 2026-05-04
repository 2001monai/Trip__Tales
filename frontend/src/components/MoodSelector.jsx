import React from "react"
import { FaSmile, FaFrown, FaLaughSquint, FaLeaf, FaRocket, FaClock } from "react-icons/fa"
import "./MoodSelector.css"

const MoodSelector = ({ mood, setMood }) => {
  const moods = [
    { value: "happy", label: "Happy", icon: FaSmile, color: "#FFD700" },
    { value: "sad", label: "Sad", icon: FaFrown, color: "#87CEEB" },
    { value: "excited", label: "Excited", icon: FaLaughSquint, color: "#FF69B4" },
    { value: "peaceful", label: "Peaceful", icon: FaLeaf, color: "#90EE90" },
    { value: "adventurous", label: "Adventurous", icon: FaRocket, color: "#FF8C00" },
    { value: "nostalgic", label: "Nostalgic", icon: FaClock, color: "#DDA0DD" },
  ]

  return (
    <div className="mood-selector">
      <label className="mood-label">How did you feel?</label>
      <div className="mood-options">
        {moods.map((m) => {
          const IconComponent = m.icon
          return (
            <button
              key={m.value}
              className={`mood-btn ${mood === m.value ? "active" : ""}`}
              onClick={() => setMood(m.value)}
              title={m.label}
              style={
                mood === m.value
                  ? { backgroundColor: m.color, color: "white" }
                  : {}
              }
            >
              <IconComponent size={24} />
              <span>{m.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MoodSelector
