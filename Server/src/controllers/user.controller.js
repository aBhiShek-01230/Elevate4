import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Course } from "../models/course.model.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, aboutMe } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    res.json({ success: false, message: "All fields are required" });
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    res.json({ success: false, message: "Username or Email already exists" });
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    res.json({ success: false, message: "Profile picture is required" });
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    res.json({ success: false, message: "profile pictore not uploaded" });
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    aboutMe,
    avatar: avatar.url,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    res.json({
      success: false,
      message: "Something went wrong while creating the user",
    });
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { createdUser, accessToken },
        "User Registered Successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    res.json({ success: false, message: "Username or Email required" });
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    res.json({ success: false, message: "User does not exist" });
  }
  const isValidPassword = await user.isPassWordCorrect(password);
  if (!isValidPassword) {
    res.json({ success: false, message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPassWordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const createPlaylist = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user?._id);

  const playlist = await Playlist.create({
    name,
  });

  user.playlists.push(playlist._id);
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const addVideoToPlayList = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);
  if (!playlist || !video) {
    throw new ApiError(404, "Playlist or video not found");
  }
  playlist.videos.push(videoId);
  playlist.thumbnail = video.thumbnail;
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const subscribeToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    throw new ApiError(400, "Course id is required");
  }
  const user = await User.findById(req.user?._id);
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  if (user.courses.includes(courseId)) {
    throw new ApiError(400, "You are already subscribed to this course");
  }

  const subscription = await Subscription.create({
    student: user._id,
    course: courseId,
  });
  user.courses.push(course._id);
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Course subscribed successfully"));
});

const unSubscribeToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  // 🧹 Remove course from user's course list
  if (user.courses.includes(courseId)) {
    user.courses.pull(courseId);
    await user.save();

    const subscription = await Subscription.findOne({
      student: user._id,
      course: courseId,
    });

    if (subscription) {
      await subscription.deleteOne(); // ✅ only this is needed
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Course unsubscribed successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(401, "Unauthorized");
  const courseIds = user.courses; // Array of IDs
  const courses = await Course.find({ _id: { $in: courseIds } });
  
  res.status(200).json(
    new ApiResponse(200, courses, "Courses retrieved successfully")
  )
});

const HasSubscribed = asyncHandler(async (req, res) => {
  const{userId, courseId} = req.body
  
  try {
    const subscription = await Subscription.findOne({
      student: userId,
      course: courseId,
    });
  if (!subscription) {
      res.status(200).json(
        new ApiResponse(200, false, "Not Subscribed")
  )
  }
  
  res.status(200).json(
    new ApiResponse(200, true, "Subscribed")
  )
}
catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("username _id avatar");
  res.status(200).json(users);
});


export {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  createPlaylist,
  addVideoToPlayList,
  subscribeToCourse,
  unSubscribeToCourse,
  getAllCourses,
  HasSubscribed,
  getAllUsers
};
