import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Teacher } from "../models/teacher.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js" 
import { ApiResponse } from "../utils/ApiResponse.js"



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await Teacher.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerTeacher = asyncHandler( async(req,res)=>{
  const {fullName,username,email,password,aboutMe} = req.body

  if ( [fullName, email, username, password].some((field) => field?.trim() === "") ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await Teacher.findOne({
      $or: [{username},{email}]
    })

    if(existedUser){
      throw new ApiError(400, "Username or Email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
      throw new ApiError(400, "Avatar file is required")
    }

    const avatar  = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar not uploaded on cloudinary")
    }

    const user  = await Teacher.create({
      fullName,
      username: username.toLowerCase(),
      email,
      password,
      aboutMe,
      avatar:avatar.url
    })
    
    const createdUser = await Teacher.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
     throw new ApiError(500, "Something went wrong while registering the user")
    }

    res.status(200).json(
      new ApiResponse(200,createdUser,"User Registered Successfully")
    )
    
})

const loginTeacher = asyncHandler( async(req,res)=>{
 const {username,email,password} = req.body
   if (!username && !email) {
        throw new ApiError(400, "username or email is required")
  }

  const user = await Teacher.findOne({
    $or: [{username}, {email}]
  })

  if(!user){
    throw new ApiError(400, "User does not exist")
  }
  const isValidPassword = await user.isPassWordCorrect(password)
  if(!isValidPassword){
    throw new ApiError(400, "Invalid password")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  
  const loggedInUser = await Teacher.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true
  }

 
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutTeacher = asyncHandler( async (req,res)=>{
  await Teacher.findByIdAndUpdate(
    req.user._id,
    {
    $unset:{
      refreshToken:1,
    },
  },
  {
    new:true
  }
)
const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await Teacher.findById(req.user?._id)
    
    const isPasswordCorrect = await user.isPassWordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const getTeacher = asyncHandler(async(req, res) => {
  const {teacherId} = req.body

  const teacher = await Teacher.findById(teacherId);
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        teacher,
        "User fetched successfully"
    ))
})





export {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  changeCurrentPassword,
  getCurrentUser,
  getTeacher
}