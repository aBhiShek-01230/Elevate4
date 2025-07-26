import mongoose, { Schema } from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  
  expiresAt: {
    type: Date
  },
  
}, { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);