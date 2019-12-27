const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');

// @desc    Get tasks
// @route   GET /api/v1/tasks
// @route   GET /api/v1/profiles/:profileId/tasks
// @access  Public
exports.getTasks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.profileId) {
    query = Task.find({ profile: req.params.profileId });
  } else {
    query = Task.find().populate({
      path: 'profile',
      select: 'name'
    });
  }

  const tasks = await query;

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});
