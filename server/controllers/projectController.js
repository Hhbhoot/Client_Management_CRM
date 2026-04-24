const Project = require('../models/Project');

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).populate('clientId', 'name');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('clientId', 'name');
    if (!project || project.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const { name, budget, deadline, status, clientId } = req.body;

    const project = await Project.create({
      name,
      budget,
      deadline,
      status,
      clientId,
      userId: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Make sure user owns project
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Make sure user owns project
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await project.deleteOne();

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
