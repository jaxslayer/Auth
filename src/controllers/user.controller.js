import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary as upload } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const registerUser = AsyncHandler(async (req, res) => {
  const { username, fullName, email, password, confirmPassword } = req.body;
  if (
    [username, fullName, email, password, confirmPassword].some(
      (field) => field.trim() == ""
    )
  )
    throw new ApiError(400, "All field must be field");
  const userExist = await User.findOne({
    $or: [{ username }, { password }, { email }],
  });
  if (userExist) throw new ApiError(400, "The user already exist");
  if (password != confirmPassword)
    throw new ApiError(400, "Passwords do not match");
  const filepath = req.file?.path;
  if (!filepath) throw new ApiError(400, "Avatar not entered");
  const avatar = await upload(filepath);
  if (!avatar)
    throw new ApiError(500, "Something went wrong while uploading the file");
  const user = await User.create({
    username,
    fullName,
    email,
    password,
    avatar: avatar.url,
  });
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser)
    throw new ApiError(500, "Something ewnt wrong while registring user");
  const accessToken = await createdUser.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("access token", accessToken, options)
    .json(new ApiResponse(201, createdUser, "User created succesfully"));
});

const loginUser = AsyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if ([username, password].some((field) => field.trim() == ""))
    throw new ApiError(400, "Username or Password Not entered");
  const user = await User.findOne({ username });
  if (!user) throw new ApiError(400, "User does not exist");
  const isPassword = await user.isPasswordCorrect(password);
  if (!isPassword) throw new ApiError(400, "Password doesnot match");
  const loggedUser = await User.findById(user._id).select("-password");
  const accessToken = await loggedUser.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        201,
        { loggedUser, accessToken },
        "User logged in succesfully"
      )
    );
});

export { registerUser, loginUser };
