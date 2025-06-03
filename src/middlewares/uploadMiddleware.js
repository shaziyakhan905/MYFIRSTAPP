const multer = require('multer');

// Memory storage (store file in buffer)
const storage = multer.memoryStorage();

// File filter for JPG, PNG, PDF only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and JPEG files are allowed'), false);
  }
};

// Limit file size to 1MB
const limits = {
  fileSize: 1 * 1024 * 1024, // 1MB
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
