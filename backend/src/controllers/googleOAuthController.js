import axios from "axios";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const googleAuthRedirect = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    access_type: "offline",
    prompt: "consent"
    // ❌ NO state here
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
};


export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  const tokenRes = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code"
    }
  );

  const { access_token, refresh_token, expires_in } = tokenRes.data;

  // 🔧 DEV: attach to a fixed test user
  const user = await User.findOne({ email: "testuser1@mindful2.ai" });
  if (!user) {
    return res.status(400).json({ message: "Dev user not found" });
  }

  user.google = {
    accessToken: access_token,
    refreshToken: refresh_token,
    tokenExpiry: new Date(Date.now() + expires_in * 1000)
  };

  await user.save();

  res.json({ message: "Gmail connected successfully (dev mode)" });
});

