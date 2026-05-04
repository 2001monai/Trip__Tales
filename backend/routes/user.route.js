import express from "express"
import { getUsers, signout, uploadProfilePicture } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
import upload from "../multer.js"

const router = express.Router()

router.get("/get-user", verifyToken, getUsers)

router.post("/signout", signout)

router.post("/upload-profile-picture", verifyToken, upload.single("profilePicture"), uploadProfilePicture)

export default router
