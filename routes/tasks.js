const express = require('express');
const {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask
} = require('../controllers/tasks');

const Task = require('../models/Task');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Task, {
      path: 'profile',
      select: 'name'
    }),
    getTasks
  )
  .post(protect, authorize('Tasker', 'Admin'), addTask);

router
  .route('/:id')
  .get(getTask)
  .put(protect, authorize('Tasker', 'Admin'), updateTask)
  .delete(protect, authorize('Tasker', 'Admin'), deleteTask);

module.exports = router;
