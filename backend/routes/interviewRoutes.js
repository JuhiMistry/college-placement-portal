const express = require("express");
const router = express.Router();

const {
  scheduleInterview,
  getMyInterviews,
  getAllInterviews,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Admin
router.post("/", protect, admin, scheduleInterview);
router.get("/all", protect, admin, getAllInterviews);
router.put("/:id", protect, admin, updateInterview);
router.delete("/:id", protect, admin, deleteInterview);

// Student
router.get("/my", protect, getMyInterviews);

module.exports = router;