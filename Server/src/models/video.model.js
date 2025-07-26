import mongoose from "mongoose"
const videoSchema = new mongoose.Schema({
 
title:{
  type:String,
  required:true
},
description:{
  type:String,
  required:true
},
thumbnail:{
  type:String,
},
video:{
  type:String,
  required:true
},
cloudinaryId: {
  type: String,
  required: true
}
  
 },{ timestamps : true }
)
export const Video = mongoose.model("Video",videoSchema)