const express = require('express');
const { getTasks, getTask, addTask } = require('../controllers/tasks');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getTasks)
  .post(addTask);

router.route('/:id').get(getTask);

module.exports = router;
