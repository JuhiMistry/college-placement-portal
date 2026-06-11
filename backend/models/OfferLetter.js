const mongoose = require("mongoose");

const offerLetterSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    salary: {
      type: Number, // In LPA (Lakhs Per Annum)
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OfferLetter", offerLetterSchema);
