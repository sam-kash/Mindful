import cron from "node-cron";
import User from "../models/User.js";
import { ingestQueue } from "../queues/ingestQueue.js";
import { refreshGoogleAccessToken } from "../services/googleTokenService.js";
import {
  fetchGmailMessageIds,
  fetchGmailMessage,
  fetchGmailHistory
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

        let items = [];

        // FIRST-TIME SYNC (no historyId yet)
        if (!user.google.historyId) {
          const { messages, historyId } =
            await fetchGmailMessageIds(accessToken);

          for (const msg of messages) {
            const item = await fetchGmailMessage(accessToken, msg.id);
            items.push(item);
          }

          user.google.historyId = historyId;
          await user.save();
        }
        // INCREMENTAL SYNC
        else {
          const { history, historyId } =
            await fetchGmailHistory(accessToken, user.google.historyId);

          for (const h of history) {
            for (const msg of h.messagesAdded || []) {
              const item = await fetchGmailMessage(
                accessToken,
                msg.message.id
              );
              items.push(item);
            }
          }

          user.google.historyId = historyId;
          await user.save();
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
