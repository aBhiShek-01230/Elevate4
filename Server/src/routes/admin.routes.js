import Router from "express"
import { changeCurrentPassword, getAdmin, loginAdmin, logoutAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { addAnExperiment } from "../controllers/lab.controller.js";
import { addQuizToLab, addQuizToCourse, addQuiz } from "../controllers/quiz.controller.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router();


router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyAdmin,logoutAdmin)
router.route("/change-password").post(verifyAdmin,changeCurrentPassword)
router.route("/profile").post(verifyAdmin,getAdmin)

router.route("/add-quiz").post(verifyAdmin,addQuiz)
router.route("/add-quiz-lab").post(verifyAdmin,addQuizToLab)

router.route("/add-lab").post(verifyAdmin,upload.single("thumbnail"),addAnExperiment)





export default router