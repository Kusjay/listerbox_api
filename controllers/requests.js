const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Request = require('../models/Request');
const Task = require('../models/Task');
const Profile = require('../models/Profile');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Add request
// @route   POST /api/v1/tasks/:taskId/requests
// @access  Private
exports.addRequest = asyncHandler(async (req, res, next) => {
  req.body.task = req.params.taskId;
  req.body.user = req.user.id;

  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.taskId}`, 404)
    );
  }

  const request = await Request.create(req.body);

  res.status(201).json({
    success: true,
    date: request
  });
});

// @desc    Accept request
// @route   PUT /api/v1/request/acceptrequest/:id
// @access  Private
exports.acceptRequest = asyncHandler(async (req, res, next) => {
  let request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`, 404)
    );
  }

  let alltask = await Task.find({ user: req.user.id });

  if (alltask.length == 0) {
    return next(
      new ErrorResponse(`No task associated with user ${req.user.id}`, 404)
    );
  }

  //get task user id
  const task = alltask[0].user;

  // get task id
  const taskID = alltask[0]._id;

  console.log(taskID);
  console.log(request.task);

  if (
    task == req.user.id ||
    (req.user.role == 'Admin' && request.task == taskID)
  ) {
    request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: 'Accepted' },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: request
    });
  } else {
    return next(new ErrorResponse(`Not authorized to accept request`, 401));
  }
});

// @desc    Complete request for user
// @route   PUT /api/v1/request/completerequestuser/:id
// @access  Private
exports.completeRequestUser = asyncHandler(async (req, res, next) => {
  let request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`, 404)
    );
  }

  //Check if the user created the request
  if (request.user != req.user.id) {
    return next(
      new ErrorResponse(
        'User is not authorized to mark this service as completed'
      )
    );
  }

  // Get the tasker details
  let taskerDetails = await Task.find({ _id: request.task });

  let tasker = await User.find({ _id: taskerDetails[0].user });

  request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: 'Completed' },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: request
  });

  const message = `Hi ${tasker[0].name}, ${req.user.name} is satified with your service, and has marked the service '${taskerDetails[0].title}' as completed.`;

  try {
    await sendEmail({
      email: tasker[0].email,
      subject: `Service Completion from ${req.user.name}`,
      message
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Complete request for tasker
// @route   PUT /api/v1/request/completerequesttasker/:id
// @access  Private
exports.completeRequestTasker = asyncHandler(async (req, res, next) => {
  let request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`, 404)
    );
  }

  // Check if the user created a task
  let alltask = await Task.find({ user: req.user.id });

  if (alltask.length == 0) {
    return next(
      new ErrorResponse(`No task associated with user ${req.user.id}`, 404)
    );
  }

  //get task user id
  const task = alltask[0].user;

  // get task id
  const taskID = alltask[0]._id;

  // Get the user email that matches the specific task requested for
  let userprofileDetails = await User.find({ _id: request.user });
  let userprofileEmail = userprofileDetails[0].email;

  // Get the Task title that match the specific request
  let taskDetails = await Task.find({ _id: request.task });
  let taskTitle = taskDetails[0].title;

  // Check if the task belongs to the tasker or user is admin, and the request belongs to the specific task
  if (
    task == req.user.id ||
    (req.user.role == 'Admin' && request.task == taskID)
  ) {
    const message = `Hi ${userprofileDetails[0].name}, Tasker ${req.user.name} has requested to mark the service '${taskTitle}' as completed. Login into your dashboard to mark this service as completed, If you're satisfied with the service`;

    try {
      await sendEmail({
        email: userprofileEmail,
        subject: `Service Completion from ${req.user.name}`,
        message
      });

      return res.status(200).json({
        success: true,
        data: 'Email sent'
      });
    } catch (err) {
      console.log(err);

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } else {
    return next(new ErrorResponse(`Not authorized to complete request`, 401));
  }
});

// @desc    Reject request
// @route   PUT /api/v1/request/rejectrequest/:id
// @access  Private
exports.rejectRequest = asyncHandler(async (req, res, next) => {
  let request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`, 404)
    );
  }

  let alltask = await Task.find({ user: req.user.id });

  if (alltask.length == 0) {
    return next(
      new ErrorResponse(`No task associated with user ${req.user.id}`, 404)
    );
  }

  //get task user id
  const task = alltask[0].user;

  // get task id
  const taskID = alltask[0]._id;

  console.log(taskID);
  console.log(request.task);

  if (
    task == req.user.id ||
    (req.user.role == 'Admin' && request.task == taskID)
  ) {
    request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: request
    });
  } else {
    return next(new ErrorResponse(`Not authorized to reject request`, 401));
  }
});

// @desc Cancel request from user
// @route PUT /api/v1/request/cancelrequest/:id
// @access Private
exports.cancelRequest = asyncHandler(async (req, res, next) => {
  let request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`, 404)
    );
  }

  // Check if the user created the request
  if (request.user != req.user.id) {
    return next(
      new ErrorResponse('User is not authorized to cancel this request')
    );
  }

  // Get the tasker details
  let taskerDetails = await Task.find({ _id: request.task });

  let tasker = await User.find({ _id: taskerDetails[0].user });

  request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: 'Cancelled' },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: request
  });

  const message = `Hi ${tasker[0].name}, ${req.user.name} just cancelled your service '${taskerDetails[0].title}'.`;

  try {
    await sendEmail({
      email: tasker[0].email,
      subject: `Service Cancellation from ${req.user.name}`,
      message
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Get all requests
// @desc    GET /api/v1/requests
// @route   GET /api/v1/tasks/:taskId/requests
// @access  Private
exports.getRequests = asyncHandler(async (req, res, next) => {
  if (req.params.taskId) {
    const requests = await Request.find({ task: req.params.taskId });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single request
// @desc    GET /api/v1/requests/:id
// @access  Private
exports.getRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id).populate({
    path: 'task',
    select: 'title'
  });

  if (!request) {
    return next(
      new ErrorResponse(`No request found with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc    Update request
// @route   PUT /api/v1/request/:id
// @access  Private
exports.updateRequest = asyncHandler(async (req, res, next) => {
  let request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure the request belongs to user or user is admin
  if (request.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse(`Not authorized to update request`, 401));
  }

  request = await Request.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc    Delete request
// @route   DELETE /api/v1/request/:id
// @access  Private/Admin
exports.deleteRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorResponse(`No request with the id odf ${req.params.id}`, 404)
    );
  }

  // Make sure only admin can delete request
  if (req.user.role !== 'Admin') {
    return next(new ErrorResponse(`Not authorized to delete request`, 401));
  }

  await request.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
