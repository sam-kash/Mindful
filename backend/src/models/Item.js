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
    },
    isArchived : {
      type: Boolean,
      default : false
    },
    isDeleted: {
      type : Boolean,
      default : false
    }
  },
  { timestamps: true }
);

itemSchema.index({user:1, source : 1, externalId : 1} , {unique: true})

export default mongoose.model("Item", itemSchema);
