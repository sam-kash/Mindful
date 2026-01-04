import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      trim: true
    },

    content: {
      type: String
    },

    priorityScore: {
      type: Number,
      default: 0
    },

    category: {
      type: String,
      enum: ["email", "task", "notification"],
      default: "task"
    },

    source: {
      type: String,
      enum: ["manual", "gmail", "outlook"],
      default: "manual"
    },

    // Used only for external systems (Gmail, Outlook, etc.)
    externalId: {
      type: String
    },

    // State flags
    isArchived: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

itemSchema.index(
  { user: 1, source: 1, externalId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      externalId: { $exists: true, $ne: null }
    }
  }
);

export default mongoose.model("Item", itemSchema);
