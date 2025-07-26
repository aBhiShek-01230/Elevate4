import Router from "express"
import { addAnExperiment } from "../controllers/lab.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
// import { verifyAdmin } from "../middlewares/auth.middleware.js";


const router = Router();



router.route("/addLab").post(upload.single("thumbnail"),addAnExperiment)
  
  

export default router