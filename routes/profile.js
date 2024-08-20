const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authenticateJWT = require("../middlewares/auth");
const upload = require("../configs/multer");

router.get("/", authenticateJWT, profileController.getProfile);
router.post(
  "/upload-profile-picture",
  authenticateJWT,
  upload.single("profilePicture"),
  profileController.uploadProfilePicture
);

module.exports = router;
