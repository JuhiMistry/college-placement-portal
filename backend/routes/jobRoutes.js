const express = require("express");

const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require(
  "../controllers/jobController"
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

// Admin
router.post(
  "/",
  protect,
  admin,
  createJob
);

router.put(
  "/:id",
  protect,
  admin,
  updateJob
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteJob
);

// Student/Admin
router.get(
  "/",
  protect,
  getJobs
);

router.get(
  "/:id",
  protect,
  getJobById
);

module.exports = router;