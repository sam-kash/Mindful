import Item from "../models/Item.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  calculatePriority,
  adjustByMode
} from "../services/priorityService.js";

export const createItem = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    category,
    source = "manual",
    externalId
  } = req.body;

  // get user & mode
  const user = await User.findById(req.user.id);

  // base + mode-aware priority
  let score = calculatePriority({ title, content });
  score = adjustByMode(score, user.mode);
  score = Number.isFinite(score) ? score : 0;

  const item = await Item.create({
    user: req.user.id,
    title,
    content,
    category,
    source,
    externalId,
    priorityScore: Math.min(score, 100)
  });

  res.status(201).json(item);
});

export const getItems = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const { source, category, minPriority } = req.query;

  const filter = { user: req.user.id };

  if (source) filter.source = source;
  if (category) filter.category = category;
  if (minPriority) filter.priorityScore = { $gte: Number(minPriority) };

  const [items, total] = await Promise.all([
    Item.find(filter)
      .sort({ priorityScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Item.countDocuments(filter)
  ]);

  res.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items
  });
});
