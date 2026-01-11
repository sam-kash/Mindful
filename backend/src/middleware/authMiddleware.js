import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        console.log("[AuthMiddleware] No token provided");
        return res.status(401).json({ error: "No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("[AuthMiddleware] Token verification failed:", err.message);
        res.status(401).json({ error: "Invalid token" })
    }
};