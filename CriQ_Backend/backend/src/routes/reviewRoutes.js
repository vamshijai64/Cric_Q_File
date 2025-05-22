const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const userAuth = require("../middlewares/authMiddleware");
// const adminAuth = require("../middlewares/adminAuthMiddleware");

router.post('/writeReview/:titleId', reviewController.writeReview);
router.get('/reviews/:titleId', reviewController.getReviewsForTitle);

/**
 * DELETE /api/reviews/:reviewId
 * - Requires either user authentication (only deletes own reviews)
 * - Or admin authentication (deletes any review)
 */

// working
router.delete("/user/:reviewId", userAuth, reviewController.deleteReview);

// For admin: working
router.delete("/admin/:reviewId", reviewController.deleteReview); //admin

// router.delete("/:reviewId", [userAuth, adminAuth], reviewController.deleteReview);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/reviewController');
// const adminAuthController = require('../middlewares/adminAuthMiddleware');
// const upload = require('../middlewares/uploadMiddleware'); // Middleware for handling file uploads

// // For Admin: Add title with imageUrl
// router.post('/addTitle', adminAuthController, upload.single('imageUrl'), reviewController.addTitle);


// router.post('/movies/addReview', reviewController.addReview);
// router.get('/movies/getReviews', reviewController.getReviews);
// router.get('/movies/getAllReviews', reviewController.getAllReviews);

// module.exports = router;