const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Request = require('../models/Request');
const Task = require('../models/Task');
const Profile = require('../models/Profile');

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

// @desc    Complete request
// @route   PUT /api/v1/request/completerequest/:id
// @access  Private
exports.completeRequest = asyncHandler(async (req, res, next) => {
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
  } else {
    return next(new ErrorResponse(`Not authorized to accept request`, 401));
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
    return next(new ErrorResponse(`Not authorized to accept request`, 401));
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
