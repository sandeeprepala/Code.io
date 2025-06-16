import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Problem from "../models/problem.model.js";
import User from "../models/user.model.js";

// Create a new problem
const createProblem = asyncHandler(async (req, res) => {
  const { title, description, difficulty, topics ,exampleTests,hiddenTests } = req.body;
    if (!title || !description || !difficulty || !exampleTests) {
  throw new ApiError(400, "Missing required fields");
}

  const newProblem = new Problem({ title, description, difficulty, topics,exampleTests ,hiddenTests});
  await newProblem.save();

  res.status(201).json(new ApiResponse(201, newProblem, "New problem created"));
});

// Get all problems
// const getAllProblems = asyncHandler(async (req, res) => {
//    const problems = await Problem.find({});
//    res.status(200).json(new ApiResponse(200,problems, "All problems retrieved"));
//  });
const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await Problem.find({}); // Add .select(...) if you want specific fields
  const user = req.user;
  let solvedProblems = [];

  if (user?.id) {
    const dbUser = await User.findById(user.id).select("solvedProblems");
    if (dbUser) {
      solvedProblems = dbUser.solvedProblems || [];
    }
  }

  res.status(200).json(
    new ApiResponse(200, { problems, solvedProblems }, "Problems fetched successfully")
  );
});





// Get problem by ID
const getProblemById = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    throw new ApiError("Problem not found", 404);
  }

  let solved = false;
  if (req.user) {
    const user = await User.findById(req.user._id);
    solved = user?.solvedProblems?.includes(problem._id);
  }

  res.status(200).json(
    new ApiResponse(200, { ...problem.toObject(), solved }, "Problem fetched")
  );
});

export { getAllProblems, getProblemById, createProblem };

