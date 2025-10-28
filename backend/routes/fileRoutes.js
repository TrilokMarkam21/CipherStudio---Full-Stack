// backend/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  saveFileContent, 
  createFile, 
  deleteFile,
  renameFile  // <-- IMPORTED
} = require('../controllers/fileController');

// Update file content
router.put('/content/:fileId', protect, saveFileContent);

// Create a new file/folder
router.post('/', protect, createFile);

// Delete a file/folder
router.delete('/:id', protect, deleteFile);

// Rename a file/folder
router.put('/:id/rename', protect, renameFile); // <-- ADDED

module.exports = router;