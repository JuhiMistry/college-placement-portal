const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");

// GET /api/public/stats
router.get("/stats", async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    // Students placed (Selected)
    const studentsPlaced = await Application.countDocuments({ status: "Selected" });
    
    // Placement success rate: percentage of active students placed or shortlisted
    const overallSuccessRate = totalStudents > 0 
      ? Math.round((studentsPlaced / totalStudents) * 100) 
      : 0;

    res.json({
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      studentsPlaced,
      overallSuccessRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/public/jobs (Returns latest 4 jobs)
router.get("/jobs", async (req, res) => {
  try {
    const latestJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("company");
    
    res.json(latestJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
