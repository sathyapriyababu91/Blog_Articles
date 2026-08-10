const express = require('express');
const router = express.Router();
const linkController = require('../controller/link.controller');

// Route to generate summary via Gemini AI transcript fetching
router.post('/generate-summary', linkController.generateSummary);

// Get all links
router.get('/', linkController.getAllLinks);

// Get single link by ID
router.get('/:id', linkController.getLinkById);

// Post new link
router.post('/', linkController.createLink);

// Delete link
router.delete('/:id', linkController.deleteLink);

module.exports = router;