require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {

    const adminExists = await User.findOne({
      email: "admin@placement.com",
    });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash("123456", 10);

    await User.create({
      name: "Admin",
      email: "admin@placement.com",
      password: hashedPassword,
      role: "admin",
      branch: "Administration",
      cgpa: 10,
    });

    console.log(
      "Admin Created Successfully"
    );

    process.exit();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

createAdmin();