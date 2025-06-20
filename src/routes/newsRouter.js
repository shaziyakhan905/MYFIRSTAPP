const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const uploadMiddileware = require('../middlewares/uploadMiddleware')

router.get('/getAllcategory', newsController.getAllCategories);
router.get('/getAllNews', newsController.getAllNews);
router.get('/getNewsById/:id', newsController.getNewsById);
router.post('/createNews', uploadMiddileware.single('image'), newsController.createNews);
router.put('/updateNewsById/:id', uploadMiddileware.single('image'), newsController.updateNews);
router.delete('/deleteNewsById/:id', newsController.deleteNews);

module.exports = router;