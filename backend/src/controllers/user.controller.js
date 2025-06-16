import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  User  from "../models/user.model.js";

// register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password , institution , location , role} = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  const user = await User.create({ username, email, password , institution, location,role});
  const createdUser = await User.findById(user._id).select("-password");
  if(!createdUser) throw new Error("User not created");

  res.status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError("Invalid password", 401);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log(refreshToken);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    if (!loggedInUser) {
        throw new ApiError("User not found", 404);
    }
    const cookieOptions = {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: "lax",
    };

    res.status(200)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, // Return the logged-in user details
                accessToken, // Include the access token in the response
                refreshToken // Include the refresh token in the response
            }, "Login successful"));
});

// logout user
const logoutUser = asyncHandler(async (req, res, next) => {
    // steps
    // 1. Clear refresh token from user
    // 2. Clear cookies for access and refresh tokens
    // 3. Send response

    await User.findByIdAndUpdate(req.user._id, { refreshToken: "" }); // Clear the refresh token in the database
    const cookieOptions = {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: "lax",
    };
    return res
        .status(200)
        .cookie("refreshToken", "", { ...cookieOptions, expires: new Date(0) }) // Clear refresh token cookie
        .cookie("accessToken", "", { ...cookieOptions, expires: new Date(0) }) // Clear access token cookie
        .json(new ApiResponse(200, null, "Logout successful"));
})

// get user by detailes
const getUserDetails = asyncHandler(async (req, res, next) => { 
    // steps
    // 1. Get user details from request object
    // 2. Send response with user details

    const user = req.user; // User is attached to the request object by auth middleware
    // In your backend user controller
    await user.populate("solvedProblems"); // Populate solved problems field with problem documents
    if (!user) {
        throw new ApiError("User not found", 404);
    }
    
    res.status(200)
        .json(new ApiResponse(200, user, "User details retrieved successfully"));
});

// add solved problem into user's database
const addSolvedProblem = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const { problemId } = req.body;
    if (!problemId) {
        throw new ApiError("Problem ID is required", 400);
    }

    // Prevent duplicate entries
    if (!user.solvedProblems.includes(problemId)) {
        user.solvedProblems.push(problemId);
        await user.save();
    }

    res.status(200).json(
        new ApiResponse(200, user, "Solved problem added successfully")
    );
});

const totalProblemsSolved = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ApiError("User not found", 404);
    }
    res.status(200).json(
        new ApiResponse(200, user.solvedProblems.length, "Total problems solved retrieved successfully")
    );
});


export { registerUser, loginUser, logoutUser, getUserDetails, addSolvedProblem,totalProblemsSolved };
