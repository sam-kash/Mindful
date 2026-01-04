import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ingestQueue } from "../queues/ingestQueue.js";
import { refreshGoogleAccessToken } from "../services/googleTokenService.js";
import {
  fetchGmailMessageIds,
  fetchGmailMessage
} from "../services/gmailService.js";

export const syncGmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: "testuser1@mindful2.ai" });

  if (!user?.google?.refreshToken) {
    return res.status(400).json({ message: "Gmail not connected" });
  }

  // Refresh access token
  const { accessToken } = await refreshGoogleAccessToken(
    user.google.refreshToken
  );

  //Fetch message IDs
  const messageIds = await fetchGmailMessageIds(accessToken);

  // Normalize messages
  const items = [];
  for (const msg of messageIds) {
    const item = await fetchGmailMessage(accessToken, msg.id);
    items.push(item);
  }

  //Queue ingestion
  await ingestQueue.add("gmail-sync", {
    userId: user._id,
    items
  });

  res.json({
    message: "Gmail sync queued",
    fetched: items.length
  });
});
