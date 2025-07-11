const mongoose = require('mongoose');

const Test = require('../models/Test');
const Question = require('../models/question');
const Category = require('../models/Category');

const xlsx = require('xlsx');
// Create test and map questions to it
const createTest = async (req, res) => {
  try {
    const { title, description, category, level, questions } = req.body;

    if (!title || !description || !category || !level || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'title, description, category, level, and questions are required' 
      });
    }

    // Step 1: Create the Test with level
    const test = await Test.create({ title, description, category, level });

    // Step 2: Prepare Questions
    const formattedQuestions = questions.map(q => ({
      type: q.type,
      questionText: q.questionText,
      questionContent: q.questionContent,
      options: q.options,
      correctAnswers: q.correctAnswers,
      test: test._id,
      category
    }));

    // Step 3: Insert Questions
    const createdQuestions = await Question.insertMany(formattedQuestions);

    res.status(201).json({
      status: 'success',
      message: 'Test and questions created successfully',
      data: {
        testId: test._id,
        questionCount: createdQuestions.length
      }
    });

  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};


const createTestFromExcel = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ status: 'error', message: 'Title, description, and category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Excel file is required' });
    }

    // Read Excel File
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Excel file is empty or invalid' });
    }

    // Step 1: Create Test
    const test = await Test.create({ title, category,description });

    // Step 2: Prepare Questions
    const questions = jsonData.map(row => {
      const options = row.options ? row.options.split(',').map(opt => opt.trim()) : [];
      const correctAnswers = (() => {
        if (typeof row.correctAnswers === 'string') {
          return row.correctAnswers.split(',').map(ans => parseInt(ans.trim(), 10));
        }
        if (typeof row.correctAnswers === 'number') {
          return [row.correctAnswers];
        }
        if (Array.isArray(row.correctAnswers)) {
          return row.correctAnswers.map(ans => parseInt(ans, 10));
        }
        return [];
      })();

      return {
        type: row.type,
        questionText: row.questionText,
        questionContent: row.questionContent,
        options,
        correctAnswers,
        test: test._id,
        category
      };
    });

    // Step 3: Insert Questions
    const createdQuestions = await Question.insertMany(questions);

    res.status(201).json({
      status: 'success',
      message: 'Test and questions uploaded successfully',
      data: {
        testId: test._id,
        questionCount: createdQuestions.length
      }
    });

  } catch (error) {
    console.error('Error uploading test:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

//update test 
const updateTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const { title, description, category, level, questions } = req.body;

    if (
      !title || 
      !description || 
      !category || 
      !level || 
      !Array.isArray(questions) || 
      questions.length === 0
    ) {
      return res.status(400).json({ status: 'error', message: 'Invalid input. title, description, category, level, and questions are required.' });
    }

    // Update the test with level
    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      { title, description, category, level },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ status: 'error', message: 'Test not found' });
    }

    // Remove old questions
    await Question.deleteMany({ test: testId });

    // Insert updated questions
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
    console.error('Error updating test:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
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
const getAlltestWithCategaries = async (req, res) => {
  try {
    const tests = await Test.find({
      category: req.params.categoryId
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
      level: test.level,
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

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Answers are required' });
    }

    const questions = await Question.find({ test: testId });

    let totalScorableQuestions = 0;
    let correctCount = 0;

    for (const question of questions) {
      if (question.type === 'textarea') continue;

      totalScorableQuestions++;

      const userAnswer = answers.find(a => a.questionId == question._id.toString());
      if (!userAnswer || !Array.isArray(userAnswer.selectedAnswers)) continue;

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
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const evaluateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Answers are required' });
    }

    // Convert string ID to ObjectId
  const objectTestId = new mongoose.Types.ObjectId(testId); // ✅ Correct

    const questions = await Question.find({ test: objectTestId });

    if (!questions || questions.length === 0) {
     
      return res.status(404).json({ status: 'error', message: 'No questions found for this test' });
    }

    let totalScorableQuestions = 0;
    let correctCount = 0;
    const detailedResults = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      // Skip evaluation for textarea-type questions
      if (question.type === 'textarea') continue;

      totalScorableQuestions++;

      // Find user's answer using questionIndex (matching order)
      const userAnswer = answers.find(a => a.questionIndex === i);
      const selectedAnswers = userAnswer?.selectedOptions || [];

      const isCorrect = compareAnswers(question.correctAnswers, selectedAnswers);

      if (isCorrect) correctCount++;

      detailedResults.push({
        questionIndex: i,
        questionText: question.questionText,
        questionContent: question.questionContent || null,
        options: question.options,
        correctAnswers: question.correctAnswers,
        userSelectedAnswers: selectedAnswers,
        isCorrect
      });
    }

    const percentage = totalScorableQuestions === 0
      ? 0
      : (correctCount / totalScorableQuestions) * 100;

    const resultStatus = percentage >= 80 ? 'pass' : 'fail';

    return res.status(200).json({
      status: 'success',
      result: {
        status: resultStatus,
        score: Math.round(percentage * 100) / 100,
        totalQuestions: totalScorableQuestions,
        correctAnswers: correctCount,
        message: resultStatus === 'pass'
          ? 'You passed the test!'
          : 'You failed the test. Minimum 80% required.',
        details: detailedResults
      }
    });

  } catch (error) {
    console.error("Evaluation Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

function compareAnswers(correctAnswers, selectedAnswers) {
  if (!Array.isArray(correctAnswers) || !Array.isArray(selectedAnswers)) {
    return false;
  }

  if (correctAnswers.length !== selectedAnswers.length) {
    return false;
  }

  const sortedCorrect = [...correctAnswers].sort();
  const sortedSelected = [...selectedAnswers].sort();

  return sortedCorrect.every((val, idx) => val == sortedSelected[idx]);
}




module.exports = {
  createTest,
  getAllTests,
  getAlltestWithCategaries,
  createCategory,
  getAllTestWithQuestion,
  submitTest,
  getAllCategories,
  updateTestCategory,
  getTestCategoryById,
  deleteTestCategory,
  updateTest,
  deleteTest,
  getSingleTest,
  createTestFromExcel,
  evaluateTest
}
