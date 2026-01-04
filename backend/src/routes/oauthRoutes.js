import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  googleAuthRedirect,
  googleAuthCallback
} from "../controllers/googleOAuthController.js";

const router = express.Router();

router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export default router;
