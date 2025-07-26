import Router from "express"
import { addCourse, addVideoToCourse, deleteCourse, deleteVideo, fetchAllCourses, removeVideoFromCourse, updateCourse } from "../controllers/course.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/teacher.auth.middleware.js"


const router = Router();


router.route("/add-course").post(
  verifyJWT,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    addCourse
)
router.route("/add-video").post(
  verifyJWT,
    upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
    addVideoToCourse
)
router.route("/remove-from-course").post(verifyJWT,removeVideoFromCourse)
router.route("/delete-video").post(verifyJWT,deleteVideo)
router.route("/update-course").post(verifyJWT,
   upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
  updateCourse)
router.route("/delete-course").post(verifyJWT,deleteCourse) 
router.route("/all-courses").get(verifyJWT,fetchAllCourses)  





export default router