import Item from "../models/Item.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { explainPriority, adjustByMode } from "../services/priorityService.js";

export const explainItem = asyncHandler(async (req, res) => {
  const item = await Item.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  const user = await User.findById(req.user.id);

  const { score: baseScore, reasons } = explainPriority({
    title: item.title,
    content: item.content
  });

  const adjustedScore = adjustByMode(baseScore, user.mode);

  res.json({
    itemId: item._id,
    baseScore,
    userMode: user.mode,
    adjustedScore,
    reasons
  });
});
