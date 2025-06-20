const {newsCategory,News} = require('../models/newsModel');


// get All categaries
const getAllCategories = async (req, res) => {
  try {
    const categories = await newsCategory.find();
    res.status(200).json({ status: 'success', data: categories });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, author, description, categoryId } = req.body;

    const newsData = {
      title,
      author,
      description,
      categoryId
    };

    if (req.file) {
      newsData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const news = await News.create(newsData);
    res.status(201).json({ status: 'success', data: news });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
// get all news 
const getAllNews = async (req, res) => {
  try {
    const newsList = await News.find().populate('categoryId');

    const newsWithBase64Images = newsList.map(news => {
      const newsObj = news.toObject(); // Convert Mongoose document to plain JS object

      if (newsObj.image && newsObj.image.data) {
        newsObj.imageBase64 = `data:${newsObj.image.contentType};base64,${newsObj.image.data.toString('base64')}`;
      } else {
        newsObj.imageBase64 = null;
      }

      delete newsObj.image; // Optional: remove raw buffer field
      return newsObj;
    });

    res.status(200).json({ status: 'success', data: newsWithBase64Images });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


// Get news by ID
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('categoryId');
    if (!news) {
      return res.status(404).json({ status: 'fail', message: 'News not found' });
    }

    const newsObj = news.toObject();
    if (newsObj.image && newsObj.image.data) {
      newsObj.imageBase64 = `data:${newsObj.image.contentType};base64,${newsObj.image.data.toString('base64')}`;
    } else {
      newsObj.imageBase64 = null;
    }

    delete newsObj.image;

    res.status(200).json({ status: 'success', data: newsObj });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Update news
const updateNews = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      categoryId: req.body.categoryId
    };

    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ status: 'success', data: news });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Delete news
const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', message: 'News deleted' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

module.exports = {
getAllCategories,
deleteNews,
updateNews,
createNews,
getAllNews,
getNewsById

}