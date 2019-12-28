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

router
  .route('/')
  .get(
    advancedResults(Task, {
      path: 'profile',
      select: 'name'
    }),
    getTasks
  )
  .post(addTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
