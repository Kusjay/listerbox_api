// @desc    Get all profiles
// @route   GET /api/v1/profiles
// @access  Public
exports.getProfiles = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all profiles' });
};

// @desc    Get single profile
// @route   GET /api/v1/profiles/:id
// @access  Public
exports.getProfile = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show profile ${req.params.id}` });
};

// @desc    Create new profile
// @route   POST /api/v1/profiles
// @access  Private
exports.createProfile = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new profile' });
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
