const Company = require("../models/Company");

exports.createCompany = async (
  req,
  res
) => {
  try {
    const company = await Company.create(
      req.body
    );

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.getCompanies = async (
  req,
  res
) => {
  try {
    const companies =
      await Company.find();

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Update Company
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found"
      });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Delete Company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(
      req.params.id
    );

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found"
      });
    }

    res.json({
      message: "Company Deleted Successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};