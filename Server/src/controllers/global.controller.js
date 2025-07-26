import { asyncHandler } from "../utils/asyncHandler.js";
import { Experiment } from "../models/experiment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js"
import { Quiz } from "../models/quiz.model.js"




const getAllLabs = asyncHandler(async (req, res) =>{

   const labs = await Experiment.find({});
 
  res.status(200).json(
    new ApiResponse(200,labs, "Labs retrieved successfully")
  );
})

const getAllCourses = asyncHandler(async (req, res) =>{

   const courses = await Course.find({});
 
  res.status(200).json(
    new ApiResponse(200,courses, "Courses retrieved successfully")
  );
})

const getCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId)
    .populate('videos')
    .populate('quizzes'); // Populate quizzes too

  res.status(200).json(
    new ApiResponse(200, course, "Course retrieved successfully")
  );
});

const getQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.body;

  const quiz = await Quiz.findById(quizId)
    
  res.status(200).json(
    new ApiResponse(200, quiz, "Course retrieved successfully")
  );
});


export {
  getAllLabs,
  getAllCourses,
  getCourse,
  getQuiz
}