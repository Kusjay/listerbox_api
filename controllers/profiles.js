const Profile = require('../models/Profile');

// @desc    Get all profiles
// @route   GET /api/v1/profiles
// @access  Public
exports.getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find();

    res.status(200).json({ success: true, data: profiles });
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
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ success: false });
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
exports.updateProfile = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update profile ${req.params.id}` });
};

// @desc    Delete profile
// @route   DELETE /api/v1/profiles/:id
// @access  Private
exports.deleteProfile = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete profile ${req.params.id}` });
};
