import mongoose, { Schema } from 'mongoose'

const subjectSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  thumbnail:{
    type:String,
    required:true
  },
  background:{
    type:String,
  },
  topics:[
    {
    type:Schema.Types.ObjectId,
    ref:"Topic",
  }
]
}, { timestamps: true });

export const Subject = mongoose.model('Subject', subjectSchema);