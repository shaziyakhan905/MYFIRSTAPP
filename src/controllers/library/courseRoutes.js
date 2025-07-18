const express = require('express');
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCoursesByCategory,
    getCourseById,
    updateCourse,
    deleteCourse,
    searchCoursesByCategoryTree
} = require('./courseController');

router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/byCategory/:categoryId', getCoursesByCategory);
router.get('/searchByCategory/:categoryId', searchCoursesByCategoryTree);
router.get('/:courseId', getCourseById);
router.put('/:courseId', updateCourse);
router.delete('/:courseId', deleteCourse);

module.exports = router;
