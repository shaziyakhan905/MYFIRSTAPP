const TestAttempt = require('../models/TestAttempt');

const recordTestAttempt = async (req, res) => {
  try {
    const { testId, score, status } = req.body;
    const userId = req.user.userId; // Assuming userId is available from auth middleware

    const attempt = new TestAttempt({ userId, testId, score, status });
    await attempt.save();

    res.json({ status: 'success', message: 'Test attempt recorded' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getUserTestHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const history = await TestAttempt.find({ userId })
      .populate('testId', 'title')
      .sort({ attemptedAt: -1 });

    res.json({ status: 'success', count: history.length, data: history });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
recordTestAttempt,
getUserTestHistory
}

