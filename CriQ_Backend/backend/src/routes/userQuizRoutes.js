const express = require('express');
const   router = express.Router();
const Quiz = require('../models/QuizModel');
const User = require('../models/userModel');
const IncompleteQuiz = require('../models/IncompleteQuiz')

router.post('/start/:subcategoryId', async (req, res) => {
    try {
        const { subcategoryId  } = req.params;

        // Fetch 9 random questions from the subcategory
        const quizData = await Quiz.findOne({ subcategory: subcategoryId });
        if (!quizData) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const shuffledQuestions = quizData.questions.sort(() => 0.5 - Math.random()).slice(0, 9);
        res.json({ questions: shuffledQuestions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/submit', async (req, res) => {
    try {
        const { userId, quizId, totalQuestions, correctAnswers, wrongAnswers, hintsUsed, points } = req.body;

        const user = await User.findById(userId).exec();;
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update User Stats
        user.points += points;
        user.quizzesPlayed += 1;
        await user.save();


        await IncompleteQuiz.deleteOne({ userId, subcategoryId: quizId });

        res.json({
            message: "Quiz results saved successfully",
            userId, quizId, totalQuestions, correctAnswers, wrongAnswers, hintsUsed, points, 
            updatedScore: user.points,
            quizzesPlayed: user.quizzesPlayed
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports=router;