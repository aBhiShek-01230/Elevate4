import {mongoose,Schema} from "mongoose"
const playListSchema = new mongoose.Schema({
 
name:{
  type:String,
  required:true
},
thumbnail:{
  type:String,
},
videos: [{
    type: Schema.Types.ObjectId,
    ref: "Video"
}],

  
 },{ timestamps : true }
)
export const Playlist = mongoose.model("Playlist",playListSchema)