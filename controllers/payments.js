const https = require('https');
const paystack = require('paystack')(process.env.SECRET_KEY);

const asyncHandler = require('../middleware/async');
const Payment = require('../models/Payment');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all customers
// @route   GET /api/v1/payements/customers
// @access  Private/Admin
exports.getCustomers = asyncHandler(async (req, res, next) => {
  paystack.customer
    .list()
    .then(body => {
      res.status(200).json(body);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @desc    Initializing payment
// @route   GET /api/v1/payements/initialize
// @access  Private/Admin
exports.initializePayment = asyncHandler(async (req, res, next) => {
  let taskID = req.params.taskID;
  taskID = taskID.trim();
  if (taskID == '') {
    res
      .status(400)
      .json({ status: 'failed', message: 'please enter valid task id!' });
  }
  let task = await Task.findById(taskID, (err, task) => {
    if (err) {
      res.status(404).json({ status: 'failed', message: err.message });
    }
    return task;
  });

  let user = await User.findById(task.user, (err, user) => {
    if (err) {
      res.status(404).json({ status: 'failed', message: err.message });
    }
    return user;
  });

  // add checks here is transaction already proccessed

  var options = {
    host: process.env.PAYMENT_HOST,
    path: `/transaction/initialize/`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  let referenceID =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);
  var paymentData = JSON.stringify({
    reference: referenceID, // generate your transaction id
    amount: task.price,
    email: user.email,
    callback_url: `http://127.0.0.1:5000/api/v1/payments/verify/${task._id}` // paste here web url which will call api url of success
  });

  let data = '';
  var paymentreq = https.request(options, paymentRes => {
    paymentRes.on('data', chunk => {
      data += chunk;
    });
    paymentRes.on('end', async () => {
      data = JSON.parse(data);
      if (data['status']) {
        let paymentdetails = {
          user: user['_id'],
          task: task['_id'],
          referenceID: referenceID,
          accessCode: data['data']['access_code'],
          status: 'Init'
        };
        await Payment.create(paymentdetails, (e, p) => {
          if (e) {
            res.status(500).json({
              status: 'failed',
              message: 'Error while inserting payment details!'
            });
          }
        });
      }
      let responseData = {
        payment_url: data['data']['authorization_url'],
        reference_id: referenceID
      };
      res.status(200).json({ status: 'success', data: responseData });
    });
  });

  paymentreq.on('error', e => {
    res.json(e);
    // console.error(`problem with request: ${e.message}`);
  });

  // Write data to request body
  paymentreq.write(paymentData);
  paymentreq.end();
});

exports.verifyPayment = asyncHandler(async (req, res, next) => {
  let taskID = req.params.taskID;
  taskID = taskID.trim();
  if (taskID == '') {
    res
      .status(400)
      .json({ status: 'failed', message: 'please enter valid task id!' });
  }
  let paymentData = await Payment.findOne(
    { task: taskID },
    (err, paymenData) => {
      if (err) {
        res.status(404).json({ status: 'failed', message: err.message });
      }
      return paymenData;
    }
  );
  if (paymentData['status'] === 'Paid') {
    res.status(200).json({ status: 'success', data: paymentData });
  }

  // calls to verify trasaction
  let options = {
    hostname: process.env.PAYMENT_HOST,
    path: `/transaction/verify/${paymentData['referenceID']}`,
    headers: {
      Authorization: `Bearer ${process.env.SECRET_KEY}`
    }
  };
  https
    .get(options, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });

      resp.on('end', async () => {
        verifiedData = JSON.parse(data);
        if (verifiedData['status'] == true) {
          paymentData = await Payment.findOneAndUpdate(
            { referenceID: paymentData['referenceID'] },
            { status: 'Paid' },
            (e, pd) => {
              if (e) {
                // create log in db of failed updations
                res.status(404).json({
                  status: 'failed',
                  message: 'Unable to update payment status'
                });
              }
              return pd;
            }
          );
          res.status(200).json({ status: 'success', data: paymentData });
        } else {
          res
            .status(404)
            .json({ status: 'failed', message: verifiedData['message'] });
        }
      });
    })
    .on('error', err => {
      res.status(400).json({ status: 'failed', message: err.message });
    });
});

exports.getTransaction = asyncHandler(async (req, res, next) => {
  let taskID = req.params.taskID;
  taskID = taskID.trim();
  if (taskID == '') {
    res
      .status(400)
      .json({ status: 'failed', message: 'please enter valid task id!' });
  }
  let paymentData = await Payment.findOne(
    { task: taskID },
    (err, paymenData) => {
      if (err) {
        res.status(404).json({ status: 'failed', message: err.message });
      }
      return paymenData;
    }
  );
  if (paymentData['status'] === 'Paid') {
    res.status(200).json({ status: 'success', data: paymentData });
  }

  // calls to verify trasaction
  let options = {
    hostname: process.env.PAYMENT_HOST,
    path: `/transaction/${paymentData['referenceID']}`,
    headers: {
      Authorization: `Bearer ${process.env.SECRET_KEY}`
    }
  };
  https
    .get(options, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });

      resp.on('end', () => {
        verifiedData = JSON.parse(data);
        if (verifiedData['status'] == true) {
          // generate db log here to record status
          res.status(200).json({ status: 'success', data: paymentData });
        } else {
          res
            .status(404)
            .json({ status: 'failed', message: verifiedData['message'] });
        }
      });
    })
    .on('error', err => {
      res.status(400).json({ status: 'failed', message: err.message });
    });
});
