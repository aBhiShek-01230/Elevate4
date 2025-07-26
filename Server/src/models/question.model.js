import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  compiler: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  examples: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
      explanation: { type: String }
    }
  ],

  constraints: [
    { type: String }
  ]

}, { timestamps: true });

export const Question = mongoose.model('Question', questionSchema);
