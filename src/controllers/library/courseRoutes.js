const express = require('express');
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCoursesByCategory,
    getCourseById,
    updateCourse,
    deleteCourse
} = require('./courseController');

router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/byCategory/:categoryId', getCoursesByCategory);
router.get('/:courseId', getCourseById);
router.put('/:courseId', updateCourse);
router.delete('/:courseId', deleteCourse);

module.exports = router;
