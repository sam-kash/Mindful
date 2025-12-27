import express from "express"
import { createItem, getItems } from "../controllers/itemController.js"
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createItem);
router.get("/", protect, getItems);

export default router;