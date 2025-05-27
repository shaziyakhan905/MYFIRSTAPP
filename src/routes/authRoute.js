var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController')

router.post('/createUser',authController.createUser);
router.post('/login',authController.loginUser);
router.post('/refraseTokan',authController.refresh);

module.exports = router