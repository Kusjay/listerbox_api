const express = require('express');
const {
  getCustomers,
  initializePayment,
  verifyPayment,
  getTransaction
} = require('../controllers/payments');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/customers').get(protect, authorize('Admin'), getCustomers);

router
  .route('/initialize/:taskID')
  .get(protect, authorize('User', 'Admin'), initializePayment);

router.route('/verify/:referenceID').get(verifyPayment);

router.route('/transactions').get(protect, getTransaction);

router.route('/transaction/:taskID').get(protect, getTransaction);

module.exports = router;
