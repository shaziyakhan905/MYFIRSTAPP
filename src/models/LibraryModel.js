const mongoose = require('mongoose');
const { Schema } = mongoose;

const LibraryCategorySchema = new Schema({
    name: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'LibraryCategory', default: null },
    navigable: { type: Boolean, default: false },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    icon: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const CourseSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'LibraryCategory', required: true },
    // instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: Number,
    createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', CourseSchema);
const LibraryCategory = mongoose.model('LibraryCategory', LibraryCategorySchema);

module.exports = {
    Course,
    LibraryCategory
};
