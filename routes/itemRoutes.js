const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Item = require('../models/Item');

const router = express.Router();

// @desc    Fetch all items with search, filter, and pagination
// @route   GET /api/items?page=1
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;

    const filter = {};
    if (req.query.keyword) {
      filter.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const count = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    // This part is crucial - it returns an object, not just an array
    res.json({ items, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch items for the logged-in user
// @route   GET /api/items/myitems
// @access  Private
router.get('/myitems', protect, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch a single item by ID
// @route   GET /api/items/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, description, category, condition, itemType, image } = req.body;
  try {
    const item = new Item({
      title, description, category, condition, itemType, image, user: req.user._id,
    });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, description, category, condition, itemType } = req.body;
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      if (item.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      item.title = title || item.title;
      item.description = description || item.description;
      item.category = category || item.category;
      item.condition = condition || item.condition;
      item.itemType = itemType || item.itemType;
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      if (item.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      await item.deleteOne();
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;