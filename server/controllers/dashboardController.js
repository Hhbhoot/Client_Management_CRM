const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? {} : { userId: req.user._id };

    const [totalClients, totalProjects, totalTasks, completedTasks] = await Promise.all([
      Client.countDocuments(query),
      Project.countDocuments(query),
      Task.countDocuments(query),
      Task.countDocuments({ ...query, status: 'Done' }),
    ]);

    // Get project status breakdown for charts
    const projectsByStatus = await Project.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get task priority breakdown
    const tasksByPriority = await Task.aggregate([
      { $match: query },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      stats: {
        totalClients,
        totalProjects,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      charts: {
        projects: projectsByStatus,
        tasks: tasksByPriority,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
