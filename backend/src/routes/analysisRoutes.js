const express = require("express");
const multer = require("multer");
const analysisController = require("../controllers/analysisController");

const router = express.Router();

// Memory storage is sufficient for small chat exports
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/analyze", upload.single("chatFile"), analysisController.analyzeChat);

module.exports = router;
