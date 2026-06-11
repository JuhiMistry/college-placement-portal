const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  uploadOfferLetter,
  getMyOfferLetters,
  getAllOfferLetters,
  updateOfferLetterStatus,
  deleteOfferLetter,
} = require("../controllers/offerLetterController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Admin routes
router.post("/", protect, admin, upload.single("offerLetter"), uploadOfferLetter);
router.get("/", protect, admin, getAllOfferLetters);
router.delete("/:id", protect, admin, deleteOfferLetter);

// Student routes
router.get("/my", protect, getMyOfferLetters);
router.put("/:id/status", protect, updateOfferLetterStatus);

module.exports = router;
