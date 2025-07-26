import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [
    {
      type: String,
      required: true
    }
  ],
  answer: {
    correctOption: {
      type: String,
      required: true
    },
    explanation: {
      type: String,
      required: true
    }
  }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true
  }
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz', quizSchema);
