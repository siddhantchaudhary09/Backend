import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existerUSer = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existerUSer) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const CoverImageLocalPath = req.files?.coverImage[0].path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar field is required");
  }

  const avatar = await UploadOnCloudinary(avatarLocalPath);

  const coverImage = await UploadOnCloudinary(CoverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar field is required");
  }
  //DB ENTRY
  const user = await User.create({
    username,
    fullname,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowercase(),
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken "
  );
  if (!createduser) {
    throw new ApiError(500, "Something went wrong while registering");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createduser, "User registered successfully"));
});

export { registerUser };

/* 
 
get user details 
validation
check if user already exist:username , email
check for images , check for avatar
upload them to utility , avatar check
create user object - create entry in db
remove password and refresh token from response
check for user creation
return res




*/
