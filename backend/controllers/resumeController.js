const User = require("../models/User");

exports.uploadResume =
  async (req, res) => {
    try {
      const user =
        await User.findByIdAndUpdate(
          req.user.id,
          {
            resumeUrl:
              req.file.filename,
          },
          {
            new: true,
          }
        );

      res.json({
        message:
          "Resume Uploaded Successfully",
        resume: user.resumeUrl,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };