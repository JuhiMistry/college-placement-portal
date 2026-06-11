const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    package: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    eligibilityCGPA: {
      type: Number,
      required: true
    },

    deadline: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Company",
  companySchema
);