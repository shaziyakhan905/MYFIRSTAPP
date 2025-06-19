const express = require("express")
const router = express.Router()
const enquiryController = require('../controllers/enquiryController')

router.post('/bulk/createEnquiry',enquiryController.createBulkEnquiries)

module.exports = router