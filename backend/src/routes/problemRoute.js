import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllProblems,getProblemById ,createProblem} from "../controllers/problems.controller.js";
import { addSolvedProblem } from "../controllers/user.controller.js";

const problemRouter = Router();

// Get all problems
problemRouter.route("/").get(verifyJWT , getAllProblems);

// Get a specific problem by ID
problemRouter.route("/:id").get(verifyJWT , getProblemById);

// Create a new problem
problemRouter.route("/").post(verifyJWT,isAdmin,createProblem);

problemRouter.route("/solved").post(verifyJWT, addSolvedProblem);


export default problemRouter;