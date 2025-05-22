const reviewService = require('../services/reviewService');
const Review = require('../models/reviewModel');
const mongoose = require('mongoose')

exports.writeReview = async (req, res) => {
    try {
        const { titleId } = req.params;
        const reviewData = req.body; // userId, rating, reviewText

        const review = await reviewService.writeReview(titleId, reviewData);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReviewsForTitle = async (req, res) => {
    try {
        const { titleId } = req.params;
        
        const reviews = await Review.aggregate([
            { $match: { title: new mongoose.Types.ObjectId(titleId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: "$userDetails" },
            {
                $group: {

                    _id: "$title",
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: "$rating" },
                    ratingCounts: { 
                        $push: "$rating"                         
                    },
                    reviews: {
                        $push: {
                            reviewId: "$_id",
                            username: "$userDetails.username",
                            profileImage: "$userDetails.profileImage",
                            reviewText: "$reviewText",
                            rating: "$rating",
                            createdAt: "$createdAt"
                        }
                    }
                }
            }
        ]);

        if(!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this title" });
        }

        // Calculate rating distribution (1 to 5 stars)
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        // reviews[0].ratingCounts.forEach(r => ratingDistribution[r]++);
        // Ensure only valid ratings are counted
        reviews[0].ratingCounts.forEach(r => {
            const ratingValue = Math.round(parseFloat(r)); // Convert Decimal128 properly
            if (ratingDistribution.hasOwnProperty(ratingValue)) {
                ratingDistribution[ratingValue]++;
            }
        });
        
        const total = reviews[0].totalReviews;
        const ratingPercentage = {};
        Object.keys(ratingDistribution).forEach(key => {
            // ratingPercentage[key] = ((ratingDistribution[key] / total) * 100).toFixed(2) + "%";
            // ratingPercentage[key] = total > 0 ? ((ratingDistribution[key] / total) * 100).toFixed(1) + "" : "0.0";
            // ratingPercentage[key] = total > 0 ? ((ratingDistribution[key] / total) * 100).toFixed(1) + "" : "0.0";
        //   ratingPercentage[key] = total > 0 ? ((ratingDistribution[key] / total) * 100).toFixed(1) + "" : "0.0";
            // ratingPercentage[key] = total > 0 ? Math.round((ratingDistribution[key] / total) * 100) + "" : "0";
            ratingPercentage[key] = total > 0 ? ((ratingDistribution[key] / total) * 100).toFixed(1) + "" : "0.0";
        });

        // res.json({
        //     totalReviews: reviews[0].totalReviews,
        //     // averageRating: reviews[0].averageRating.toFixed(2),
        //     averageRating: parseFloat(reviews[0].averageRating.toString()).toFixed(2), // Convert Decimal128 to Number
        //     ratingDistribution: ratingPercentage,
        //     reviews: reviews[0].reviews,
        // });
        res.json({
            totalReviews: reviews[0].totalReviews,
            averageRating: parseFloat(reviews[0].averageRating.toString()).toFixed(1),
            // averageRating: parseFloat(reviews[0].averageRating).toFixed(1),
            ratingDistribution: ratingPercentage,
            reviews: reviews[0].reviews.map(review => ({
                reviewId: review.reviewId,
                username: review.username,
                profileImage: review.profileImage,
                reviewText: review.reviewText,
                rating: review.rating.toString(),  // Convert Decimal128 to a string
                createdAt: review.createdAt
            }))
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// exports.getReviewsForTitle = async (req, res) => {
//     try {
//         const { titleId } = req.params;
        
//         const reviews = await Review.aggregate([
//             { $match: { title: new mongoose.Types.ObjectId(titleId) } },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'user',
//                     foreignField: '_id',
//                     as: 'userDetails'
//                 }
//             },
//             { $unwind: "$userDetails" },
//             {
//                 $group: {

//                     _id: "$title",
//                     totalReviews: { $sum: 1 },
//                     averageRating: { $avg: "$rating" },
//                     ratingCounts: { 
//                         $push: "$rating"                         
//                     },
//                     reviews: {
//                         $push: {
//                             username: "$userDetails.username",
//                             profileImage: "$userDetails.profileImage",
//                             reviewText: "$reviewText",
//                             rating: "$rating",
//                             createdAt: "$createdAt"
//                         }
//                     }
//                 }
//             }
//         ]);

//         if(!reviews.length) {
//             return res.status(404).json({ message: "No reviews found for this title" });
//         }

//         // Calculate rating distribution (1 to 5 stars)
//         const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//         // reviews[0].ratingCounts.forEach(r => ratingDistribution[r]++);
//         // Ensure only valid ratings are counted
//         reviews[0].ratingCounts.forEach(r => {
//             const ratingValue = Math.round(parseFloat(r)); // Convert Decimal128 properly
//             if (ratingDistribution.hasOwnProperty(ratingValue)) {
//                 ratingDistribution[ratingValue]++;
//             }
//         });
        
//         const total = reviews[0].totalReviews;
//         const ratingPercentage = {};
//         Object.keys(ratingDistribution).forEach(key => {
//             // ratingPercentage[key] = ((ratingDistribution[key] / total) * 100).toFixed(2) + "%";
//             ratingPercentage[key] = total > 0 ? ((ratingDistribution[key] / total) * 100).toFixed(2) + "%" : "0.00%";
//         });

//         // res.json({
//         //     totalReviews: reviews[0].totalReviews,
//         //     // averageRating: reviews[0].averageRating.toFixed(2),
//         //     averageRating: parseFloat(reviews[0].averageRating.toString()).toFixed(2), // Convert Decimal128 to Number
//         //     ratingDistribution: ratingPercentage,
//         //     reviews: reviews[0].reviews,
//         // });
//         res.json({
//             totalReviews: reviews[0].totalReviews,
//             averageRating: parseFloat(reviews[0].averageRating.toString()).toFixed(2), 
//             ratingDistribution: ratingPercentage,
//             reviews: reviews[0].reviews.map(review => ({
//                 username: review.username,
//                 profileImage: review.profileImage,
//                 reviewText: review.reviewText,
//                 rating: review.rating.toString(),  // Convert Decimal128 to a string
//                 createdAt: review.createdAt
//             }))
//         });
        
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

/**
 * Deletes a review by ID.
 * - User can delete only their own reviews.
 * - Admin can delete any review.
 */
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        let requestingUserId = req.user?.userId || null;
        let isAdmin = req.admin?.role === "admin"

        if(!requestingUserId && !isAdmin) {
            return res.status(403).json({ error: "Unauthorized request" });
        }

        const result = await reviewService.deleteReview(reviewId);
        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





// exports.getAllReviewsForTitle = async (req, res) => {
//     try {
//         const { titleId } = req.body;
//         const reviews = await reviewService.getAllReviewsForTitle(titleId);
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };









// const reviewService = require('../services/reviewService');

// // For Admin: Add title with imageUrl
// exports.addTitle = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'Image file is required' });
//         }

//         const { title } = req.body;
//         const imageUrl = req.file.path;
        
//         const data = await reviewService.addTitle(title, imageUrl);
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// exports.addReview = async (req, res) => {
//     try {
//         const { title } = req.body;
//         const reviewData = req.body;

//         const review = await reviewService.addReview(title, reviewData);
//         res.status(201).json(review);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getReviews = async (req, res) => {
//     try {
//         const { title } = req.body;

//         const reviews = await reviewService.getReviews(title);
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getAllReviews = async (req, res) => {
//     try {
//         const reviews = await reviewService.getAllReviews();
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getReviews = async (req, res) => {
//     try {
//         const { title } = req.query;
//         const { sort = 'desc', rating, userId } = req.query;

//         if(!title) {
//             return res.status(400).json({ error: 'Movie title is required' });
//         }

//         const reviews = await reviewService.getReviews(title, { sort, rating, userId });
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message })
//     }
// }


// With Movie Model reference
// exports.addReview = async (req, res) => {
//     try {
//         const { id: movieId } = req.params;
//         const reviewData = req.body;

//         // const { rating, reviewText } = req.body;
//         // Get userId from authenticated user (e.g., via JWT or session middleware)
//         // const userId = req.user.id;
//         // const review = await reviewService.addReview(movieId, { userId, rating, reviewText });
        
//         const review = await reviewService.addReview(movieId, reviewData);
//         res.status(201).json(review);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getReviews = async (req, res) => {
//     try {
//         const { id: movieId } = req.params;
//         const { sort = 'desc', rating, userId } = req.query;

//         const reviews = await reviewService.getReviews(movieId, { sort, rating, userId });
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }  
// };