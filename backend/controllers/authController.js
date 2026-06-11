const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, branch, cgpa } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            branch,
            cgpa,
        });

        // Notify admins
        const Notification = require("../models/Notification");
        const admins = await User.find({ role: "admin" });
        for (const adminUser of admins) {
            await Notification.create({
                user: adminUser._id,
                title: "New Student Registration",
                message: `Student ${name} (${branch}, CGPA: ${cgpa}) has registered on the portal.`,
            });
        }

        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                cgpa: user.cgpa
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User Not Found",
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(400).json({
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                cgpa: user.cgpa
            }
        });
    } catch (error) {
    res.status(500).json({
        message: error.message,
    });
}
};