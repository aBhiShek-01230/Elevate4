import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Quiz } from "../models/quiz.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Experiment } from "../models/experiment.model.js"
import { Course } from "../models/course.model.js"



const addQuizToLab = asyncHandler(async(req,res)=>{
  const {expId, quizId} = req.body
  const experiment = await Experiment.findById(expId)
  if(!experiment) return new ApiError(404, 'Experiment not found')
    const quiz = await Quiz.findById(quizId)
  if(!quiz) return new ApiError(404, 'Quiz not found')
    experiment.quiz = quiz._id
  await experiment.save()
  res.status(201).json(
    new ApiResponse(201,{},'Quiz added to lab')
  )
})



 const addQuiz = asyncHandler(async (req, res) => {
  const { title, questions } = req.body;

  // Validate input
  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    throw new ApiError(400, "Title and questions are required");
  }

  // Validate each question
  for (const q of questions) {
    if (
      !q.questionText ||
      !q.options ||
      !Array.isArray(q.options) ||
      q.options.length < 2 ||
      !q.answer ||
      !q.answer.correctOption ||
      !q.answer.explanation
    ) {
      throw new ApiError(400, "Each question must have questionText, at least 2 options, and a valid answer with correctOption and explanation");
    }

    // Optional: check if correctOption is in options
    if (!q.options.includes(q.answer.correctOption)) {
      throw new ApiError(400, `Correct option "${q.answer.correctOption}" must be one of the provided options for question: "${q.questionText}"`);
    }
  }

  // Save to DB
  const newQuiz = await Quiz.create({ title, questions });

  res.status(201).json(
    new ApiResponse(201, newQuiz, "Quiz created successfully")
  );
});

const addQuizToCourse = asyncHandler(async(req,res)=>{
  const {courseId, quizId} = req.body
  const course = await Course.findById(courseId)
  if(!course) return new ApiError(404, 'Course not found')
    const quiz = await Quiz.findById(quizId)
  if(!quiz) return new ApiError(404, 'Quiz not found')
    course.quizzes.push(quizId)
  await course.save()
  res.status(201).json(
    new ApiResponse(201, course, "Quiz added to course successfully")
    )
})

export{
  addQuizToLab,
  addQuiz,
  addQuizToCourse

}