const mongoose = require('mongoose');
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
      categoryId: new mongoose.Types.ObjectId(categoryId) 
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

// Get All News (with populate + image base64)
const getAllNews = async (req, res) => {
  try {
    const news = await News.aggregate([
      {
        $lookup: {
          from: 'newsCategory', // this must match the actual MongoDB collection name
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          title: 1,
          author: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          image: 1,
          category: {
            _id: '$category._id',
            name: '$category.name'
          }
        }
      }
    ]);

    // Convert image buffer to base64
    const formattedNews = news.map(item => {
      let imageBase64 = null;
      if (item.image && item.image.data) {
        imageBase64 = `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`;
      }

      return {
        _id: item._id,
        title: item.title,
        author: item.author,
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        image: imageBase64,
        category: item.category || null
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