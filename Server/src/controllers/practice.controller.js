import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Subject } from "../models/subject.model.js";
import { Topic } from "../models/topic.model.js";
import { SubTopic } from "../models/subTopic.model.js";
import { Question } from "../models/question.model.js";

// ✅ Add Subject
const addSubject = asyncHandler(async (req, res) => {
  const { name, description, background } = req.body;

  if (!name || !description ) {
    throw new ApiError(400, "All fields except background are required");
  }

  const thumbnailPath = req.file?.path;

  if (!thumbnailPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!thumbnail) {
    throw new ApiError(400, "Avatar not uploaded on cloudinary");
  }

  const subject = await Subject.create({
    name,
    description,
    thumbnail: thumbnail.url,
    background,
  });

  res
    .status(201)
    .json(new ApiResponse(201, subject, "Subject created successfully"));
});

// ✅ Add Topic
const addTopic = asyncHandler(async (req, res) => {
  const { name, description, background, subjectId } = req.body;

  if (!name || !description  || !subjectId) {
    throw new ApiError(400, "All fields except background are required");
  }
  const thumbnailPath = req.file?.path;

  if (!thumbnailPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!thumbnail) {
    throw new ApiError(400, "Avatar not uploaded on cloudinary");
  }

  const topic = await Topic.create({
    name,
    description,
    thumbnail: thumbnail.url,
    background,
  });

  // Push topic to Subject
  const subject = await Subject.findByIdAndUpdate(
    subjectId,
    { $push: { topics: topic._id } },
    { new: true }
  );

  if (!subject) throw new ApiError(404, "Subject not found");

  res
    .status(201)
    .json(new ApiResponse(201, topic, "Topic created successfully"));
});

// ✅ Add SubTopic
const addSubTopic = asyncHandler(async (req, res) => {
  const { name, topicId } = req.body;

  if (!name || !topicId) {
    throw new ApiError(400, "Both name and topicId are required");
  }

  const subTopic = await SubTopic.create({ name });

  // Add subTopic to parent topic
  const topic = await Topic.findByIdAndUpdate(
    topicId,
    { $push: { subTopics: subTopic._id } },
    { new: true }
  );

  if (!topic) {
    throw new ApiError(404, "Topic not found");
  }

  res
    .status(201)
    .json(new ApiResponse(201, subTopic, "SubTopic created successfully"));
});

// ✅ Add Question
const addQuestion = asyncHandler(async (req, res) => {
  const { name, compiler, description, examples, constraints, subTopicId } =
    req.body;

  if (!name || compiler === undefined || !description || !subTopicId) {
    throw new ApiError(400, "Missing required fields");
  }

  const question = await Question.create({
    name,
    compiler,
    description,
    examples,
    constraints,
  });

  // Add question to SubTopic
  const subTopic = await SubTopic.findByIdAndUpdate(
    subTopicId,
    { $push: { questions: question._id } },
    { new: true }
  );

  if (!subTopic) {
    throw new ApiError(404, "SubTopic not found");
  }

  res
    .status(201)
    .json(new ApiResponse(201, question, "Question created successfully"));
});

// ✅ Get all Subjects
const getAllSubject = asyncHandler(async (req, res) => {
  const subjects = await Subject.find().populate("topics");
  res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});

// ✅ Get all Topics (by subject)
const getAllTopic = asyncHandler(async (req, res) => {
  const { subjectId } = req.body;

  if (!subjectId) {
    throw new ApiError(400, "subjectId is required");
  }

  const subject = await Subject.findById(subjectId).populate({
    path: "topics",
    populate: {
      path: "subTopics",
    },
  });

  if (!subject) throw new ApiError(404, "Subject not found");

  res
    .status(200)
    .json(new ApiResponse(200, subject.topics, "Topics fetched successfully"));
});

// ✅ Get all SubTopics (by topic)
const getAllSubTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.body;

  if (!topicId) {
    throw new ApiError(400, "topicId is required");
  }

  const topic = await Topic.findById(topicId).populate("subTopics");

  if (!topic) throw new ApiError(404, "Topic not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, topic.subTopics, "SubTopics fetched successfully")
    );
});

// ✅ Get all Questions (by subTopic)
const getAllQuestion = asyncHandler(async (req, res) => {
  const { subTopicId } = req.body;

  if (!subTopicId) {
    throw new ApiError(400, "subTopicId is required");
  }

  const subTopic = await SubTopic.findById(subTopicId).populate("questions");

  if (!subTopic) throw new ApiError(404, "SubTopic not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, subTopic.questions, "Questions fetched successfully")
    );
});

const getQuestion = asyncHandler( async(req,res)=>{
  const { questionId } = req.body;
  if (!questionId) {
    throw new ApiError(400, "questionId is required");
  }
  const question = await Question.findById(questionId);
  if (!question) throw new ApiError(404, "Question not found");
  res
  .status(200)
  .json(
    new ApiResponse(200, question, "Question fetched successfully")
    );
})

const getAllQuestionsByTopicGrouped = asyncHandler(async (req, res) => {
  const { topicId } = req.body;

  if (!topicId) {
    throw new ApiError(400, "topicId is required");
  }

  // Get topic with populated subTopics
  const topic = await Topic.findById(topicId).populate("subTopics");

  if (!topic) throw new ApiError(404, "Topic not found");

  const subTopicIds = topic.subTopics.map((sub) => sub._id);

  // Fetch subtopics with their questions
  const subTopicsWithQuestions = await SubTopic.find({
    _id: { $in: subTopicIds }
  }).populate("questions", "name _id"); // Only get name and _id for each question

  // Format the response as required
  const result = subTopicsWithQuestions.map((sub) => ({
    subTopic: sub.name,
    questions: sub.questions.map((q) => ({
      _id: q._id,
      title: q.name,
    })),
  }));

  res.status(200).json(
    new ApiResponse(200, result, "Questions grouped by subTopic")
  );
});


export {
  addSubject,
  addTopic,
  addSubTopic,
  addQuestion,
  getAllSubject,
  getAllTopic,
  getAllSubTopic,
  getAllQuestion,
  getQuestion,
  getAllQuestionsByTopicGrouped
};
