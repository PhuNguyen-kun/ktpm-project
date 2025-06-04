const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const { responseOk, responseError } = require("../utils/apiResponse");
const db = require("../../models");
const JWT_SECRET = process.env.JWT_SECRET;

console.log("Available models:", Object.keys(db));

exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return responseError(res, "Authorization header missing", 401);
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return responseError(res, "Token missing", 401);
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized: Invalid or expired token.",
                });
            }
            req.id = { id: decoded.id };

            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

exports.isLeader = (req, res, next) => {
    if (req.user.role !== 1) {
        return responseError(res, "Require Leader Role!", 403);
    }
    next();
};
