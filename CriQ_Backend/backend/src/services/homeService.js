// const MovieNews = require('../models/movienewsModel');
// const MovieReview = require('../models/movieReview');
// const Quiz = require('../models/QuizModel');

// const getHomeScreenData = async () => {
//     try {
//         // Fetch top 3 banners
//         const movieNewsBanner = await MovieNews.find().sort({ createdAt: -1 }).limit(1);
//         const movieReviewsBanner = await MovieReview.find().sort({ createdAt: -1 }).limit(1);
//         const quizzesBanner = await Quiz.find().sort({ createdAt: -1 }).limit(1);

//         // Fetch top 10 Movie News, Reviews, and Quizzes
//         const movieNews = await MovieNews.find().sort({ createdAt: -1 }).limit(10);
//         const movieReviews = await MovieReview.find().sort({ createdAt: -1 }).limit(10);
//         const quizzes = await Quiz.find().sort({ createdAt: -1 }).limit(10);

//         return {
//             success: true,
//             banners: [
//                 { type: "movieNews", title: "Movie News", image: movieNewsBanner[0]?.image || "default_news.jpg" },
//                 { type: "movieReviews", title: "Movie Reviews", image: movieReviewsBanner[0]?.image || "default_reviews.jpg" },
//                 { type: "quizzes", title: "Quizzes", image: quizzesBanner[0]?.image || "default_quiz.jpg" }
//             ],
//             sections: [
//                 {
//                     type: "movieNews",
//                     title: "News",
//                     viewAllUrl: "/movienews",
//                     data: movieNews
//                 },
//                 {
//                     type: "movieReviews",
//                     title: "Movie Reviews",
//                     viewAllUrl: "/moviereviews",
//                     data: movieReviews
//                 },
//                 {
//                     type: "quizzes",
//                     title: "Hero Quiz",
//                     viewAllUrl: "/quizzes",
//                     data: quizzes
//                 }
//             ]
//         };
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// module.exports = { getHomeScreenData };
