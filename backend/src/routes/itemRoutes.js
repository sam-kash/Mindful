import express from "express"
import { createItem, getItems } from "../controllers/itemController.js"
import { protect } from "../middleware/authmiddleware.js";
import { explainItem } from "../controllers/explainController.js";

const router = express.Router();

router.post("/", protect, createItem);
router.get("/", protect, getItems);
router.get("/:id/explain" , protect, explainItem)

export default router;