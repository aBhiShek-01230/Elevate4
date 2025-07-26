import Router from "express"
import { changeCurrentPassword, getCurrentUser, loginTeacher, logoutTeacher, registerTeacher,getTeacher } from "../controllers/teacher.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/teacher.auth.middleware.js";
import {  addQuizToCourse, addQuiz } from "../controllers/quiz.controller.js";


const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerTeacher
)
router.route("/login").post(loginTeacher)
router.route("/logout").post(verifyJWT,logoutTeacher)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/profile").post(verifyJWT,getCurrentUser)
router.route("/get-teacher").post(getTeacher)
router.route("/add-quiz").post(verifyJWT,addQuiz)
router.route("/add-quiz-course").post(verifyJWT,addQuizToCourse)



export default router