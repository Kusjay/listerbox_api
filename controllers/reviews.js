const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Task = require('../models/Task');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/tasks/:taskId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.taskId) {
    const reviews = await Review.find({ task: req.params.taskId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
