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
console.log("Ingest Worker started");


//Deterministic mapping (MVP-locked)
function mapScoreToUrgency(score) {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}

// Simple, explainable reason (will improve in Step 2)
function getReasonFromUrgency(urgency) {
  if (urgency === "high") return "Requires immediate attention";
  if (urgency === "medium") return "Important but not urgent";
  return "Can wait";
}


new Worker(
  "ingest-queue",
  async (job) => {
    console.log("Processing job", job.id);

    const { userId, items } = job.data;

    const user = await User.findById(userId);
    if (!user) return;

    const docs = [];

    for (const it of items) {
      //  Deduplication
      if (it.externalId && it.source) {
        const exists = await Item.findOne({
          user: userId,
          source: it.source,
          externalId: it.externalId
        });

        if (exists) continue;
      }


      let score = calculatePriority({
        title: it.title,
        content: it.content
      });

      score = adjustByMode(score, user.mode);
      score = Number.isFinite(score) ? Math.min(score, 100) : 0;


      const urgency = mapScoreToUrgency(score);
      const reason = getReasonFromUrgency(urgency);


      docs.push({
        user: userId,
        title: it.title,
        content: it.content,
        category: it.category || "email",
        source: it.source || "gmail",
        externalId: it.externalId,

        // 🔥 MVP CONTRACT
        urgency,     // "high" | "medium" | "low"
        reason,      // single, clear explanation

        // internal (keep for now)
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
