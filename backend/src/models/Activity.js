import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item"
    },
    action: {
      type: String,
      required: true
      // examples: created, ingested, archived, restored, deleted, read, unread
    },
    meta: {
      type: Object
    }
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
