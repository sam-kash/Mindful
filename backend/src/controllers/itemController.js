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
  const items = await Item.find({ user: req.user.id })
    .sort({ priorityScore: -1 });

  res.json(items);
});
