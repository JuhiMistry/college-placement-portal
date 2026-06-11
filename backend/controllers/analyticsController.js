const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

exports.getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();

    const shortlistedStudents = await Application.countDocuments({
      status: "Shortlisted",
    });

    const selectedStudents = await Application.countDocuments({
      status: "Selected",
    });

    const placementRate = totalStudents > 0 
      ? Math.round((selectedStudents / totalStudents) * 100) 
      : 0;

    // Monthly applications aggregation
    const monthlyApplications = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyApps = monthNames.map((name, index) => {
      const found = monthlyApplications.find(item => item._id === (index + 1));
      return {
        month: name,
        applications: found ? found.count : 0
      };
    });

    // Monthly interviews aggregation
    const monthlyInterviews = await Interview.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formattedMonthlyInterviews = monthNames.map((name, index) => {
      const found = monthlyInterviews.find(item => item._id === (index + 1));
      return {
        month: name,
        interviews: found ? found.count : 0
      };
    });

    // Placements by branch
    const branchPlacements = await Application.aggregate([
      { $match: { status: "Selected" } },
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $group: {
          _id: "$studentInfo.branch",
          placed: { $sum: 1 }
        }
      }
    ]);

    const branchStudentCounts = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: "$branch",
          total: { $sum: 1 }
        }
      }
    ]);

    const formattedBranchStats = branchStudentCounts.map(b => {
      const placedObj = branchPlacements.find(p => p._id === b._id);
      const placed = placedObj ? placedObj.placed : 0;
      const rate = b.total > 0 ? Math.round((placed / b.total) * 100) : 0;
      return {
        branch: b._id || "Other",
        total: b.total,
        placed: placed,
        rate: rate
      };
    });

    // Selections by company
    const companyHiring = await Application.aggregate([
      { $match: { status: "Selected" } },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "jobInfo"
        }
      },
      { $unwind: "$jobInfo" },
      {
        $lookup: {
          from: "companies",
          localField: "jobInfo.company",
          foreignField: "_id",
          as: "companyInfo"
        }
      },
      { $unwind: "$companyInfo" },
      {
        $group: {
          _id: "$companyInfo.companyName",
          selections: { $sum: 1 }
        }
      },
      { $sort: { selections: -1 } },
      { $limit: 10 }
    ]);

    const formattedCompanyHiring = companyHiring.map(c => ({
      company: c._id,
      selections: c.selections
    }));

    res.json({
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalInterviews,
      shortlistedStudents,
      selectedStudents,
      placementRate,
      monthlyApplications: formattedMonthlyApps,
      interviewTrends: formattedMonthlyInterviews,
      branchStats: formattedBranchStats,
      companyHiring: formattedCompanyHiring
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};