const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/contact", require("./contact"));
router.use("/profile", require("./profile"));
router.use("/user", require("./user"));

module.exports = router;
