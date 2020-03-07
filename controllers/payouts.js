const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Request = require('../models/Request');
const Earning = require('../models/Earning');
const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc Request Payout
// @route POST /api/v1/payouts/:taskOwnerId
// @access Private
exports.requestPayout = asyncHandler(async (req, res, next) => {
  let taskerPaymentDetails = await Payment.find({
    taskOwner: req.params.taskOwnerId,
    status: 'Paid'
  });

  let taskerEarning = await Earning.find({
    taskOwner: req.params.taskOwnerId
  });

  if (!taskerPaymentDetails) {
    return next(
      new ErrorResponse(
        `No payment transaction for user ${req.params.taskOwnerId}`,
        404
      )
    );
  }

  if (!taskerEarning) {
    return next(
      new ErrorResponse(`No earnings for user ${req.params.taskOwnerId}`, 404)
    );
  }

  req.body.task = taskerPaymentDetails[0].task;
  req.body.referenceID = taskerPaymentDetails[0].referenceID;
  req.body.taskOwner = taskerPaymentDetails[0].taskOwner;

  if (req.body.amount > taskerEarning[0].netEarning) {
    return next(
      new ErrorResponse(
        `Amount to be withdrawn is greater than the net earning`,
        400
      )
    );
  }

  const payout = await Payout.create(req.body);

  res.status(201).json({
    success: true,
    data: payout
  });
});
