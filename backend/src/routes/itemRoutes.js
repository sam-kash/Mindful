import express from "express"
import { createItem, getItems } from "../controllers/itemController.js"
import { protect } from "../middleware/authMiddleware.js";
import { explainItem } from "../controllers/explainController.js";
import { archiveItem, restoreItem, deleteItem } from "../controllers/itemStateController.js";
import { markRead, markUnread } from "../controllers/readStateController.js";

const router = express.Router();

router.post("/", protect, createItem);
router.get("/", protect, getItems);
router.get("/:id/explain" , protect, explainItem)

// Patch methods below 

router.patch("/:id/archive", protect, archiveItem);
router.patch("/:id/restore", protect, restoreItem);
router.patch("/:id/delete", protect, deleteItem);

//Read and unread
router.patch("/:id/read", protect, markRead);
router.patch("/:id/unread", protect, markUnread);

export default router;