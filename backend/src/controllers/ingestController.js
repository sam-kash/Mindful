import Item from "../models/Item.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculatePriority, adjustByMode } from "../services/priorityService.js";

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

  res.status(201).json(item);
});
