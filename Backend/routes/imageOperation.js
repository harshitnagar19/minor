const express = require("express");
const multer = require('multer');


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const compressImageController = require("../controllers/compressImageController")
router.post("/compress-image",upload.single('image'),compressImageController.compress);

module.exports = router;