const Notice = require('../models/noticeModel')

const createNotice = async (req, res) => {
  try {
    const { title, message, createdBy, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ status: 'fail', message: 'Title and message are required' });
    }

    const notice = await Notice.create({
      title,
      message,
      type: type || 'general',
      createdBy: createdBy || 'Admin'
    });

    return res.status(201).json({ status: 'success', notice });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET all notices
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({ status: 'success', notices });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// GET single notice by ID
const getNoticeById = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).json({ status: 'error', message: 'Notice not found' });
    }

    res.status(200).json({ status: 'success', notice });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// DELETE notice by ID
const deleteNoticeById = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const deletedNotice = await Notice.findByIdAndDelete(noticeId);

    if (!deletedNotice) {
      return res.status(404).json({ status: 'error', message: 'Notice not found' });
    }

    res.status(200).json({ status: 'success', message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// UPDATE notice by ID
const updateNoticeById = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const updatedData = req.body;

    const updatedNotice = await Notice.findByIdAndUpdate(
      noticeId,
      updatedData,
      { new: true, runValidators: true } // return updated doc, enforce schema
    );

    if (!updatedNotice) {
      return res.status(404).json({ status: 'error', message: 'Notice not found' });
    }

    res.status(200).json({ status: 'success', notice: updatedNotice });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
    createNotice,
    getAllNotices,
    getNoticeById,
    deleteNoticeById,
    updateNoticeById
}