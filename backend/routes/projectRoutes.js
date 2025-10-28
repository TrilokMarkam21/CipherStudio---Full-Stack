const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createProject, getProjects, getProjectById } = require('../controllers/projectController');

router.route('/').post(protect, createProject).get(protect, getProjects);
router.route('/:id').get(protect, getProjectById);

module.exports = router;