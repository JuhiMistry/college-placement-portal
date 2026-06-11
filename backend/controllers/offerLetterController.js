const OfferLetter = require("../models/OfferLetter");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const sendEmail = require("../services/emailService");

// Admin upload offer letter
exports.uploadOfferLetter = async (req, res) => {
  try {
    const { student, company, job, salary, joiningDate } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Offer letter PDF file is required" });
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    const offerLetter = await OfferLetter.create({
      student,
      company,
      job,
      salary: Number(salary),
      joiningDate: new Date(joiningDate),
      pdfUrl,
    });

    const studentUser = await User.findById(student);
    const companyObj = await Company.findById(company);
    const jobObj = await Job.findById(job);

    if (studentUser) {
      const companyName = companyObj ? companyObj.companyName : "partner company";
      const jobTitle = jobObj ? jobObj.title : "Role";

      // Create student notification
      await Notification.create({
        user: studentUser._id,
        title: "Offer Letter Released",
        message: `Congratulations! Your offer letter from ${companyName} for ${jobTitle} has been uploaded.`,
      });

      // Send email to student
      await sendEmail(
        studentUser.email,
        "Placement Offer Letter Released",
        `Dear ${studentUser.name},\n\nCongratulations! We are pleased to inform you that your offer letter for the role of ${jobTitle} at ${companyName} has been released. The salary package offered is ${salary} LPA, with a joining date of ${new Date(joiningDate).toLocaleDateString()}.\n\nPlease log in to the College Placement Portal to review and accept/reject your offer.\n\nBest regards,\nPlacement Cell`
      );
    }

    // Populate and return the offer letter
    const populatedOffer = await OfferLetter.findById(offerLetter._id)
      .populate("student")
      .populate("company")
      .populate("job");

    res.status(201).json(populatedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student get my offer letters
exports.getMyOfferLetters = async (req, res) => {
  try {
    const offers = await OfferLetter.find({ student: req.user.id })
      .populate("company")
      .populate("job")
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin get all offer letters
exports.getAllOfferLetters = async (req, res) => {
  try {
    const offers = await OfferLetter.find()
      .populate("student")
      .populate("company")
      .populate("job")
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student accept/reject offer letter
exports.updateOfferLetterStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const offer = await OfferLetter.findById(req.params.id)
      .populate("student")
      .populate("company")
      .populate("job");

    if (!offer) {
      return res.status(404).json({ message: "Offer letter not found" });
    }

    if (offer.student._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    offer.status = status;
    await offer.save();

    // If student accepts, update the application status to 'Selected' as well!
    if (status === "Accepted") {
      const Application = require("../models/Application");
      await Application.findOneAndUpdate(
        { student: req.user.id, job: offer.job._id },
        { status: "Selected" }
      );
    }

    // Notify admins
    const admins = await User.find({ role: "admin" });
    const companyName = offer.company ? offer.company.companyName : "company";
    const jobTitle = offer.job ? offer.job.title : "role";

    for (const adminUser of admins) {
      await Notification.create({
        user: adminUser._id,
        title: `Offer ${status} by Student`,
        message: `Student ${offer.student.name} has ${status.toLowerCase()} the offer for ${jobTitle} at ${companyName}.`,
      });
    }

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin delete/revoke offer letter
exports.deleteOfferLetter = async (req, res) => {
  try {
    const offer = await OfferLetter.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer letter not found" });
    }
    res.json({ message: "Offer letter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
