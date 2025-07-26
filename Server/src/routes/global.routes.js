import Router from "express"
import { getAllLabs, getAllCourses,getCourse,getQuiz } from "../controllers/global.controller.js";


const router = Router();
router.route("/lab").get(getAllLabs)
router.route("/courses").get(getAllCourses)
router.route("/course").post(getCourse)
router.route("/quiz").post(getQuiz)

export default router