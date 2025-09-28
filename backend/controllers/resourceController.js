// controllers/resourceController.js - Knowledge hub resource controller
const Resource = require('../models/Resource');
const User = require('../models/User');

// @desc    Create resource
// @route   POST /api/resources
// @access  Private (Admin/Teacher)
const createResource = async (req, res) => {
  try {
    const { title, content, type, category, tags, externalUrl } = req.body;

    const resource = await Resource.create({
      title,
      content,
      type: type || 'article',
      category,
      tags: tags || [],
      author: req.user._id,
      externalUrl
    });

    res.status(201).json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { category, tag, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const resources = await Resource.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      count: resources.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      resources
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('author', 'name');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment views
    resource.views += 1;
    await resource.save();

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (Author/Admin)
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is author or admin
    if (resource.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name');

    res.json({
      success: true,
      resource: updatedResource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Only admin can delete
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like resource
// @route   PUT /api/resources/:id/like
// @access  Private
const likeResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = resource.likes.includes(userId);

    if (alreadyLiked) {
      return res.status(400).json({ message: 'Already liked this resource' });
    }

    resource.likes.push(userId);
    await resource.save();

    res.json({
      success: true,
      likes: resource.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  likeResource
};
