require('dotenv').config();
const mongoose = require('mongoose');
const { newsCategory } = require('./src/models/newsModel'); // Adjust path as needed

const MONGODB_URI = process.env.MONGODB_URI;

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clean existing categories (optional, if you want to reset)
    await newsCategory.deleteMany();

    const categories = ['Politics', 'Sports', 'Technology', 'Entertainment', 'Health'];

    const categoryData = categories.map(name => ({ name }));

    await newsCategory.insertMany(categoryData);

    console.log('✅ News categories inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error inserting categories:', err);
    process.exit(1);
  }
};

seedCategories();
