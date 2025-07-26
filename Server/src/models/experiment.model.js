import {mongoose,Schema} from "mongoose"

const experimentSchema = new mongoose.Schema( {
   
  type :{
    type:String,
    required:true
  },
  name :{
    type:String,
    required:true
  },
  description :{
    type:String,
    required:true
  },
  simulation:{
    type:String,
    required:true
  },
  experimentData:{
    type:Array,
    required:true
  },
  thumbnail:{
    type:String,
    required:true
  },
  quiz:{
    type: Schema.Types.ObjectId,
    ref :"Quiz"
  }
  

 },{ timestamps : true })


 export const  Experiment = mongoose.model("Experiment",experimentSchema)