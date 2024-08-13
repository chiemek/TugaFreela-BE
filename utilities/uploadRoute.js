const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const cloudinary = require("./cloudinaryConfig");
const fs = require("fs");

router.post("/upload", (req, res) => {
  const { firstName, lastName, id, title, rate, description, fileUrl } =
    req.body;

  res.json({
    message: "Profile submitted successfully",
    data: {
      firstName,
      lastName,
      id,
      title,
      rate,
      description,
      fileUrl,
    },
  });
});

module.exports = router;
