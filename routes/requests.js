const express = require('express');
const {
  addRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  acceptRequest,
  rejectRequest,
  completeRequestUser,
  completeRequestTasker,
  cancelRequest
} = require('../controllers/requests');

const Request = require('../models/Request');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, authorize('User', 'Admin'), addRequest)
  .get(
    protect,
    authorize('Admin'),
    advancedResults(Request, { path: 'task', select: 'title' }),
    getRequests
  );

router
  .route('/:id')
  .get(protect, authorize('User', 'Admin'), getRequest)
  .put(protect, authorize('User', 'Admin'), updateRequest)
  .delete(protect, authorize('Admin'), deleteRequest);

router
  .route('/acceptrequest/:id')
  .put(protect, authorize('Tasker', 'Admin'), acceptRequest);

router
  .route('/completerequestuser/:id')
  .put(protect, authorize('User', 'Admin'), completeRequestUser);

router
  .route('/completerequesttasker/:id')
  .put(protect, authorize('Tasker', 'Admin'), completeRequestTasker);

router
  .route('/rejectrequest/:id')
  .put(protect, authorize('Tasker', 'Admin'), rejectRequest);

router
  .route('/cancelrequest/:id')
  .put(protect, authorize('User', 'Admin'), cancelRequest);

module.exports = router;
