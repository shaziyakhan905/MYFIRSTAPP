const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categoryRoutes');
const courseRoutes = require('./courseRoutes');

router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);

module.exports = router;
