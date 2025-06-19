
const Test = require('../models/Test');
const Question = require('../models/question');
const Category = require('../models/Category');


// Create test and map questions to it
const createTest =  async (req, res) => {
  try {
    const { title, category, questions } = req.body;

    if (!title || !category || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid input' });
    }

    // Step 1: Create Test
    const test = await Test.create({ title, category });
    console.log(test)
    // Step 2: Create Questions with test ID
    const createdQuestions = await Question.insertMany(
      questions.map(q => ({
        ...q,
        test: test._id,
        category
      }))
    );

    res.status(201).json({
      status: 'success',
      message: 'Test and questions created',
      data: {
        testId: test._id,
        questionCount: createdQuestions.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// get all test with categaries
const getAlltestWithCategaries =  async (req, res) => {
  try {
    const tests = await Test.find({ category: req.params.categoryId });
    res.json({ status: 'success', data: tests });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// GET /api/tests/:testId
const getAllTestWithQuestion =  async(req, res) => {
  try {
    const test = await Test.findById(req.params.testId).populate('category', 'name');
    const questions = await Question.find({ test: test._id });

    res.json({
      status: 'success',
      data: {
        test,
        questions
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// create category
const createCategory = async (req, res) => {
  try {
     console.log('req.body:', req.body); 
    const { name } = req.body;
   const category = await Category.create({
      name
     });
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
// get all test

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
    res.json({
      status: 'success',
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;

    const questions = await Question.find({ test: testId });

    let totalScorableQuestions = 0;
    let correctCount = 0;

    for (const question of questions) {
      if (question.type === 'textarea') continue;

      totalScorableQuestions++;

      const userAnswer = answers.find(
        (a) => a.questionId == question._id.toString()
      )
      if (!userAnswer) continue;

      // ✅ Clean and sort both arrays
      const correct = compareAnswers(
        question.correctAnswers,
        userAnswer.selectedAnswers
      );

      if (correct) correctCount++;
    }

    const percentage =
      totalScorableQuestions === 0
        ? 0
        : (correctCount / totalScorableQuestions) * 100;

    if (percentage >= 80) {
      return res.status(200).json({
        status: 'pass',
        score: percentage,
        message: 'You passed the test!'
      });
    } else {
      return res.status(400).json({
        status: 'fail',
        score: percentage,
        message: 'You failed the test. Minimum 80% required.'
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
function compareAnswers(correctArr, selectedArr) {
  if (!Array.isArray(correctArr) || !Array.isArray(selectedArr)) return false;

  const clean = (arr) =>
    arr.map((s) => s.trim().toLowerCase()).sort().join(',');

  return clean(correctArr) === clean(selectedArr);
}

module.exports = {
    createTest,
     getAllTests,
    getAlltestWithCategaries,
    createCategory,
    getAllTestWithQuestion,
    submitTest
}
