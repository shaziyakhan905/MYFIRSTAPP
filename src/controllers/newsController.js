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
const mongoose = require('mongoose');
const getAllNews = async (req, res) => {
  try {
    const news = await News.aggregate([
      {
        $lookup: {
          from: 'newscategories', // must match the actual collection name in MongoDB
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
          category: {
            _id: '$category._id',
            name: '$category.name'
          },
          image: 1 // include raw buffer to convert later
        }
      }
    ]);

    // Convert image buffer to base64
    const formattedNews = news.map(n => {
      let imageBase64 = null;
      if (n.image && n.image.data) {
        imageBase64 = `data:${n.image.contentType};base64,${n.image.data.toString('base64')}`;
      }

      return {
        _id: n._id,
        title: n.title,
        author: n.author,
        description: n.description,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
        image: imageBase64,
        category: n.category || null
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

    const newsResult = await News.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(newsId)
        }
      },
      {
        $lookup: {
          from: 'newscategories', // ✅ match actual collection name
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
          category: {
            _id: '$category._id',
            name: '$category.name'
          },
          image: 1
        }
      }
    ]);

    if (!newsResult || newsResult.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'News not found' });
    }

    const news = newsResult[0];

    // Convert image buffer to base64
    let imageBase64 = null;
    if (news.image && news.image.data) {
      imageBase64 = `data:${news.image.contentType};base64,${news.image.data.toString('base64')}`;
    }

    const responseData = {
      _id: news._id,
      title: news.title,
      author: news.author,
      description: news.description,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      image: imageBase64,
      category: news.category || null
    };

    res.status(200).json({ status: 'success', data: responseData });
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