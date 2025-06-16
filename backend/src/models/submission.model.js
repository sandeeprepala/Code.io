import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String, // e.g., 'javascript', 'python', 'cpp', 'java'
      required: true,
    },
    verdict: {
      type: String, // e.g., 'Accepted', 'Wrong Answer', 'Runtime Error'
      required: true,
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    executionTime: {
      type: String, // optional: "0.22s", "1.03s"
    },
    memoryUsed: {
      type: String, // optional: "15MB", "128KB"
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
