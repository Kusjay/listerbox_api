const express = require('express');
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  profilePhotoUpload
} = require('../controllers/profiles');

const Profile = require('../models/Profile');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const taskRouter = require('./tasks');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:profileId/tasks', taskRouter);

router.route('/:id/photo').put(protect, profilePhotoUpload);

router
  .route('/')
  .get(
    advancedResults(Profile, {
      path: 'tasks',
      select: 'title description price'
    }),
    getProfiles
  )
  .post(protect, createProfile);

router
  .route('/:id')
  .get(getProfile)
  .put(protect, updateProfile)
  .delete(protect, deleteProfile);

module.exports = router;
