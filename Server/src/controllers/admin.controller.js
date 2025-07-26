import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Admin } from "../models/admin.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if required fields are provided
  if ([email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if any admin already exists
  const existingAdmins = await Admin.find({});
  if (existingAdmins.length > 0) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  // Create new admin
  const admin = await Admin.create({ email, password });

  const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the admin");
  }

  res.status(200).json(
    new ApiResponse(200, createdAdmin, "Admin Registered Successfully")
  );
});


const loginAdmin = asyncHandler( async(req,res)=>{
 const {email,password} = req.body
   if (!email) {
        throw new ApiError(400, "email is required")
  }

  const user = await Admin.findOne({
    $or: [{email}]
  })

  if(!user){
    throw new ApiError(400, "Admin does not exist")
  }
  const isValidPassword = await user.isPassWordCorrect(password)
  if(!isValidPassword){
    throw new ApiError(400, "Invalid password")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  
  const loggedInUser = await Admin.findById(user._id).select("-password -refreshToken")

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

const logoutAdmin = asyncHandler( async (req,res)=>{
  await Admin.findByIdAndUpdate(
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
    .json(new ApiResponse(200, {}, "Admin logged Out"))
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await Admin.findById(req.user?._id)
    
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

const getAdmin = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "Admin fetched successfully"
    ))
})





export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  changeCurrentPassword,
  getAdmin
}