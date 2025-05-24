const express = require("express");
const router = express.Router();

const contactusController = require("../controllers/contactusController")
router.post("/",contactusController.contact);

module.exports = router;