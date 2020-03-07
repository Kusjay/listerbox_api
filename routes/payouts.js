const express = require('express');
const { requestPayout } = require('../controllers/payouts');

const Payout = require('../models/Payout');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/:taskOwnerId')
  .post(protect, authorize('Tasker', 'Admin'), requestPayout);

module.exports = router;
