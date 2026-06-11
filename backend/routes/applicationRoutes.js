const express = require("express");

const router = express.Router();

const {
  applyJob,
  getMyApplications,
  getAllApplications,
  updateStatus,
} = require(
  "../controllers/applicationController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  admin,
} = require(
  "../middleware/adminMiddleware"
);

// Student
router.post(
  "/",
  protect,
  applyJob
);

router.get(
  "/my",
  protect,
  getMyApplications
);

// Admin
router.get(
  "/",
  protect,
  admin,
  getAllApplications
);

router.put(
  "/:id",
  protect,
  admin,
  updateStatus
);

module.exports = router;