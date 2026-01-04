import connectDB from "../config/db.js";
import { Worker } from "bullmq";
import redis from "../config/redis.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import {
  calculatePriority,
  adjustByMode
} from "../services/priorityService.js";

await connectDB();

console.log("Ingest Worker started")

new Worker(
  "ingest-queue",
  async (job) => {

    console.log("Processing job" , job.id);

    const { userId, items } = job.data;

    const user = await User.findById(userId);
    if (!user) return;

    const docs = [];

    for (const it of items) {
      if (it.externalId && it.source) {
        const exists = await Item.findOne({
          user: userId,
          source: it.source,
          externalId: it.externalId
        });

        if (exists) continue; // skip duplicates
      }

      let score = calculatePriority({
        title: it.title,
        content: it.content
      });

      score = adjustByMode(score, user.mode);
      score = Number.isFinite(score) ? Math.min(score, 100) : 0;

      docs.push({
        user: userId,
        title: it.title,
        content: it.content,
        category: it.category || "email",
        source: it.source || "gmail",
        externalId: it.externalId,
        priorityScore: score
      });
    }

    if (docs.length > 0) {
      await Item.insertMany(docs, { ordered: false });
    }
  },
  {
    connection: redis,
    concurrency: 5 
  }
);
