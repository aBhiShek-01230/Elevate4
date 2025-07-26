import Router from "express"
import { addQuizToLab, addQuizToCourse, addQuiz } from "../controllers/quiz.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
// import { verifyAdmin } from "../middlewares/auth.middleware.js";


const router = Router();



router.route("/add-quiz").post(addQuiz)
router.route("/add-quiz-lab").post(addQuizToLab)
router.route("/add-quiz-course").post(addQuizToCourse)

  

export default router