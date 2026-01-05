import cron from "node-cron";
import User from "../models/User.js";
import { ingestQueue } from "../queues/ingestQueue.js";
import { refreshGoogleAccessToken } from "../services/googleTokenService.js";
import {
  fetchGmailMessageIds,
  fetchGmailMessage
} from "../services/gmailService.js";

export const startGmailSyncCron = () => {
  // runs every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("[CRON] Gmail sync started");

    const users = await User.find({
      "google.refreshToken": { $exists: true }
    });

    for (const user of users) {
      try {
        const { accessToken } = await refreshGoogleAccessToken(
          user.google.refreshToken
        );

        const messageIds = await fetchGmailMessageIds(accessToken);

        const items = [];
        for (const msg of messageIds) {
          const item = await fetchGmailMessage(accessToken, msg.id);
          items.push(item);
        }

        if (items.length > 0) {
          await ingestQueue.add("gmail-sync", {
            userId: user._id,
            items
          });
        }
      } catch (err) {
        console.error(
          `[CRON] Gmail sync failed for user ${user.email}`,
          err.message
        );
      }
    }
  });
};
