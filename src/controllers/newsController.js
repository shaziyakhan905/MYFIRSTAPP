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
    const newsList = await News.find()
      .populate({
        path: 'categoryId',
        model: 'newsCategory',
        select: '_id name'
      });

    const formattedNews = newsList.map(news => {
      const newsObj = news.toObject();

      // Convert buffer to base64
      let imageBase64 = null;
      if (newsObj.image && newsObj.image.data) {
        imageBase64 = `data:${newsObj.image.contentType};base64,${newsObj.image.data.toString('base64')}`;
      }

      return {
        _id: newsObj._id,
        title: newsObj.title,
        author: newsObj.author,
        description: newsObj.description,
        createdAt: newsObj.createdAt,
        updatedAt: newsObj.updatedAt,
        image: imageBase64,
        category: newsObj.categoryId || null // populated object
      };
    });

    res.status(200).json({ status: 'success', data: formattedNews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};



const getNewsById = async (req, res) => {
  try {
    const newsId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid news ID' });
    }

    const news = await News.findById(newsId)
      .populate({
        path: 'categoryId',
        model: 'newsCategory', // must match model name (not collection)
        select: '_id name'
      });

    if (!news) {
      return res.status(404).json({ status: 'fail', message: 'News not found' });
    }

    // Convert image buffer to base64
    const newsObj = news.toObject();

    if (newsObj.image && newsObj.image.data) {
      newsObj.image = `data:${newsObj.image.contentType};base64,${newsObj.image.data.toString('base64')}`;
    } else {
      newsObj.image = null;
    }

    // Rename populated category
    newsObj.category = newsObj.categoryId;
    delete newsObj.categoryId;

    res.status(200).json({ status: 'success', data: newsObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
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