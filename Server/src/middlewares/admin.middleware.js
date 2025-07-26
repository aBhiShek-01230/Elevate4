import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js";



export const verifyAdmin = asyncHandler(async(req, _, next) => {

  try {
    
    const token  = req.cookies?.accessToken || req.header("Autherization")?.replace("Bearer ", "")
    if(!token) return next(new ApiError(401, "Unauthorized access"))
 
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
   
    const user = await Admin.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
      return next(new ApiError(401, "Invalid token"))
    }

    req.user = user;
    next()

  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token")
  }

})