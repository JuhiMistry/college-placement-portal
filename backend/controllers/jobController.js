const Job = require("../models/Job");

// Create Job
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    ).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found",
      });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
    const job =
      await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Job Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};