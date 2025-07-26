import Router from "express"
import {  processImage, sendReply } from "../controllers/chat.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();


router.route("/reply").post(sendReply)
router.route("/analyze").post(upload.single("image"),processImage)



export default router