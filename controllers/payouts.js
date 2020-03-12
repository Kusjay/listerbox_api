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

  if (req.body.amount > taskerEarning[0].availableForWithdrawal) {
    return next(
      new ErrorResponse(
        `Amount to be withdrawn is greater than the amount available for withdrawal`,
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

// @desc Accept Payout
// @route PUT /api/v1/payouts/acceptPayout/:taskOwner
// @access Private/Admin
exports.acceptPayout = asyncHandler(async (req, res, next) => {
  let payoutRequest = await Payout.find({ taskOwner: req.params.taskOwner });
  let earningDetails = await Earning.find({ taskOwner: req.params.taskOwner });

  if (!payoutRequest) {
    return next(
      new ErrorResponse(
        `No payout request with id of ${req.params.taskOwner}`,
        404
      )
    );
  }

  let payout = await Payout.findOneAndUpdate(
    { taskOwner: req.params.taskOwner },
    { status: 'Paid' },
    { new: true, runValidators: true }
  );

  const availableForWithdrawal = earningDetails[0].availableForWithdrawal;

  const earningWithdrawn = earningDetails[0].withdrawn;

  const amountWithdrawn = payoutRequest[0].amount;

  // This shows the total of money withdrawn
  const totalWithdrawn = earningWithdrawn + amountWithdrawn;
  const availableWithdraw = availableForWithdrawal - totalWithdrawn;

  if (availableForWithdrawal >= totalWithdrawn) {
    let earning = await Earning.findOneAndUpdate(
      { taskOwner: req.params.taskOwner },
      { withdrawn: totalWithdrawn, availableForWithdrawal: availableWithdraw },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: payout
    });
  } else {
    return next(
      new ErrorResponse(
        `Amount to be withdrawn is greater than the amount available for withdrawal`,
        400
      )
    );
  }
});

// @desc Reject Payout
// @route PUT /api/v1/payouts/rejectPayout/:taskOwner
// @access Private/admin
exports.rejectPayout = asyncHandler(async (req, res, next) => {
  let payoutRequest = await Payout.find({ taskOwner: req.params.taskOwner });

  if (!payoutRequest) {
    return next(
      new ErrorResponse(`No payout request with id of ${req.params.taskOwner}`)
    );
  }

  let payout = await Payout.findOneAndUpdate(
    { taskOwner: req.params.taskOwner },
    { status: 'Rejected' },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: payout
  });
});
