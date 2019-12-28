const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');
const Profile = require('../models/Profile');

// @desc    Get single task
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

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Public
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate({
    path: 'profile',
    select: 'name description'
  });

  if (!task) {
    return next(new ErrorResponse(`No task with id of ${req.params.id}`), 404);
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Add task
// @route   POST /api/v1/profiles/:profileId/tasks
// @access  Private
exports.addTask = asyncHandler(async (req, res, next) => {
  req.body.profile = req.params.profileId;

  const profile = await Profile.findById(req.params.profileId);

  if (!profile) {
    return next(
      new ErrorResponse(`No profile with id of ${req.params.profileId}`),
      404
    );
  }

  const task = await Task.create(req.body);

  res.status(200).json({
    success: true,
    data: task
  });
});
