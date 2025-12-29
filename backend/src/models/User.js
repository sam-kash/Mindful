import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    mode: {
      type:String,
      enum :["busy", "focus" , "relaxed", "all"],
      default : "all"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
