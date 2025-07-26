import mongoose, { Schema } from 'mongoose'

const subTopicSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  
  questions:[
    {
    type:Schema.Types.ObjectId,
    ref:"Question",
  }
]
}, { timestamps: true });

export const SubTopic = mongoose.model('SubTopic', subTopicSchema);