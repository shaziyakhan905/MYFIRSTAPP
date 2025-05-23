var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

//router.get('/allUsers', userController.getAllUsers);
router.get('/getUserById/:id', userController.getUserById);
router.post('/createUser',userController.createUser);
 router.get('/getAllUsers', userController.getUsersWithAddress)
router.delete('/deleteUser/:id',userController.deleteUser)
router.put('/updateUserById/:id',userController.updateUserById)

module.exports = router