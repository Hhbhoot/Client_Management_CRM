const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, createProject);

router
  .route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, authorizeRoles('admin'), deleteProject);

module.exports = router;
