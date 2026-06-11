const express = require("express");

const router = express.Router();

const sendEmail =
require("../services/emailService");

router.get("/", async (req, res) => {

  await sendEmail(
    "juhimistry3008@gmail.com",
    "Placement Portal Test",
    "Congratulations! Email Service Working Successfully."
  );

  res.json({
    message: "Test Email Sent",
  });

});

module.exports = router;