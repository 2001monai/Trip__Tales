import React from "react"
import Navbar from "../../components/Navbar"
import MoodAnalytics from "../../components/MoodAnalytics"

const MoodInsights = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <MoodAnalytics />
      </div>
    </>
  )
}

export default MoodInsights
