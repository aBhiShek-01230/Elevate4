import Router from "express"
import { addVideoToPlayList, changeCurrentPassword, createPlaylist, getCurrentUser, loginUser, logoutUser, registerUser, subscribeToCourse, unSubscribeToCourse,getAllCourses,HasSubscribed,getAllUsers } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();


// router.route("/register").post( upload.single("avatar"), registerUser )
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
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/profile").post(verifyJWT,getCurrentUser)
router.route("/create-playlist").post(verifyJWT,createPlaylist)
router.route("/add-video").post(verifyJWT,addVideoToPlayList)
router.route("/subscribe").post(verifyJWT,subscribeToCourse)
router.route("/unsubscribe").post(verifyJWT,unSubscribeToCourse)
router.route('/courses').post(verifyJWT,getAllCourses)
router.route('/subscribed').post(HasSubscribed)
router.route('/all-users').post(getAllUsers)





export default router