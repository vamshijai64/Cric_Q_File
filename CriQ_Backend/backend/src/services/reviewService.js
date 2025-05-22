const Review = require('../models/reviewModel');
const Title = require('../models/titleModel');
const mongoose = require('mongoose');

exports.writeReview = async (titleId, reviewData) => {
    const { userId, rating, reviewText } = reviewData;

    if (!titleId || !userId || rating === undefined) {
        throw new Error('Missing required fields');
    }

    if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    // const existingReview = await Review.findOne({ user: userId, title: titleId });
    // if (existingReview) {
    //     throw new Error('You have already reviewed this title.');
    // }

    // Convert rating to Decimal128 for storage
    const formattedRating = mongoose.Types.Decimal128.fromString(parseFloat(rating).toFixed(1));

    const newReview = new Review({
        user: userId,
        title: titleId,
        rating: formattedRating,
        reviewText
    });

    await newReview.save();


    const result = await Review.aggregate([
        { $match: { title: new mongoose.Types.ObjectId(titleId) } },
        { $group: { _id: "$title", averageRating: { $avg: "$rating" } } }
    ]);

    // const newAvgRating = result.length > 0 ? parseFloat(result[0].averageRating.toFixed(2)) : 0.0;
    let newAvgRating = 0.0;
    if (result.length > 0) {
        // Convert Decimal128 to float before using toFixed()
        newAvgRating = parseFloat(result[0].averageRating.toString()).toFixed(1);
    }


    await Title.findByIdAndUpdate(titleId, { rating: newAvgRating });


    return {
        ...newReview.toObject(),
        rating: parseFloat(newReview.rating.toString()).toFixed(1) 
    };
};


// exports.writeReview = async (titleId, reviewData) => { //title means titleId
//     const { userId, rating, reviewText } = reviewData;

//     const titleExists = await Title.findById(titleId);
//     if (!titleExists) {
//         throw new Error('Title not found');
//     }

//     if(rating < 1 || rating > 5) {
//         throw new Error('Rating must be between 1 and 5');
//     }

//     const existingReview = await Review.findOne({ user: userId, title: titleId });
//     if (existingReview) {
//         throw new Error('You have already reviewed this title.');
//     }

//     // Convert to Decimal128 before saving
//     const formattedRating = mongoose.Types.Decimal128.fromString(parseFloat(rating).toFixed(1));

//     const newReview = new Review({ user: userId, 
//         title: titleId, 
//         rating: formattedRating,  // Ensure float storage
//         reviewText });
//     await newReview.save();

//     // // Recalculate the average rating
//     // const result = await Review.aggregate([
//     //     { $match: { title: new mongoose.Types.ObjectId(titleId) } },
//     //     { $group: { _id: "$title", averageRating: { $avg: "$rating" } } }
//     // ]);

//     // // const newAvgRating = result.length > 0 ? result[0].averageRating.toFixed(2) : 0;
//     // const newAvgRating = result.length > 0 ? parseFloat(result[0].averageRating.toFixed(2)) : 0.0;

//     // // Update the rating field in the Title model
//     // await Title.findByIdAndUpdate(titleId, { rating: newAvgRating });
//     return newReview;
// };


/**
 * Deletes a review based on review ID.
 * Only the review owner or an admin can delete it.
 */
exports.deleteReview = async (reviewId, requestingUserId, isAdmin) => {
    const review = await Review.findById(reviewId);

    if(!review) {
        throw new Error("Review not found");
    }

    // If user is not an admin, ensure they own the review
    // if(!isAdmin && review.user.toString() !== requestingUserId) {
    //     throw new Error("You can only delete your own reviews");
    // }

    // Delete review
    await Review.deleteOne({ _id: reviewId });
    return { message: "Review deleted successfully" }
};

