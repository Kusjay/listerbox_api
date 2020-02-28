const express = require("express");
const {
  getCustomers,
  initializePayment,
  verifyPayment,
  getTransaction,
  getTransactionReference,
  getTransactionForTasker,
  getTransactionForTaskerByUserId
} = require("../controllers/payments");

const Payment = require("../models/Payment");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/customers").get(protect, authorize("Admin"), getCustomers);

router
  .route("/initialize/:taskID")
  .get(protect, authorize("User", "Admin"), initializePayment);

router.route("/verify/:referenceID").get(verifyPayment);

router.route("/transactions").get(protect, getTransaction);

router.route("/transaction/:taskID").get(protect, getTransaction);

router
  .route("/transaction/tasker/:taskID")
  .get(protect, authorize("Tasker", "Admin"), getTransactionForTasker);

router
  .route("/transaction/tasker/:userId")
  .get(protect, authorize("Tasker", "Admin"), getTransactionForTaskerByUserId);

router
  .route("/reference/:referenceID")
  .get(protect, authorize("Admin"), getTransactionReference);

module.exports = router;
