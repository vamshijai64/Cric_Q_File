
const categoryModel = require("../models/CategeoryModel");
const subcategoryModel = require("../models/subcategoryModel");
const IncompleteQuizModel = require("../models/IncompleteQuiz");

exports.getGameApiDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Get latest categories
        const latestCategories = await categoryModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title imageUrl createdAt");

       
        const userIncompleteQuizzes = await IncompleteQuizModel.find({ userId })
            .distinct("subcategoryId"); 

       
        const incompleteSubcategories = await subcategoryModel.find({
            _id: { $in: userIncompleteQuizzes }
        }).select("_id title imageUrl createdAt");

        console.log("Fetched incomplete subcategories: ", incompleteSubcategories);

      
        let incompleteQuizz = [{
            type: "IncompleteQuizzes",
            _id: userId, 
            data: incompleteSubcategories.map(sub => ({
                _id: sub._id,
                title: sub.title,
                imageUrl: sub.imageUrl,
                createdAt: sub.createdAt
            }))
        }];

    
        const categoriesWithSubcategories = await Promise.all(
            latestCategories.map(async (category) => {
                const subcategories = await subcategoryModel
                    .find({ category: category._id })
                    .sort({ createdAt: -1 })
                    .select("_id title imageUrl createdAt");

                return {
                    type: category.title,
                    _id: category._id,
                    data: subcategories
                };
            })
        );

        // Prepare banners
        const banners = [];
        if (latestCategories.length > 0) {
            banners.push({ type: "Categories", data: latestCategories });
        }

        // Send final response
        res.json({ banners, incompleteQuizz, response: categoriesWithSubcategories });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
