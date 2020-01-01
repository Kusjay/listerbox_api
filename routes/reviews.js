const express = require('express');
const { getReviews, getReview, addReview } = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'task',
      select: 'title'
    }),
    getReviews
  )
  .post(protect, authorize('User', 'Admin'), addReview);

router.route('/:id').get(getReview);

module.exports = router;
