import Submission from "../models/submission.model.js";
import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Problem from "../models/problem.model.js";
import User from "../models/user.model.js";

// add a new submission
const createSubmission  = asyncHandler(async (req, res) => {
    const { code, language, verdict, passedTestCases, totalTestCases, problemId } = req.body;

  const submission = await Submission.create({
    user: req.user._id,
    problem: problemId,
    code,
    language,
    verdict,
    passedTestCases,
    totalTestCases,
  });

  res.status(201).json(new ApiResponse(201, submission, "Submission saved successfully"));
});

const getSubmissionsByProblem = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

  const submissions = await Submission.find({
    user: req.user._id,
    problem: problemId,
  }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, submissions, "Submissions fetched"));
});

export { createSubmission, getSubmissionsByProblem };