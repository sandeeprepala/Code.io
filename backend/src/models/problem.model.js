import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topics: {
    type: [String],
    required: true
  },
  exampleTests: {
    type: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true }
      }
    ],
    required: true
  },
  hiddenTests: {
    type: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true }
      }
    ],
    required: true
  }
});

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
