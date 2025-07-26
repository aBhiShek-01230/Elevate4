import Router from "express"
import { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup, allMessages, sendMessage } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/").post( verifyJWT,accessChat);
router.route("/").get( verifyJWT,fetchChats);
router.route("/group").post( verifyJWT,createGroupChat);
router.route("/rename").put( renameGroup);
router.route("/groupremove").put( verifyJWT,removeFromGroup);
router.route("/groupadd").put( verifyJWT,addToGroup);
router.route("/:chatId").get( verifyJWT,allMessages);
router.route("/send").post( verifyJWT,sendMessage);

  
  

export default router