import axios from "axios";
import crypto from "crypto"
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import OAuthState from "../models/OAuthState.js";

export const googleAuthRedirect = asyncHandler(async (req, res) => {
  // user must be logged in from frontend
  const userId = req.user.id;

  const state = crypto.randomBytes(32).toString("hex");

  await OAuthState.create({
    user: userId,
    state,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    access_type: "offline",
    prompt: "consent",
    state
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
});

export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;

  const stateDoc = await OAuthState.findOne({ state });
  if (!stateDoc) {
    return res.status(400).json({ message: "Invalid or expired OAuth state" });
  }

  const user = await User.findById(stateDoc.user);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // cleanup state
  await OAuthState.deleteOne({ _id: stateDoc._id });

  // 2 Exchange code → tokens
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

  // 3️ Save tokens
  user.google = {
    accessToken: access_token,
    refreshToken: refresh_token,
    tokenExpiry: new Date(Date.now() + expires_in * 1000)
  };

  await user.save();

  // 4️ Redirect back to frontend
  res.redirect(`${process.env.FRONTEND_URL}/gmail-connected`);
});