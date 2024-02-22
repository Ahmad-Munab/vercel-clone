const express = require("express");
const { deployRepo } = require("../controllers/buildController");
const router = express.Router();

router.route("/deploy").post(deployRepo);

module.exports = router;
