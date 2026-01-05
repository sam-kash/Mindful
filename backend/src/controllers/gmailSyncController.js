import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ingestQueue } from "../queues/ingestQueue.js";
import { refreshGoogleAccessToken } from "../services/googleTokenService.js";
import {
  fetchGmailMessageIds,
  fetchGmailMessage,
  fetchGmailProfile
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

  // 1. Fetch profile → authoritative historyId
  const { historyId } = await fetchGmailProfile(accessToken);

  // Only save if valid
if (historyId) {
  user.google.historyId = historyId;
  await user.save();
}

  // Save historyId
  user.google.historyId = historyId;
  await user.save();

  // 2. Fetch message IDs (no historyId here)
  const { messages } = await fetchGmailMessageIds(accessToken);

  // Normalize messages
  const items = [];
  for (const msg of messages) {
    const item = await fetchGmailMessage(accessToken, msg.id);
    items.push(item);
  }

  //  Queue ingestion
  await ingestQueue.add("gmail-sync", {
    userId: user._id,
    items
  });

  res.json({
    message: "Gmail sync queued",
    fetched: items.length
  });
});
