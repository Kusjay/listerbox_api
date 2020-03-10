const express = require('express');
const {
  requestPayout,
  acceptPayout,
  rejectPayout
} = require('../controllers/payouts');

const Payout = require('../models/Payout');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/:taskOwnerId')
  .post(protect, authorize('Tasker', 'Admin'), requestPayout);

router
  .route('/acceptPayout/:taskOwner')
  .put(protect, authorize('Admin'), acceptPayout);

router
  .route('/rejectPayout/:taskOwner')
  .put(protect, authorize('Admin'), rejectPayout);

module.exports = router;
