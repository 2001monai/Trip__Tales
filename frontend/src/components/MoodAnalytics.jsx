import React, { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import axiosInstance from "../utils/axiosInstance"
import { FaSmile, FaFrown, FaLaughSquint, FaLeaf, FaRocket, FaClock } from "react-icons/fa"

const MoodAnalytics = () => {
  const [moodStats, setMoodStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMoodStats()
  }, [])

  const fetchMoodStats = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/travel-story/mood-stats")

      if (response.data) {
        setMoodStats(response.data)
        setError(null)
      }
    } catch (err) {
      console.error("Mood stats error:", err)
      
      let errorMessage = "Failed to load mood statistics"
      
      if (err.response?.status === 401) {
        errorMessage = "Unauthorized - Please login again"
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setMoodStats(null)
    } finally {
      setLoading(false)
    }
  }

  const getMoodIcon = (mood) => {
    const moodIcons = {
      happy: { icon: FaSmile, color: "#FFD700" },
      sad: { icon: FaFrown, color: "#87CEEB" },
      excited: { icon: FaLaughSquint, color: "#FF69B4" },
      peaceful: { icon: FaLeaf, color: "#90EE90" },
      adventurous: { icon: FaRocket, color: "#FF8C00" },
      nostalgic: { icon: FaClock, color: "#DDA0DD" },
    }
    return moodIcons[mood] || moodIcons.happy
  }

  const getMoodLabel = (mood) => {
    const labels = {
      happy: "Happy",
      sad: "Sad",
      excited: "Excited",
      peaceful: "Peaceful",
      adventurous: "Adventurous",
      nostalgic: "Nostalgic",
    }
    return labels[mood] || "Unknown"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Loading mood statistics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-semibold mb-2">Error Loading Analytics</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={fetchMoodStats}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!moodStats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">No mood data available yet</p>
      </div>
    )
  }

  // Prepare data for pie chart
  const pieData = Object.entries(moodStats.moodCounts).map(([mood, count]) => ({
    name: getMoodLabel(mood),
    value: count,
    color: getMoodIcon(mood).color,
  }))

  // Filter out moods with 0 count
  const activeMoodData = pieData.filter((item) => item.value > 0)

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Mood Analytics</h2>

        {/* Most Common Mood Card */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 mb-8 border border-cyan-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Most Common Mood
          </h3>
          <div className="flex items-center gap-4">
            {(() => {
              const moodInfo = getMoodIcon(moodStats.mostCommonMood)
              const MoodIcon = moodInfo.icon
              return (
                <>
                  <div
                    className="flex items-center justify-center w-20 h-20 rounded-full"
                    style={{ backgroundColor: `${moodInfo.color}30` }}
                  >
                    <MoodIcon
                      style={{ color: moodInfo.color }}
                      size={40}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {getMoodLabel(moodStats.mostCommonMood)}
                    </p>
                    <p className="text-sm text-slate-600">
                      {moodStats.moodCounts[moodStats.mostCommonMood]} stories
                    </p>
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Emotional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <p className="text-sm font-medium text-slate-600">Positive Vibes</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {moodStats.insights.positivePercentage}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Happy, Excited, Adventurous</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <p className="text-sm font-medium text-slate-600">Peaceful Moments</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {moodStats.insights.peacefulPercentage}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Peaceful & Serene</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <p className="text-sm font-medium text-slate-600">Challenging Times</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {moodStats.insights.negativePercentage}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Sad & Reflective</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Distribution Pie Chart */}
          {activeMoodData.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-md">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Mood Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activeMoodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activeMoodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} stories`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Weekly Mood Trend Bar Chart */}
          {moodStats.weeklyData && moodStats.weeklyData.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-md">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Weekly Mood Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moodStats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="happy" fill="#FFD700" name="Happy" />
                  <Bar dataKey="excited" fill="#FF69B4" name="Excited" />
                  <Bar dataKey="peaceful" fill="#90EE90" name="Peaceful" />
                  <Bar dataKey="adventurous" fill="#FF8C00" name="Adventurous" />
                  <Bar dataKey="sad" fill="#87CEEB" name="Sad" />
                  <Bar dataKey="nostalgic" fill="#DDA0DD" name="Nostalgic" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Mood Summary Stats */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-md mt-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Mood Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(moodStats.moodCounts).map(([mood, count]) => {
              const moodInfo = getMoodIcon(mood)
              const MoodIcon = moodInfo.icon
              return (
                <div
                  key={mood}
                  className="text-center p-4 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: `${moodInfo.color}20` }}
                  >
                    <MoodIcon style={{ color: moodInfo.color }} size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {getMoodLabel(mood)}
                  </p>
                  <p className="text-2xl font-bold text-slate-800">{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodAnalytics
