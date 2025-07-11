const express = require('express');
const router = express.Router();

const {
    getCategoryTree,
    getCategoryChildren,
    getCategoryTreeById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('./libraryController');

router.get('/allCategoryTree', getCategoryTree);
router.get('/:categoryId/children', getCategoryChildren);
router.get('/:categoryId/tree', getCategoryTreeById);
router.post('/', createCategory);
router.put('/:categoryId', updateCategory);
router.delete('/:categoryId', deleteCategory);

module.exports = router;
