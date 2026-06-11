require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const path = require("path");
const resumeRoutes = require("./routes/resumeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const publicRoutes = require("./routes/publicRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const testEmailRoutes = require("./routes/testEmailRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const offerLetterRoutes = require("./routes/offerLetterRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/test-email", testEmailRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/offer-letter", offerLetterRoutes);

app.get("/", (req, res) => {
    res.send("Placement Portal API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});