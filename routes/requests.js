const express = require('express');
const { addRequest, getRequests } = require('../controllers/requests');

const Request = require('../models/Request');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, authorize('User', 'Admin'), addRequest)
  .get(
    advancedResults(Request, { path: 'task', select: 'title' }),
    getRequests
  );

router.route('/:id').get(getRequests);

module.exports = router;
