import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: String,
    content: String,
    priorityScore: Number, 
    category: {
      type: String,
      enum: ["email", "task", "notification"],
      default: "task"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
