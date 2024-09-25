const express = require("express");
const multer = require("multer");
const { uploadCSV } = require("../controllers/uploadController");

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("file"), uploadCSV);

module.exports = router;
