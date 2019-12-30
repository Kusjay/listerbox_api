const express = require('express');
const {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask
} = require('../controllers/tasks');

const Task = require('../models/Task');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Task, {
      path: 'profile',
      select: 'name'
    }),
    getTasks
  )
  .post(protect, addTask);

router
  .route('/:id')
  .get(getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
