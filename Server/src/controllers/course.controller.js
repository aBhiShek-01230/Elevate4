import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Course } from "../models/course.model.js"
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js" 
import { ApiResponse } from "../utils/ApiResponse.js"
import { Teacher } from "../models/teacher.model.js"
import { Video } from "../models/video.model.js"

const addCourse = asyncHandler(async(req,res)=>{
  const {courseName,description,duration,category} = req.body

  if ( [courseName, description, duration, category].some((field) => field?.trim() === "") ) {
   throw new ApiError(400, "All fields are required")
  }

  const teacher = await Teacher.findById(req.user?._id)
  if(!teacher){
    throw new ApiError(404, "Teacher not found")
    }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path; 
  if(!thumbnailLocalPath){
    throw new ApiError(400, "Avatar file is required")
  }
  const thumbnail  = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail not uploaded on cloudinary")
  }


  const course = await Course.create({
      courseName,
      description,
      duration,
      category,
      teacher: teacher.fullName,
      thumbnail: thumbnail.url,
      
  })

  const createdCourse = await Course.findById(course._id)
       

    if(!createdCourse){
     throw new ApiError(500, "Something went wrong while creating the course")
    }

    teacher.courses.push(createdCourse._id)
    await teacher.save()
    res.status(200).json(
      new ApiResponse(200,createdCourse,"Course Created Successfully")
    )


})


const addVideoToCourse = asyncHandler(async(req,res)=>{
const { courseId, title, description } = req.body;

const course = await Course.findById(courseId);
if(!course){
  throw new ApiError(404, "Course not found")
}

const thumbnailLocalPath = req.files?.thumbnail[0]?.path; 
const videoPath = req.files?.video?.[0]?.path;

if(!thumbnailLocalPath){
  throw new ApiError(400, "Thumbnail  is required")
}

if (!videoPath) throw new ApiError(400, "Video file is required")

const thumbnail  = await uploadOnCloudinary(thumbnailLocalPath)
const file = await uploadOnCloudinary(videoPath);

if (!thumbnail) {
    throw new ApiError(400, "Thumbnail not uploaded on cloudinary")
}

if (!file) {
    throw new ApiError(400, "Video not uploaded on cloudinary")
}


const video = await Video.create({
    title,
    description,
    thumbnail:thumbnail.url,
    video: file.url,
    cloudinaryId: file.public_id
})
if(!video){
    throw new ApiError(500, "Something went wrong while adding the video")
}

course.videos.push(video._id)
await course.save()
  
res.status(200).json(
    new ApiResponse(200, video, "Video added successfully to the course")
  )

})

const removeVideoFromCourse = asyncHandler(async(req,res)=>{
  const { courseId, videoId } = req.body;
  const course = await Course.findById(courseId);
  if(!course){
    throw new ApiError(404, "Course not found")
  }
  
  course.videos.pull(videoId)
  await course.save()
  res.status(200).json(
    new ApiResponse(200, null, "Video removed from the course")
    )

})

const deleteVideo = asyncHandler(async(req,res)=>{
  const { videoId } = req.body;
  const video = await Video.findById(videoId);
  if(!video){
    throw new ApiError(404, "Video not found")
  }

const result = await deleteFromCloudinary(video.cloudinaryId, "video");
if (result?.result === "ok") {
  console.warn("Video  deleted from Cloudinary");
}
await Course.updateMany({ videos: videoId }, { $pull: { videos: videoId } });
await video.deleteOne();
  res.status(200).json(
    new ApiResponse(200, null, "Video deleted successfully")
  )
})

const updateCourse = asyncHandler(async (req, res) => {
  const { courseId, courseName, description, duration, category } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  let thumbnail = null;

  if (thumbnailLocalPath) {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (thumbnail) {
      course.thumbnail = thumbnail.url;
    } else {
      throw new ApiError(400, "Thumbnail upload failed");
    }
  }

  if (courseName?.trim()) {
    course.courseName = courseName.trim();
  }

  if (description?.trim()) {
    course.description = description.trim();
  }

  if (duration?.trim()) {
    course.duration = duration.trim();
  }

  if (category?.trim()) {
    course.category = category.trim();
  }

  await course.save();

  res.status(200).json(
    new ApiResponse(200, course, "Course updated successfully")
  );
});

const deleteCourse = asyncHandler(async (req, res) => {
  const {courseId} = req.body

  const course = await Course.findById(courseId).populate("videos");
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // 🔥 Delete all videos from Cloudinary and DB
  for (const video of course.videos) {
    // Delete video file from Cloudinary
    if (video.cloudinaryId) {
      try {
          await deleteFromCloudinary(video.cloudinaryId, "video");
      } catch (err) {
        console.error(`❌ Failed to delete video [${video._id}] from Cloudinary:`, err.message);
      }
    }

    // Delete video document
    await Video.findByIdAndDelete(video._id);
  }


  // 🗑 Delete course itself
  await course.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, "Course and associated videos deleted successfully")
  );
});

const fetchAllCourses = asyncHandler(async (req, res) => {
  const { category } = req.body;

  const filter = category ? { category } : {};

  const courses = await Course.find(filter)
    .populate("videos")
    .populate("category");

  res.status(200).json(
    new ApiResponse(200, courses, "Courses fetched successfully")
  );
});







export {
  addCourse,
  addVideoToCourse,
  removeVideoFromCourse,
  deleteVideo,
  updateCourse,
  deleteCourse,
  fetchAllCourses
}