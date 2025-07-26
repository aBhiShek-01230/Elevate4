import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const Message =  mongoose.model("Message", messageSchema);
