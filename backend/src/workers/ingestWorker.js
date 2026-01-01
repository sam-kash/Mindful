import { Worker } from "bullmq";
import redis from "../config/redis.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import {
  calculatePriority,
  adjustByMode
} from "../services/priorityService.js";

console.log("Ingest worker started")

new Worker(
  "ingest-queue",
  async (job) => {
    const { userId, items } = job.data;

    const user = await User.findById(userId);

    const docs = items.map((it) => {
      let score = calculatePriority({
        title: it.title,
        content: it.content
      });

      score = adjustByMode(score, user.mode);

      return {
        user: userId,
        title: it.title,
        content: it.content,
        category: it.category,
        source: it.source,
        externalId: it.externalId,
        priorityScore: Math.min(score, 100)
      };
    });

    await Item.insertMany(docs, { ordered: false });
  },
  { connection: redis }
);
