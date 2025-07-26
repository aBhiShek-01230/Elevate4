import mongoose, { Schema } from 'mongoose'

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true 
  },
  description: {
    type: String,
    required: true
  },
  teacher:{
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  thumbnail:{
      type: String,
      required : true
  },
  category:{
      type: String,
      required : true
  },
  quizzes: [{
    type: Schema.Types.ObjectId,
    ref: "Quiz"
  }],
  videos: [{
    type: Schema.Types.ObjectId,
    ref: "Video"
  }],
  assignments: [{
    type: Schema.Types.ObjectId,
    ref: "Assignment"
  }]
}, { timestamps: true });

export const Course = mongoose.model("Course",courseSchema)
