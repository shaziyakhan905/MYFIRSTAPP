const express = require('express');
const router = express.Router();
const testController = require("../controllers/testController")

router.post('/createTest', testController.createTest);
router.post('/createCategory', testController.createCategory);
router.post('/submitTset/:testId', testController.submitTest);
router.get('/getAllCategories' ,testController.getAllCategories);
router.get('/alltestWithCategaries/:categoryId' ,testController.getAlltestWithCategaries)
router.get('/:testId' ,testController.getAllTestWithQuestion);
router.get('/' ,testController.getAllTests);


module.exports = router