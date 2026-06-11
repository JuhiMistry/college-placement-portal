const express = require("express");

const router = express.Router();

const {
    protect
} = require("../middleware/authMiddleware");

const {
    admin
} = require("../middleware/adminMiddleware");

const {
    getAnalytics,
} = require(
    "../controllers/analyticsController"
);

const User = require("../models/User");

router.get(
    "/dashboard",
    protect,
    admin,
    async (req, res) => {
        res.json({
            message: "Admin Dashboard"
        });
    }
);

router.get(
    "/analytics",
    protect,
    admin,
    getAnalytics
);

router.get(
    "/students",
    protect,
    admin,
    async (req, res) => {
        try {
            const students = await User.find({ role: "student" }).select("-password").sort({ name: 1 });
            res.json(students);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;