const { LibraryCategory, Course } = require('../../models/LibraryModel');

const createCourse = async (req, res) => {
    const { title, description, categoryId, price } = req.body;

    try {
        const course = new Course({ title, description, categoryId, price });
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('categoryId', 'name');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCoursesByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const courses = await Course.find({ categoryId }).populate('categoryId', 'name');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCourseById = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId).populate('categoryId', 'name');
        if (!course) return res.status(404).json({ error: 'Course not found' });

        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, categoryId, price } = req.body;

    try {
        if (categoryId) {
            const categoryExists = await LibraryCategory.findById(categoryId);
            if (!categoryExists) {
                return res.status(400).json({ error: 'Category not found' });
            }
        }

        const updated = await Course.findByIdAndUpdate(
            courseId,
            { title, description, categoryId, price },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Course not found' });

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while updating course' });
    }
};

const deleteCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const deleted = await Course.findByIdAndDelete(courseId);
        if (!deleted) return res.status(404).json({ error: 'Course not found' });

        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while deleting course' });
    }
};

const searchCoursesByCategoryTree = async (req, res) => {
  const { categoryId } = req.params;
  const { searchText } = req.query;

  try {
    const allCategories = await LibraryCategory.find();

    // Recursively collect all nested category IDs
    const collectCategoryIds = (parentId) => {
      const children = allCategories.filter(cat => String(cat.parentId) === String(parentId));
      return children.reduce(
        (acc, child) => [...acc, child._id.toString(), ...collectCategoryIds(child._id)],
        []
      );
    };

    const categoryIds = [categoryId, ...collectCategoryIds(categoryId)];

    // Build the query
    const query = {
      categoryId: { $in: categoryIds }
    };

    if (searchText) {
      query.title = { $regex: searchText, $options: 'i' }; // case-insensitive title match
    }

    const courses = await Course.find(query);
    res.json(courses);

  } catch (error) {
    console.error('Error searching courses by title and category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCoursesByCategory,
    getCourseById,
    updateCourse,
    deleteCourse,
    searchCoursesByCategoryTree
};
