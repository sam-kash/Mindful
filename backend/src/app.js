import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import {errorHandler} from "./utils/errorHandler.js"
import itemRoutes from "./routes/itemRoutes.js";
import ingestRoutes from "./routes/ingestRoutes.js"
//import Activity from "./models/Activity.js";
import activityRoutes from "./routes/activityRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import gmailRoutes from "./routes/gmailRoutes.js"
import healthRoutes from "./routes/healthRoutes.js";
import { authLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);
app.use("/api/items", itemRoutes)
app.use("/api/ingest" , ingestRoutes);
app.use("/api/activity" , activityRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/gmail" , gmailRoutes);
app.use("/api/health" , healthRoutes)

app.use("/api/auth", authLimiter);
app.use("/api/oauth", authLimiter);

// Adding a health route to test backend for development purpose

app.get("/", (req, res) =>{
    res.send("mindful backend is running")
});

export default app;
