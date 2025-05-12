const express = require('express')
const router = express.Router()
const multer = require('multer');

// Configure multer for memory storage (no disk storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check if the file is a Word document
    if (file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
        const error = new Error('Invalid file type. Only Word documents are allowed.');
        error.code = 'INVALID_FILE_TYPE';
        cb(error, false);
    }
  }
});

const uploadPdf = multer({ storage: storage });


const wordToPdfController = require("../controllers/wordToPdfController")
const pdfToWordController = require("../controllers/pdfToWordController")
router.post('/word-to-pdf',upload.single('document') , wordToPdfController.convert)
router.post('/pdf-to-word',uploadPdf.single('document') , pdfToWordController.convert)

module.exports = router