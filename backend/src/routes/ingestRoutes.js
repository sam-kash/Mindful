import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import {ingestItem} from "../controllers/ingestController.js"

const router = express.Router();

router.post("/",  protect , ingestItem  )

export default router