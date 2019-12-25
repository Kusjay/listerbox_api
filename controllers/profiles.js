const ErrorResponse = require('../utils/errorResponse');
const Profile = require('../models/Profile');

// @desc    Get all profiles
// @route   GET /api/v1/profiles
// @access  Public
exports.getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find();

    res
      .status(200)
      .json({ success: true, count: profiles.length, data: profiles });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get single profile
// @route   GET /api/v1/profiles/:id
// @access  Public
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(
        new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(
      new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404)
    );
  }
};

// @desc    Create new profile
// @route   POST /api/v1/profiles
// @access  Private
exports.createProfile = async (req, res, next) => {
  try {
    const profile = await Profile.create(req.body);

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update profile
// @route   PUT /api/v1/profiles/:id
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!profile) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(200).json({ success: true, data: profile });
  }
};

// @desc    Delete profile
// @route   DELETE /api/v1/profiles/:id
// @access  Private
exports.deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);

    if (!profile) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(200).json({ success: true, data: profile });
  }
};
