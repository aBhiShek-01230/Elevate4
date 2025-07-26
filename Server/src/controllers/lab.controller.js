import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Experiment } from "../models/experiment.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js" 
import { ApiResponse } from "../utils/ApiResponse.js"


const addAnExperiment = asyncHandler(async(req,res)=>{
  const {type,name,description,simulation} = req.body

  if ( [type, name, description, simulation].some((field) => field?.trim() === "") ) {
        throw new ApiError(400, "All fields are required")
  }
  const thumbnailPath = req.file?.path

  if(!thumbnailPath){
    throw new ApiError(400, "Avatar file is required")
  }

  const thumbnail  = await uploadOnCloudinary(thumbnailPath);

  if (!thumbnail) {
      throw new ApiError(400, "Avatar not uploaded on cloudinary")
  }

  const experiment = await Experiment.create({type,
    name,
    description,
    simulation,
    thumbnail : thumbnail.url
  })
  return res.status(201).json(
    new ApiResponse(201, experiment,"Experiment created successfully" )
  )
})




export {
  addAnExperiment
}