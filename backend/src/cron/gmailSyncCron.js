import cron from "node-cron";
import User from "../models/User.js";
import { ingestQueue } from "../queues/ingestQueue.js";
import { refreshGoogleAccessToken } from "../services/googleTokenService.js";
import {
  fetchGmailMessageIds,
  fetchGmailMessage,
  fetchGmailHistory,
} from "../services/gmailService.js";

export const startGmailSyncCron = () => {
  // Runs every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("[CRON] Gmail sync started");

    //  Only users with a VALID refresh token
    const users = await User.find({
      "google.refreshToken": { $type: "string", $ne: "" },
    });

    for (const user of users) {
      try {
        // 1 Refresh access token
        const { accessToken } = await refreshGoogleAccessToken(
          user.google.refreshToken
        );

        let items = [];
        let newHistoryId = null;

        // 2 FIRST-TIME SYNC
        if (!user.google.historyId) {
          const { messages, historyId } =
            await fetchGmailMessageIds(accessToken);

          for (const msg of messages) {
            const item = await fetchGmailMessage(accessToken, msg.id);
            items.push(item);
          }

          newHistoryId = historyId;
        }

        // 3 INCREMENTAL SYNC
        else {
          const { history, historyId } =
            await fetchGmailHistory(accessToken, user.google.historyId);

          for (const h of history || []) {
            for (const msg of h.messagesAdded || []) {
              const item = await fetchGmailMessage(
                accessToken,
                msg.message.id
              );
              items.push(item);
            }
          }

          newHistoryId = historyId;
        }

        // 4 Queue ingestion if new items exist
        if (items.length > 0) {
          await ingestQueue.add("gmail-sync", {
            userId: user._id,
            items,
          });
        }

        // 5 Update sync metadata ONLY on success
        if (newHistoryId) {
          user.google.historyId = newHistoryId;
          user.google.lastSyncedAt = new Date();
          await user.save();
        }

        console.log(
          `[CRON] Gmail sync successful for ${user.email} (${items.length} items)`
        );
      } catch (err) {
        console.error(
          `[CRON] Gmail sync failed for user ${user.email}`,
          err.message
        );

        const errorCode = err.response?.data?.error;

        //  TERMINAL OAuth failure
        if (errorCode === "invalid_grant") {
          console.warn(
            `[CRON] Invalid grant for ${user.email}. Disconnecting Gmail.`
          );

          user.google.refreshToken = null;
          user.google.accessToken = null;
          user.google.historyId = null;
          user.google.lastSyncedAt = null;
          user.google.connected = false; // if field exists

          await user.save();
        }

        if (err.response?.data) {
          console.error(
            "Error details:",
            JSON.stringify(err.response.data, null, 2)
          );
        }
      }
    }
  });
};
