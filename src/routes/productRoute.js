const express = require('express');
const router = express.Router();
// const upload = require('../middlewares/upload');
const  productController  = require('../controllers/productController');
const uploadMiddileware = require('../middlewares/uploadMiddleware')

router.post('/createProduct', uploadMiddileware.single('productImage'),productController.createProduct);
router.get('/allProduct', productController.getAllProduct);
router.get('/getProductById/:id', productController.getProductById);
router.put('/updateProductById/:id', productController.getUpdateById);
router.delete('/deleteProductById/:id',  productController.getDeleteProductById);

module.exports = router;