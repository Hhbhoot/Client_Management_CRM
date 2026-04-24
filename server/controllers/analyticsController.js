const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Client = require('../models/Client');
const mongoose = require('mongoose');

// @desc    Get advanced analytics
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Base match filter (members only see their own data, admins see all)
    const matchFilter = isAdmin ? {} : { userId };

    // 1. Monthly Revenue (Last 6 months)
    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          ...matchFilter,
          status: 'Paid',
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // 2. Project Status Distribution
    const projectStats = await Project.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 3. Task Status Distribution
    const taskStats = await Task.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 4. Client Growth (Last 6 months)
    const clientGrowth = await Client.aggregate([
      {
        $match: {
          ...matchFilter,
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // 5. Projects per Client (Top 5)
    const projectsPerClient = await Project.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$clientId', projectCount: { $sum: 1 } } },
      { $sort: { projectCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'clientDetails',
        },
      },
      { $unwind: '$clientDetails' },
      {
        $project: {
          name: '$clientDetails.name',
          projectCount: 1,
        },
      },
    ]);

    // 6. Insights
    // Calculate revenue growth (Current month vs Previous month)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentRevenue =
      monthlyRevenue.find((r) => r._id.month === currentMonth && r._id.year === currentYear)
        ?.revenue || 0;
    const prevRevenue =
      monthlyRevenue.find((r) => r._id.month === prevMonth && r._id.year === prevYear)?.revenue ||
      0;

    let revenueGrowth = 0;
    if (prevRevenue > 0) {
      revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
    } else if (currentRevenue > 0) {
      revenueGrowth = 100;
    }

    const mostActiveClient = projectsPerClient[0] || null;

    res.json({
      monthlyRevenue,
      projectStats,
      taskStats,
      clientGrowth,
      projectsPerClient,
      insights: {
        revenueGrowth: revenueGrowth.toFixed(1),
        mostActiveClient,
      },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: error.message });
  }
};
