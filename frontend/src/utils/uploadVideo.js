import axiosInstance from "./axiosInstance"

const uploadVideo = async (videoFile) => {
  const formData = new FormData()

  formData.append("video", videoFile)

  try {
    const response = await axiosInstance.post(
      "/travel-story/video-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // set header for the file upload
        },
      }
    )

    return response.data
  } catch (error) {
    console.log("Error in uploading the video", error)
    throw error // rethrow error for handling
  }
}

export default uploadVideo
