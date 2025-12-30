import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import {ingestItem, ingestBatch} from "../controllers/ingestController.js"

const router = express.Router();

router.post("/",  protect , ingestItem  )
router.post("/batch", protect , ingestBatch)

export default router