import Item from "../models/Item.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculatePriority, adjustByMode } from "../services/priorityService.js";
import { logActivity } from "../utils/activityLogger.js";

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

  const user = await User.findById(req.user.id);

  // Build docs with scoring
  const docs = items.map((it) => {
    const base = calculatePriority({
      title: it.title,
      content: it.content
    });
    let score = adjustByMode(base, user.mode);
    score = Number.isFinite(score) ? Math.min(score, 100) : 0;

    return {
      user: req.user.id,
      title: it.title,
      content: it.content,
      category: it.category || "email",
      source: it.source || "gmail",
      externalId: it.externalId,
      priorityScore: score
    };
  });

  // Insert unordered to skip duplicates (unique index handles it)
  const result = await Item.insertMany(docs, { ordered: false });

  res.status(201).json({
    inserted: result.length
  });
});