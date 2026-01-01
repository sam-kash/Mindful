import Item from "../models/Item.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculatePriority, adjustByMode } from "../services/priorityService.js";
import { logActivity } from "../utils/activityLogger.js";
import { ingestQueue } from "../queues/ingestQueue.js";


export const ingestItem = asyncHandler(async (req, res) => {
  const { title, content, category, source, externalId } = req.body;

  const user = await User.findById(req.user.id);

  let score = calculatePriority({ title, content });
  score = adjustByMode(score, user.mode);

  const exists = await Item.findOne({
    user : req.user.id,
    source,
    externalId
  });

  if(exists){
    return res.status(200).json({
        message : "Item already Ingested",
        item: exists
    });
  }

  const item = await Item.create({
    user: req.user.id,
    title,
    content,
    category,
    source,
    externalId,
    priorityScore: Math.min(score, 100)
  });

  await logActivity({
  user: req.user.id,
  item: item._id,
  action: "ingested",
  meta: { source, externalId }
});


  res.status(201).json(item);
});


export const ingestBatch = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  await ingestQueue.add("batch-ingest", {
    userId: req.user.id,
    items
  });

  res.status(202).json({
    message: "Batch ingestion queued",
    count: items.length
  });
});