const express = require('express');
const {
  getCustomers,
  initializePayment,
  verifyPayment,
  getTransaction
} = require('../controllers/payments');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/customers').get(protect, authorize('Admin'), getCustomers);

router
  .route('/initialize/:taskID')
  .get(protect, authorize('User', 'Admin'), initializePayment);

router.route('/verify/:taskID').get(protect, authorize('Admin'), verifyPayment);

router
  .route('/transaction/:taskID')
  .get(protect, authorize('Admin'), getTransaction);

module.exports = router;
