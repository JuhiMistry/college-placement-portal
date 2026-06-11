const express = require("express");

const router = express.Router();

const {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

const {
  protect
} = require("../middleware/authMiddleware");

const {
  admin
} = require("../middleware/adminMiddleware");

router.post(
  "/",
  protect,
  admin,
  createCompany
);

router.get(
  "/",
  protect,
  getCompanies
);

router.put(
  "/:id",
  protect,
  admin,
  updateCompany
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteCompany
);

module.exports = router;