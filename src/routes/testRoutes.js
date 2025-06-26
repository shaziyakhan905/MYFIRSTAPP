const express = require('express');
const router = express.Router();
const testController = require("../controllers/testController")
const testAttemptController = require("../controllers/TestAttemptController")

router.post('/createTest', testController.createTest);
router.get('/getSingleTest/:id', testController.getSingleTest);
router.delete('/deleteTest/:id', testController.deleteTest);
router.put('/updateTest/:id', testController.updateTest);
router.post('/createCategory', testController.createCategory);
router.put('/updateTestCategory/:id', testController.updateTestCategory);
router.delete('/deleteTestCategory/:id', testController.deleteTestCategory);
router.get('/getTestCategoryById/:id', testController.getTestCategoryById);
router.post('/submitTset/:testId', testController.submitTest);
router.get('/getAllCategories' ,testController.getAllCategories);
router.get('/alltestWithCategaries/:categoryId' ,testController.getAlltestWithCategaries)
router.get('/user-progress/:userId', testAttemptController.getUserTestHistory); 
router.get('/:testId' ,testController.getAllTestWithQuestion);
router.get('/' ,testController.getAllTests);


module.exports = router