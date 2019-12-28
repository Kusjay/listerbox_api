const express = require('express');
const {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask
} = require('../controllers/tasks');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getTasks)
  .post(addTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
