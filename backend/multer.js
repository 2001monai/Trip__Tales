import multer from "multer"
import path from "path"

// storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/")
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //unique file name
  },
})

// file filter to accept images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = file.mimetype.startsWith("image/")
  const allowedVideoTypes = file.mimetype.startsWith("video/")
  
  if (allowedImageTypes || allowedVideoTypes) {
    cb(null, true)
  } else {
    cb(new Error("Only images and videos are allowed"), false)
  }
}

// Initialize multer instance with 100MB limit for videos
const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB for videos
  }
})

export default upload
