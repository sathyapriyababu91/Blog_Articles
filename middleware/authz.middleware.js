const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token not found" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        req.user = decoded; // Optional: store full payload

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized: Invalid token"
        });
    }
};

module.exports = authMiddleware;