const express = require('express')
const router = express.Router()

const wordToPdfController = require("../controllers/wordToPdfController")
router.get('/word-to-pdf' , wordToPdfController.convert)

module.exports = router