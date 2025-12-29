import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

/* ✅ existing route — KEEP */
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Protected route working",
    userId: req.user.id
  });
});

/* 🔥 NEW route — ADD THIS */
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

export default router;
