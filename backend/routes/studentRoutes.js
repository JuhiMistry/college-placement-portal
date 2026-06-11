const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.get(
  "/dashboard",
  protect,
  async (req, res) => {
    res.json({
      message: "Student Dashboard",
      user: req.user
    });
  }
);

module.exports = router;