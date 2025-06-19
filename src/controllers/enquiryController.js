const Enquiry = require('../models/enquiryModel');

// Bulk create enquiries
const createBulkEnquiries = async (req, res) => {
  try {
    const enquiries = req.body.enquiries;

    if (!Array.isArray(enquiries) || enquiries.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Enquiries must be a non-empty array' });
    }

    const createdEnquiries = await Enquiry.insertMany(enquiries);
    res.status(201).json({ status: 'success', data: createdEnquiries });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createBulkEnquiries
};
