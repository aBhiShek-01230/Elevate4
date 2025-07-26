
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  chatName: { type: String }, // For group chats
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
}, { timestamps: true });

export const Chat =  mongoose.model("Chat", chatSchema);
