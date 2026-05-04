import React, { useEffect, useRef, useState } from "react"
import { BsUpload } from "react-icons/bs"
import { MdDeleteOutline } from "react-icons/md"

const VideoSelector = ({ video, setVideo, handleDeleteVideo }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleVideoChange = (event) => {
    const file = event.target.files[0]

    if (file) {
      setVideo(file)
    }
  }

  const onChooseFile = () => {
    inputRef.current.click()
  }

  const handleRemoveVideo = () => {
    setVideo(null)
    handleDeleteVideo()
  }

  useEffect(() => {
    // if the video prop is a string(url), set it as the preview URL
    if (typeof video === "string") {
      setPreviewUrl(video)
    } else if (video) {
      setPreviewUrl(URL.createObjectURL(video))
    } else {
      setPreviewUrl(null)
    }

    return () => {
      if (previewUrl && typeof previewUrl === "string" && !video) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [video])

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        ref={inputRef}
        onChange={handleVideoChange}
        className="hidden"
      />

      {!video ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-sm border border-slate-200/50"
          onClick={() => onChooseFile()}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-purple-100 rounded-full border border-purple-100">
            <BsUpload className="text-3xl font-bold text-purple-500" />
          </div>

          <p className="text-sm text-slate-500">Browse video files to upload</p>
        </button>
      ) : (
        <div className="w-full relative">
          <video
            src={previewUrl}
            controls
            className="w-full h-[300px] object-cover rounded-lg bg-black"
          />

          <button
            className="btn-small btn-delete absolute top-2 right-2"
            onClick={handleRemoveVideo}
          >
            <MdDeleteOutline className="text-xl" />
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoSelector
