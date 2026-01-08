import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();


router.get("/me", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
}));

router.put(
  "/mode",
  protect,
  asyncHandler(async (req, res) => {
    const { mode } = req.body;

    const user = await User.findById(req.user.id);
    user.mode = mode;
    await user.save();

    res.json({
      message: "User mode updated successfully",
      mode: user.mode
    });
  })
);

router.get("/integrations", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    gmailConnected: Boolean(user.google?.refreshToken),
    lastSyncedAt: user.google?.lastSyncedAt || null
  });
}));

    

export default router;