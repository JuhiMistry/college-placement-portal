const Application = require("../models/Application");
const Notification = require("../models/Notification");

// Student Apply Job
exports.applyJob = async (req, res) => {
  try {
    const { job } = req.body;

    const existingApplication =
      await Application.findOne({
        student: req.user.id,
        job,
      });

    if (existingApplication) {
      return res.status(400).json({
        message:
          "Already Applied For This Job",
      });
    }

    const application =
      await Application.create({
        student: req.user.id,
        job,
      });
    await Notification.create({
      user: req.user.id,

      title: "Application Submitted",

      message:
        "Your application has been submitted successfully.",
    });

    // Notify admins
    const Job = require("../models/Job");
    const User = require("../models/User");
    const jobObj = await Job.findById(job).populate("company");
    const studentUser = await User.findById(req.user.id);
    if (jobObj && studentUser) {
      const admins = await User.find({ role: "admin" });
      const companyName = jobObj.company ? jobObj.company.companyName : "company";
      for (const adminUser of admins) {
        await Notification.create({
          user: adminUser._id,
          title: "New Application Submission",
          message: `Student ${studentUser.name} applied for job "${jobObj.title}" at ${companyName}.`,
        });
      }
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMyApplications =
  async (req, res) => {
    try {
      const applications =
        await Application.find({
          student: req.user.id,
        })
          .populate("job")
          .populate("student");

      res.json(applications);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.getAllApplications =
  async (req, res) => {
    try {
      const applications =
        await Application.find()
          .populate("student")
          .populate({
            path: "job",
            populate: {
              path: "company",
            },
          });

      res.json(applications);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.updateStatus =
  async (req, res) => {
    try {

      const application =
        await Application.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,
          },
          {
            new: true,
          }
        );

      if (
        req.body.status ===
        "Shortlisted"
      ) {
        await Notification.create({
          user:
            application.student,

          title:
            "Application Shortlisted",

          message:
            "Congratulations! You have been shortlisted.",
        });
      }

      if (
        req.body.status ===
        "Rejected"
      ) {
        await Notification.create({
          user:
            application.student,

          title:
            "Application Rejected",

          message:
            "Unfortunately your application was not selected.",
        });
      }

      res.json(
        application
      );

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };