const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, branch, cgpa, password } = req.body;
    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (branch !== undefined) updateFields.branch = branch;
    if (cgpa !== undefined) updateFields.cgpa = cgpa;

    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};