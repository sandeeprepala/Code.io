import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubmissionsByProblem , createSubmission } from "../controllers/submission.controller.js";

const submissionRouter = Router();

// Get all submissions for a specific problem
submissionRouter.get("/:problemId", verifyJWT, getSubmissionsByProblem);

// Create a new submission
submissionRouter.post("/", verifyJWT, createSubmission);

export default submissionRouter;