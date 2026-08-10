const express = require("express");
const router = express.Router();

const summaryController = require("../controller/summary.controller");

router.post("/generate-summary", summaryController.generateSummary);

module.exports = router;