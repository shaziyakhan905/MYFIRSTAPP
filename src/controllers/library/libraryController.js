const { LibraryCategory, Course } = require('../../models/LibraryModel');

const getCategoryTree = async (req, res) => {
    try {
        const categories = await LibraryCategory.find();

        const findParent = (parentId) => {
            return categories.find(c => String(c._id) === String(parentId)) || null;
        };

        const buildTree = (parentId = null) => {
            return categories
                .filter(cat => String(cat.parentId) === String(parentId))
                .map(cat => ({
                    _id: cat._id,
                    name: cat.name,
                    navigable: cat.navigable,
                    description: cat.description,
                    parent: findParent(cat.parentId),
                    children: buildTree(cat._id)
                }));
        };

        res.json(buildTree());
    } catch (error) {
        console.error('Error building category tree:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCategoryChildren = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const children = await LibraryCategory.find({ parentId: categoryId });
        res.json(children);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while fetching children' });
    }
};

const getCategoryTreeById = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const categories = await LibraryCategory.find();

    // Helper to find the parent object by ID
    const findParent = (parentId) => {
      return categories.find(c => String(c._id) === String(parentId)) || null;
    };

    const buildTree = (parentId) => {
      return categories
        .filter(cat => String(cat.parentId) === String(parentId))
        .map(cat => ({
          _id: cat._id,
          name: cat.name,
          navigable: cat.navigable,
          description: cat.description,
          parent: findParent(cat.parentId), // ✅ added this line
          children: buildTree(cat._id)
        }));
    };

    const root = categories.find(cat => String(cat._id) === String(categoryId));
    if (!root) return res.status(404).json({ error: 'Category not found' });

    const tree = {
      _id: root._id,
      name: root.name,
      navigable: root.navigable,
      description: root.description,
      parent: findParent(root.parentId), // ✅ added this line
      children: buildTree(root._id)
    };

    res.json(tree);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while building tree' });
  }
};


const createCategory = async (req, res) => {
    const { name, parentId, description, navigable } = req.body;

    try {
        if (parentId) {
            const parentExists = await LibraryCategory.findById(parentId);
            if (!parentExists) {
                return res.status(400).json({ error: 'Parent category not found' });
            }
        }

        const category = new LibraryCategory({
            name,
            parentId: parentId || null,
            description: description || '',
            navigable: navigable || false
        });

        await category.save();
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while creating category' });
    }
};

const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name, description, navigable, parentId } = req.body;

    try {
        if (parentId && parentId !== categoryId) {
            const parentExists = await LibraryCategory.findById(parentId);
            if (!parentExists) {
                return res.status(400).json({ error: 'Parent category not found' });
            }
        }

        const updated = await LibraryCategory.findByIdAndUpdate(
            categoryId,
            { name, description, navigable, parentId: parentId || null },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Category not found' });

        res.json(updated);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while updating category' });
    }
};

const deleteCategoryAndChildren = async (categoryId) => {
    const children = await LibraryCategory.find({ parentId: categoryId });

    for (const child of children) {
        await deleteCategoryAndChildren(child._id);
    }

    await LibraryCategory.findByIdAndDelete(categoryId);
};

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        await deleteCategoryAndChildren(categoryId);
        res.json({ message: 'Category and subcategories deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while deleting category' });
    }
};

module.exports = {
    getCategoryTree,
    getCategoryChildren,
    getCategoryTreeById,
    createCategory,
    updateCategory,
    deleteCategory
};
