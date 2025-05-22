const quizService=require('../services/quizService')
const User = require('../models/userModel');
const IncompleteQuizModel = require("../models/IncompleteQuiz");
const QuizModel = require("../models/QuizModel");

exports.createQuiz = async (req, res) => {
  try {
    const { title, subcategory ,category,questions } = req.body;
    const quiz = await quizService.createQuiz(title, subcategory,category, questions);
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
    console.log(error,"quiz error");
    
  }
  
};
exports.getIncompleteQuizById = async (req, res) => {
  try {
    const quizId = req.params.id; // ID from the request URL

    // Find all incomplete quizzes that belong to the same group (type: "IncompleteQuizzes")
    const incompleteQuizzes = await IncompleteQuizModel.find({ _id: quizId })
        .populate({
            path: "subcategoryId",
            select: "_id title imageUrl createdAt"
        });

    if (!incompleteQuizzes || incompleteQuizzes.length === 0) {
        return res.status(404).json({ message: "Incomplete quiz not found" });
    }

    // Transform data to match the response format
    const formattedResponse = {
        type: "IncompleteQuizzes",
        _id: quizId,
        data: incompleteQuizzes.map(quiz => ({
            _id: quiz.subcategoryId._id,
            title: quiz.subcategoryId.title,
            imageUrl: quiz.subcategoryId.imageUrl,
            createdAt: quiz.subcategoryId.createdAt
        }))
    };

    res.json(formattedResponse);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};


// exports.getQuizzesBySubcategory = async (req, res) => {
//   try {
//     const { subcategoryId } = req.params;
//     const quizzes = await quizService.getQuizzesBySubcategory(subcategoryId);
//     res.status(200).json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
//   }
// };



exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
    console.log(error,"getall errror");
    
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await QuizModel.findById(quizId)
      .populate('category')       // Populate full category document
      .populate('subcategory');   // Populate full subcategory document

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getRandomQuiz = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    console.log("Fetching questions for subcategory:", subcategoryId); // Debugging log

    const quizData = await quizService.getRandomQuizQuestions(subcategoryId);

    if (!quizData || quizData.error) {
      return res.status(404).json({ message: quizData?.error || "No questions found." });
    }

    // Use quizData.questions, not 'questions'
    const randomQuestions = quizData.questions.sort(() => 0.5 - Math.random()).slice(0, 9);

    res.status(200).json({ ...quizData, questions: randomQuestions });
  } catch (error) {
    console.error("Error fetching random questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRandomQuizWithHashtagQuestions = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const quizData = await quizService.getRandomQuizQuestionsWithHashtags(subcategoryId);

    if (!quizData || quizData.error) {
      return res.status(404).json({ message: quizData?.error || "No questions found." });
    }

    res.status(200).json(quizData);
  } catch (error) {
    console.error("Error fetching quiz with hashtag questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getLatestQuizzes = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, subcategory } = req.query;

        const quizzes = await quizService.getLatestQuizzes({
            page: parseInt(page),
            limit: parseInt(limit),
            category,
            subcategory
        });

        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateQuestion=async(req,res)=>{
try{
  const {quizId,questionId}=req.params;
  const updateData=req.body;
  const updateQuiz= quizService.updateQuestion(quizId,questionId,updateData);
  res.json({messgae:"Question update succefully",quiz:updateQuiz})
}catch{
  res.status(500).json({message:error.message})
}
}

exports.fetchQuestionsByHashtag = async (req, res) => {
  try {
      const { tag } = req.params;
      const response = await quizService.getQuestionsByHashtag(tag);

      if (!response.success) {
          return res.status(404).json({ message: response.message });
      }

      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// controllers/quizController.js



exports.fetchByHashtag = async (req, res) => {
  try {
    const { tag } = req.params;
    const response = await quizService.getByHashtag(tag);

    if (!response.success) {
      return res.status(404).json({ message: response.message });
    }

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.quitQuiz=async(req,res)=>{
  try {
    const { userId,subcategoryId } =req.body;
    
    const result= await quizService.saveQuitQuiz(userId,subcategoryId);
    res.status(200).json(result);

    
  } catch (error) {
    res.status(500).json({error:error.message})
    
  }
 }

// exports.getIncompleteQuizzes =async (req,res) => {

//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const data = await quizService.getIncompleteQuizzes(userId);

//     res.status(200).json({
//       message: "Incomplete quizzes retrieved",
//       data ,
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
  
// }



exports.getIncompleteQuizzesByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from URL

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch all incomplete quizzes for the user
        const incompleteQuizzes = await IncompleteQuizModel.find({ userId })
            .populate({
                path: "subcategoryId",
                select: "_id title imageUrl createdAt"
            });

        if (!incompleteQuizzes || incompleteQuizzes.length === 0) {
            return res.status(404).json({ message: "No incomplete quizzes found for this user" });
        }

        // Format response
        res.json({
            type: "IncompleteQuizzes",
            _id: userId,  // Unique ID for the user
            data: incompleteQuizzes.map(quiz => ({
                _id: quiz.subcategoryId._id,
                title: quiz.subcategoryId.title,
                imageUrl: quiz.subcategoryId.imageUrl,
                createdAt: quiz.subcategoryId.createdAt
            }))
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    console.log("Deleting question with ID:", questionId);

    const result = await quizService.deleteQuestion(questionId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting question:", error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting quiz with ID:", id);

    const result = await quizService.deleteQuiz(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error: error.message });
  }
};

// exports.createQuiz=async(req,res)=>{
//    try {
//     const quiz= await quizService.createQuiz(req.body) 
//     res.status(201).json({success:true,message:'Quiz created successfully',data:quiz})
    
//    } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
    
//    }
// }

// exports.getAllQuizzes = async (req, res) => {
//   try {
//     const quizzes = await quizService.getAllQuizzes();
//     res.status(200).json({ success: true, data: quizzes });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.getQuizById = async (req, res) => {
//   try {
//     const quiz = await quizService.getQuizById(req.params.id);
//     if (!quiz) {
//       return res.status(404).json({ message: 'Quiz not found' });
//     }
//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching quiz', error });
//   }
// };
