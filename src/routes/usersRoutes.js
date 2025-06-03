var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const uploadMiddileware = require('../middlewares/uploadMiddleware')


//router.get('/allUsers', userController.getAllUsers);
router.get('/getUserById/:id', userController.getUserById);
router.get('/profile',userController.getUserProfile)
 router.get('/getAllUsers', userController.getUsersWithAddress)
router.delete('/deleteUser/:id',userController.deleteUser)
router.put('/updateUserById/:id',userController.updateUserById)
router.post('/uploadProfile/:id', uploadMiddileware.single('profileImage'), userController.uploadProfileImage);


module.exports = router