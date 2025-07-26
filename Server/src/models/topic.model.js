import mongoose, { Schema } from 'mongoose'

const topicSchema = new mongoose.Schema({
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
  
  subTopics:[
    {
    type:Schema.Types.ObjectId,
    ref:"SubTopic",
  }
]
}, { timestamps: true });

export const Topic = mongoose.model('Topic', topicSchema);