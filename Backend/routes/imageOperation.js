const express = require("express");
const multer = require('multer');


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// compress
const compressImageController = require("../controllers/compressImageController")
router.post("/compress-image",upload.single('image'),compressImageController.compress);

// enhance
const imageEnhancementController = require("../controllers/imageEnhancementController")
router.post("/enhance-image",upload.single('image'),imageEnhancementController.enhancement)

// format convert
const imageFormatConvert = require("../controllers/imageFormatConvert")
router.post("/format-change",upload.single('image'),imageFormatConvert.convert)

const imageToPdfConvertController = require("../controllers/imageToPdfConvertController")
router.post("/image-to-pdf",upload.array('image',2000),imageToPdfConvertController.convert)

module.exports = router;