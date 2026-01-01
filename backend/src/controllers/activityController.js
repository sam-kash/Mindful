import Activity from "../models/Activity.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(activities);
});
