import express from "express"
import { syncGmail } from "../controllers/gmailSyncController.js"

const router = express.Router();

router.post("/sync" , syncGmail);

export default router;