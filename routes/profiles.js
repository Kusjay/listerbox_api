const express = require('express');
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} = require('../controllers/profiles');

// Include other resource routers
const taskRouter = require('./tasks');

const router = express.Router();

// Re-route into other resource routers
router.use('/:profileId/tasks', taskRouter);

router
  .route('/')
  .get(getProfiles)
  .post(createProfile);

router
  .route('/:id')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;
