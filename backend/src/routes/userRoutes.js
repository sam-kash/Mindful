import express from "express"
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, (req,res) =>{
    res.json({
        message:"Protected route working ",
        userId: req.user.id
    });
});

export default router;