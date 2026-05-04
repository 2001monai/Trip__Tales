import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Profile from "./Profile"
import axiosInstance from "../utils/axiosInstance"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useDispatch } from "react-redux"
import SearchBar from "./SearchBar"
import { FaChartBar } from "react-icons/fa"

const Navbar = ({
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      const response = await axiosInstance.post("/user/signout")

      if (response.data) {
        dispatch(signOutSuccess())

        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    handleClearSearch()
    setSearchQuery("")
  }

  return (
    <div className="bg-white flex items-center justify-between px-10 py-2 drop-shadow sticky top-0 z-10">
      <Link to={"/"}>
        <h1 className="font-bold text-2xl sm:text-2xl flex flex-wrap">
          <span className="text-blue-400">Trip</span>
          <span className="text-blue-800">tales</span>
        </h1>
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <Link
        to="/mood-insights"
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        title="View Mood Analytics"
      >
        <FaChartBar className="text-blue-600" size={20} />
        <span className="text-sm font-medium text-blue-600 hidden sm:inline">Analytics</span>
      </Link>

      <Profile onLogout={onLogout} />
    </div>
  )
}

export default Navbar
