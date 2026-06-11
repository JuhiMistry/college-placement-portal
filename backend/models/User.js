const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },

        branch: {
            type: String,
        },

        cgpa: {
            type: Number,
        },

        resumeUrl: {
            type: String,
            default: "",
        },

        skills: [
            {
                type: String,
            },
        ],

        github: {
            type: String,
            default: "",
        },

        linkedin: {
            type: String,
            default: "",
        },

        projects: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);