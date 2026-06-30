const express = require('express');
const Document = require('../models/Document');
const router = express.Router();

// Middleware to check authentication
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not authenticated' });
};

// Create new document
router.post('/', ensureAuth, async (req, res) => {
  try {
    const newDoc = new Document({
      title: req.body.title || 'Untitled Document',
      data: { ops: [{ insert: '\n' }] },
      owner: req.user._id
    });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: 'Error creating document' });
  }
});

// Get all documents for a user
router.get('/', ensureAuth, async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// Get a single document
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching document' });
  }
});

module.exports = router;
