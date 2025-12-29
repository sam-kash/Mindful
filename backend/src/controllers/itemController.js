import Item from "../models/Item.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { calculatePriority } from "../services/priorityService.js"
import { adjustByMode } from "../services/priorityService.js";

export const createItem = asyncHandler(async (req, res) => {
    const {title, content, catagory} = req.body;

    const priorityScore = calculatePriority({title, content})
    score = adjustByMode(score, user.ms)

    const item = await Item.create({
        user: req.user.id,
        title,
        content,
        catagory,
        priorityScore: Math.floor(Math.random() * 100)
    });

    res.status(201).json(item);
});

export const getItems = asyncHandler(async (req, res) =>{
    const items = (await Item.find({user : req.user.id})).sort({priorityScore : -1});

    res.json(items);
})