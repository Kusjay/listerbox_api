const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Profile = require('../models/Profile');

// @desc    Get all profiles
// @route   GET /api/v1/profiles
// @access  Public
exports.getProfiles = asyncHandler(async (req, res, next) => {
  let query;

  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Profile.find(JSON.parse(queryStr));

  const profiles = await query;

  res
    .status(200)
    .json({ success: true, count: profiles.length, data: profiles });
});

// @desc    Get single profile
// @route   GET /api/v1/profiles/:id
// @access  Public
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: profile });
});

// @desc    Create new profile
// @route   POST /api/v1/profiles
// @access  Private
exports.createProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.create(req.body);

  res.status(201).json({
    success: true,
    data: profile
  });
});

// @desc    Update profile
// @route   PUT /api/v1/profiles/:id
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!profile) {
    return next(
      new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: profile });
});

// @desc    Delete profile
// @route   DELETE /api/v1/profiles/:id
// @access  Private
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findByIdAndDelete(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});
