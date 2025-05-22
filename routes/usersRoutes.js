var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

router.get('/allUsers', userController.getAllUsers);
router.get('/users', userController.getUsers);
router.post('/createUser',userController.createUser);
router.delete('/deleteUser/:id',userController.deleteUser)

module.exports = router