const Interview = require("../models/Interview");
const Notification = require("../models/Notification");
const User = require("../models/User");
const sendEmail = require("../services/emailService");

// Admin Schedule Interview
exports.scheduleInterview = async (req, res) => {
  try {
    const interview = await Interview.create(req.body);

    const student = await User.findById(req.body.student);

    // Notification for Student
    if (student) {
      await Notification.create({
        user: student._id,
        title: "Interview Scheduled",
        message: "Your interview has been scheduled. Check your dashboard.",
      });

      // Email to Student
      await sendEmail(
        student.email,
        "Interview Scheduled",
        `Your interview is scheduled on ${req.body.date} at ${req.body.time}.`
      );
    }

    // Notification for Admins (Interview Creation events)
    const admins = await User.find({ role: "admin" });
    const studentName = student ? student.name : "Student";
    for (const adminUser of admins) {
      await Notification.create({
        user: adminUser._id,
        title: "Interview Creation",
        message: `A new interview has been scheduled for student ${studentName}.`,
      });
    }

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Student View Interviews
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      student: req.user.id,
    })
      .populate("job")
      .populate("company");

    res.json(interviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin View All
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("student")
      .populate("job")
      .populate("company")
      .sort({ date: 1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin Update/Reschedule Interview
exports.updateInterview = async (req, res) => {
  try {
    const { date, time, mode, meetingLink, status } = req.body;
    
    let interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const prevStatus = interview.status;

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("student").populate("job").populate("company");

    if (interview.student) {
      const studentUser = interview.student;
      const companyName = interview.company ? interview.company.companyName : "partner company";
      const jobTitle = interview.job ? interview.job.title : "Role";

      let subject = "Interview Rescheduled";
      let text = `Dear ${studentUser.name},\n\nYour interview for the role of ${jobTitle} at ${companyName} has been rescheduled. It is now set for ${date} at ${time}. Mode: ${mode}. Meeting Link: ${meetingLink || "N/A"}.\n\nBest regards,\nPlacement Cell`;
      
      if (status !== prevStatus) {
        subject = `Interview Status Updated: ${status}`;
        text = `Dear ${studentUser.name},\n\nYour interview for the role of ${jobTitle} at ${companyName} status has been updated to "${status}".\n\nDate: ${date}\nTime: ${time}\nMode: ${mode}\nMeeting Link: ${meetingLink || "N/A"}\n\nBest regards,\nPlacement Cell`;
      }

      await Notification.create({
        user: studentUser._id,
        title: subject,
        message: `Your interview for ${jobTitle} at ${companyName} is now: ${status}.`,
      });

      await sendEmail(studentUser.email, subject, text);
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Cancel/Delete Interview
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("student")
      .populate("job")
      .populate("company");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const studentUser = interview.student;
    
    interview.status = "Cancelled";
    await interview.save();

    if (studentUser) {
      const companyName = interview.company ? interview.company.companyName : "partner company";
      const jobTitle = interview.job ? interview.job.title : "Role";

      const subject = "Interview Cancelled";
      const text = `Dear ${studentUser.name},\n\nUnfortunately, your scheduled interview for the role of ${jobTitle} at ${companyName} has been cancelled.\n\nBest regards,\nPlacement Cell`;

      await Notification.create({
        user: studentUser._id,
        title: subject,
        message: `Your interview for ${jobTitle} at ${companyName} has been cancelled.`,
      });

      await sendEmail(studentUser.email, subject, text);
    }

    res.json({ message: "Interview cancelled successfully", interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};