
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
//update test 
const updateTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const { title, category, questions } = req.body;

    if (!title || !category || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid input' });
    }

    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      { title, category },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ status: 'error', message: 'Test not found' });
    }

    await Question.deleteMany({ test: testId });

    await Question.insertMany(
      questions.map(q => ({
        ...q,
        test: testId,
        category
      }))
    );

    res.json({
      status: 'success',
      message: 'Test and questions updated successfully'
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

//delete test
const deleteTest = async (req, res) => {
  try {
    const testId = req.params.id;

    await Question.deleteMany({ test: testId });

    const deletedTest = await Test.findByIdAndDelete(testId);

    if (!deletedTest) {
      return res.status(404).json({ status: 'error', message: 'Test not found' });
    }

    res.json({
      status: 'success',
      message: 'Test and related questions deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// get single test
const getSingleTest = async (req, res) => {
  try {
    const testId = req.params.id;

    const test = await Test.findById(testId).populate('category', 'name').lean();

    if (!test) {
      return res.status(404).json({ status: 'error', message: 'Test not found' });
    }

    const questions = await Question.find({ test: testId }).lean();

    res.json({
      status: 'success',
      data: {
        ...test,
        questions
      }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};



// get all test with categaries
const getAlltestWithCategaries =  async (req, res) => {
  try {
    const tests = await Test.find({ category: req.params.categoryId 
    }).populate('category', 'name');;
    res.json({ status: 'success', data: tests });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// GET /api/tests/:testId
const getAllTestWithQuestion = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).populate('category', 'name');
    const questions = await Question.find({ test: test._id });

    // Remove `correctAnswerIndex` from each question in the response
    const sanitizedQuestions = questions.map(q => {
      const { correctAnswerIndex, ...rest } = q.toObject(); // convert to plain object and exclude correctAnswerIndex
      return rest;
    });

    res.json({
      status: 'success',
      data: {
        test,
        questions: sanitizedQuestions
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


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
// update Category
const updateTestCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Category name is required' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }

    res.json({ status: 'success', data: updatedCategory });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

//delete categaroy
const deleteTestCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }

    res.json({ status: 'success', message: 'Category deleted successfully' });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

//getsingle categarory
const getTestCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }

    res.json({ status: 'success', data: category });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// get all test

const getAllTests = async (req, res) => {
  try {
    // Get all tests with category populated
    const tests = await Test.find()
      .populate({ path: 'category', select: 'name' }) // populate only category name
      .lean();

    // Get all test IDs
    const testIds = tests.map(test => test._id);

    // Get all questions for those tests
    const questions = await Question.find({ test: { $in: testIds } })
      .select('-correctAnswers') // exclude correctAnswers
      .lean();

    // Group questions by testId
    const questionMap = {};
    for (const q of questions) {
      const testId = q.test.toString();
      if (!questionMap[testId]) {
        questionMap[testId] = [];
      }
      questionMap[testId].push(q);
    }

    // Attach questions and category name to tests
    const testsWithQuestions = tests.map(test => ({
      _id: test._id,
      title: test.title,
      category: test.category ? test.category.name : 'N/A', // Use category name or N/A
      questions: questionMap[test._id.toString()] || []
    }));

    res.json({
      status: 'success',
      count: testsWithQuestions.length,
      data: testsWithQuestions
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

      const userAnswer = answers.find(a => a.questionId == question._id.toString());
      if (!userAnswer) continue;

      const correct = compareAnswers(
        question.correctAnswers,
        userAnswer.selectedAnswers
      );

      if (correct) correctCount++;
    }

    const percentage = totalScorableQuestions === 0
      ? 0
      : (correctCount / totalScorableQuestions) * 100;

    const resultStatus = percentage >= 80 ? 'pass' : 'fail';

    return res.status(200).json({
      status: resultStatus,
      score: percentage,
      message: resultStatus === 'pass'
        ? 'You passed the test!'
        : 'You failed the test. Minimum 80% required.'
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

function compareAnswers(correctArr, selectedArr) {
  if (!Array.isArray(correctArr) || !Array.isArray(selectedArr)) return false;

  const clean = arr =>
    arr.map(s => s.trim().toLowerCase()).sort().join(',');

  return clean(correctArr) === clean(selectedArr);
}

const getCompletedTestsByUserId = async (req, res) => {
  const { userId } = req.params;
  const submissions = await TestSubmission.find({ user: userId });
  const completedTestIds = submissions.map(s => s.test.toString());
  res.json({ data: completedTestIds });
};


module.exports = {
    createTest,
     getAllTests,
    getAlltestWithCategaries,
    createCategory,
    getAllTestWithQuestion,
    submitTest,
    getAllCategories,
    getCompletedTestsByUserId,
    updateTestCategory,
    getTestCategoryById,
    deleteTestCategory,
    updateTest,
    deleteTest,
    getSingleTest
}
