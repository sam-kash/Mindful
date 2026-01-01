import Item from "../models/Item.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activityLogger.js";


export const markRead = asyncHandler(async (req, res) => {
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }
    await logActivity({
    user: req.user.id,
    item: item._id,
    action: "read"
  });

  res.json({ message: "Item marked as read" });
});

export const markUnread = asyncHandler(async (req, res) => {
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isRead: false, readAt: null },
    { new: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

    await logActivity({
    user: req.user.id,
    item: item._id,
    action: "read"
  });

  res.json({ message: "Item marked as unread" });
});
