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
    },
    source : {
      type : String,
      enum : ["manual", "gmail", "outlook"],
      default: "manual"
    },
    externalId: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
