import Router from "express"
import { addSubject, addTopic,addSubTopic, addQuestion, getAllSubject, getAllTopic,  getAllSubTopic, getAllQuestion,getQuestion,getAllQuestionsByTopicGrouped } from "../controllers/practice.controller.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router();

router.route("/add-subject").post(upload.single("thumbnail"),addSubject)
router.route("/add-topic").post(upload.single("thumbnail"),addTopic)
router.route("/add-subtopic").post(addSubTopic)
router.route("/add-question").post(addQuestion)





router.route("/subject").get(getAllSubject)
router.route("/topic").post(getAllTopic)
router.route("/subtopic").post(getAllSubTopic)
router.route("/questions").post(getAllQuestion)
router.route("/question").post(getQuestion)
router.route("/all-question").post(getAllQuestionsByTopicGrouped)


export default router