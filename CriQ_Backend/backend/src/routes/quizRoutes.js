const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const upload = require('../middlewares/uploadMiddleware');
// const authMiddleware = require("../middlewares/authMiddleware");


// old Routes for quizzes
router.post('/create', quizController.createQuiz);
// router.post('/create',upload.single("imageUrl"), quizController.createQuiz);
// router.get("/subcategory/:subcategoryId",quizController.getRandomQuiz)
router.get("/subcategory/:subcategoryId", quizController.getRandomQuizWithHashtagQuestions);
router.get("/:id", quizController.getQuizById);

//router.get('/:subcategoryId', quizController.getQuizzesBySubcategory);

router.get('/', quizController.getAllQuizzes);
router.put('/:quizId/questions/:questionId', quizController.updateQuestion);
router.get('/hashtag/:tag', quizController.fetchQuestionsByHashtag);
router.get('questions/:tag',quizController.fetchByHashtag);
router.post('/quit', quizController.quitQuiz);
// router.get('/incomplete-quizzes/:userId',authMiddleware ,quizController.getIncompleteQuizzes);


router.get("/incomplete-quizzes/:userId",quizController.getIncompleteQuizzesByUserId);
router.delete('/delete/:questionId',quizController.deleteQuestion);
router.delete('/delete/:id',quizController.deleteQuiz)


//these are hashtags routes
// router.post('/create', quizController.createQuiz);
// router.get('/all', quizController.getAllQuizzes);
// router.get('/:id', quizController.getQuizById);


module.exports = router;
