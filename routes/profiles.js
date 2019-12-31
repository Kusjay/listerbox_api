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

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:profileId/tasks', taskRouter);

router
  .route('/:id/photo')
  .put(protect, authorize('Tasker', 'Admin'), profilePhotoUpload);

router
  .route('/')
  .get(
    advancedResults(Profile, {
      path: 'tasks',
      select: 'title description price'
    }),
    getProfiles
  )
  .post(protect, authorize('Tasker', 'User', 'Admin'), createProfile);

router
  .route('/:id')
  .get(getProfile)
  .put(protect, authorize('Tasker', 'User', 'Admin'), updateProfile)
  .delete(protect, authorize('Tasker', 'User', 'Admin'), deleteProfile);

module.exports = router;
