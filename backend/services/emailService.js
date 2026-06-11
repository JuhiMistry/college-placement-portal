const nodemailer = require("nodemailer");

const transporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },

        tls: {
            rejectUnauthorized: false,
        },
    });
const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

        console.log("Email Sent Successfully");
        console.log(info);
    } catch (error) {
        console.log("EMAIL ERROR:");
        console.log(error);
    }
};

module.exports = sendEmail;