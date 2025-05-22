
//this code old quiz serivce code..........
const QuizModel = require("../models/QuizModel");
const mongoose = require("mongoose");
const User=require('../models/userModel')
const IncompleteQuiz = require('../models/IncompleteQuiz')





const subcategoryModel = require("../models/subcategoryModel");


exports.createQuiz = async (title, subcategory,category, questions) => {

  try {
    const subcategoryDoc = await subcategoryModel.findById(subcategory);
    if (!subcategoryDoc) {
      throw new Error("Subcategory not found");
    }

   
    let existingQuiz = await QuizModel.findOne({ subcategory });

    if (existingQuiz) {

     
      for (const questionObj of questions) {
        const isDuplicate = existingQuiz.questions.some(
          (q) => q.question === questionObj.question);

        if (isDuplicate) {
          throw new Error(`Duplicate question found: ${questionObj.question}`);
        }
      }

      //  Add new questions to the existing quiz
      existingQuiz.questions.push(...questions);
      await existingQuiz.save();

      return existingQuiz;

    } else {

      //  If no quiz exists, create a new one
      const newQuiz = new QuizModel({
        title,
        subcategory: subcategoryDoc._id,
        category,
        questions,
      });

      const savedQuiz = await newQuiz.save();

      subcategoryDoc.quizzes.push(savedQuiz._id);
      await subcategoryDoc.save();

      return savedQuiz;
    }
  } catch (error) {
    throw new Error("Error creating/updating quiz: " + error.message);
  }
  
};

// exports.createQuiz = async (title, subcategory, category, questions) => {
//   try {
//     // Case 1: If subcategory is provided — do the normal process
//     if (subcategory && category) {
//       const subcategoryDoc = await subcategoryModel.findById(subcategory);
//       if (!subcategoryDoc) {
//         throw new Error("Subcategory not found");
//       }

//       let existingQuiz = await QuizModel.findOne({ subcategory });

//       if (existingQuiz) {
//         // Check for duplicates
//         for (const questionObj of questions) {
//           const isDuplicate = existingQuiz.questions.some(
//             (q) => q.question === questionObj.question
//           );
//           if (isDuplicate) {
//             throw new Error(`Duplicate question found: ${questionObj.question}`);
//           }
//         }
//         existingQuiz.questions.push(...questions);
//         await existingQuiz.save();
//         return existingQuiz;
//       } else {
//         const newQuiz = new QuizModel({
//           title,
//           subcategory: subcategoryDoc._id,
//           category,
//           questions,
//         });

//         const savedQuiz = await newQuiz.save();

//         subcategoryDoc.quizzes.push(savedQuiz._id);
//         await subcategoryDoc.save();

//         return savedQuiz;
//       }
//     }

//     // Case 2: If subcategory/category not provided (event special)
//     else {
//       const newQuiz = new QuizModel({
//         title,
//         questions,
//       });
//       const savedQuiz = await newQuiz.save();
//       return savedQuiz;
//     }
//   } catch (error) {
//     throw new Error("Error creating/updating quiz: " + error.message);
//   }
// };


exports.getAllQuizzes = async () => {
  try {
    const quizzes= await QuizModel.find()
      
      .populate({
        path: 'subcategory',
        populate: { path: 'category' } // Populate category inside subcategory
      });

      quizzes.forEach(quiz=>{
        quiz.questions=quiz.questions.map(question=>{
          const correctOption=question.options.find(option=>option.id === question.correctOption.id);

          return{
            ...question.toObject(),
            correctOptionDetails:correctOption || null

          }
        })
      });
      return quizzes;

      // quizzes.forEach(quiz => {
      //   quiz.questions.forEach(question => {
      //     // Match the correct option based on the correctOption id
      //     const correctOption = question.options.find(option => option.id === question.correctOption.id);
      //     if (correctOption) {
      //       question.correctOption = correctOption; // Update correctOption field to match the option object
      //     }
      //   });
      // });
   //   return quizzes;


      
  } catch (error) {
    throw new Error('Error fetching quizzes: ' + error.message);
  }
};

exports.getRandomQuizQuestions=async(subcategoryId)=>{
  try{
    const quizzes=await QuizModel.find({subcategory:subcategoryId})
    .populate({
      path:"subcategory",
      select:"name image",
     })
     .populate({
      path:"category",
      select:"name imageUrl"
    }).populate({
      path:"questions",
      select:"question options image"
    });

    if (!quizzes.length) {
      return { error: "No quizzes found for this subcategory." };
    }

    
    let allQuestions = quizzes.flatMap((quiz) => quiz.questions);

    
    if (allQuestions.length > 9) {
      allQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 9);
    }
    return {
      quizTitle: quizzes[0].title,
      subcategory: quizzes[0].subcategory,
      category: quizzes[0].category,
      questions: allQuestions,
    };
  } catch (error) {
    console.error("Error in quiz service:", error);
    return { error: "Internal server error" };
  }
}

exports.getRandomQuizQuestionsWithHashtags = async (subcategoryId) => {

  try {
      //this line will retruun id with title  
        const subcategoryData = await subcategoryModel.findById(subcategoryId).select("title");

    if (!subcategoryData) {
      return { error: "Subcategory not found" };
   }


    const subcategoryName = subcategoryData.title;

   //Fetch all quizzes from the database where the subcategory matches the given subcategoryId.
    const normalQuizzes = await QuizModel.find({ subcategory: subcategoryId });

  // collect to all questions into single array using flatmap
    let normalQuestions = normalQuizzes.flatMap(quiz => quiz.questions);

   
    const hashtagRegex = new RegExp(subcategoryName, 'i'); 


    const hashtagQuizzes = await QuizModel.find({
      subcategory: { $ne: subcategoryId },
      "questions.hashtags": { $elemMatch: { $regex: hashtagRegex } }
    });

   /* 
   For each quiz found above, go inside each question.
   Only keep the questions that have a hashtag matching the regex.
   Flatten all matching questions into one array called hashtagQuestion8 */

    let hashtagQuestions = hashtagQuizzes.flatMap(quiz =>
      quiz.questions.filter(q =>
        q.hashtags.some(h => hashtagRegex.test(h))
      )
    );


    // Combine and randomize
    let combinedQuestions = [...normalQuestions, ...hashtagQuestions];
    combinedQuestions = combinedQuestions.sort(() => 0.5 - Math.random()).slice(0, 9);

    return {
      questions: combinedQuestions,
      subcategory: subcategoryData
    };
  } catch (error) {
    console.error("Error in fetching questions:", error);
    return { error: "Internal server error" };
  }
};





exports.getLatestQuizzes = async ({ page, limit, category, subcategory }) => {
    const query = {};
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    const quizzes = await QuizModel.find(query)
        .sort({ createdAt: -1 })  // Sort by latest
        .skip((page - 1) * limit) // Pagination
        .limit(limit)
        .populate('category subcategory'); // Populate category details

    const totalQuizzes = await QuizModel.countDocuments(query);

    return {
        quizzes,
        totalQuizzes,
        currentPage: page,
        totalPages: Math.ceil(totalQuizzes / limit)
    };
};

exports.updateQuestion = async(quizId,  questionId,updateData)=>{
  try {
    console.log(` Finding quiz with ID: ${quizId}`);
    const quiz = await QuizModel.findById(quizId);

    if (!quiz) throw new Error("Quiz not found");

    console.log(" Quiz found:", quiz._id);
    console.log(" Searching for question with ID:", questionId);
    console.log(" Available question IDs before update:", quiz.questions.map(q => q._id.toString()));


    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);

    if (questionIndex === -1) {
      throw new Error(`Question ID not found: ${questionId}`);
    }

  
    // quiz.questions[questionIndex].question = updateData.question;
    // quiz.questions[questionIndex].correctOption = updateData.correctOption;
    // quiz.questions[questionIndex].hint = updateData.hint;
    // quiz.questions[questionIndex].hashtags = updateData.hashtags;

    const question = quiz.questions[questionIndex];

    // Update only the fields provided in updateData
    if (updateData.question !== undefined) question.question = updateData.question;
    if(updateData.options !== undefined) question.options = updateData.options;
    if (updateData.correctOption !== undefined) question.correctOption = updateData.correctOption;
    if (updateData.hint !== undefined) question.hint = updateData.hint;
    if (updateData.hashtags !== undefined) question.hashtags = updateData.hashtags;

    //  Save the updated quiz
    const updatedQuiz = await quiz.save();

    console.log(" Available question IDs after update:", updatedQuiz.questions.map(q => q._id.toString()));
    console.log(" Question updated successfully!");

    return { message: "Question updated successfully", quiz: updatedQuiz };
  } catch (error) {
    console.error(` Update failed: ${error.message}`);
    throw new Error(`Update failed: ${error.message}`);
  }
}
exports.getQuestionsByHashtag = async (hashtag) => {
  try {
      const tag = `#${hashtag.toLowerCase()}`;
     // const quizzes = await QuizModel.find({ "questions.hashtags": tag });
     const quizzes = await QuizModel.find({
      "questions.hashtags": { $regex: `^${tag}$`, $options: "i" }  // Case-insensitive match
  });


      if (!quizzes.length) {
          return { success: false, message: "No questions found for this hashtag." };
      }

      // Extract matching questions
      const questions = quizzes.flatMap(quiz =>
          quiz.questions.filter(q => q.hashtags.includes(tag))
      );

      // Shuffle & return 9 random questions
      const shuffledQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 9);
      
      return { success: true, data: shuffledQuestions };
  } catch (error) {
      throw new Error(error.message);
  }
};


///==========just ==================
// services/quizService.js



exports.getByHashtag = async (hashtag) => {
  try {
    const tag = `#${hashtag.toLowerCase()}`;
    const quizzes = await QuizModel.find({
      "questions.hashtags": { $regex: `^${tag}$`, $options: "i" }
    });

    if (!quizzes.length) {
      return { success: false, message: "No questions found for this hashtag." };
    }

    const allQuestions = quizzes.flatMap(quiz =>
      quiz.questions
        .filter(q => q.hashtags.includes(tag))
        .map(q => ({
          ...q.toObject(),
          quizCreatedAt: quiz.createdAt,
        }))
    );

    const sortedByLatest = allQuestions.sort(
      (a, b) => new Date(b.quizCreatedAt) - new Date(a.quizCreatedAt)
    );

    const latestQuestions = sortedByLatest.slice(0, 20);
    const oldQuestions = sortedByLatest.slice(20);

    const selectedLatest = latestQuestions.slice(0, 9);
    const remainingCount = 9 - selectedLatest.length;

    let randomOld = [];
    if (remainingCount > 0 && oldQuestions.length > 0) {
      randomOld = oldQuestions.sort(() => 0.5 - Math.random()).slice(0, remainingCount);
    }

    const combined = [...selectedLatest, ...randomOld];
    const finalNine = combined.sort(() => 0.5 - Math.random());

    return { success: true, data: finalNine };
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.saveQuitQuiz = async (userId,subcategoryId) => {

  const user= await User.findById(userId).exec();
  if(!user) throw new Error('User Not Found');

  let existing = await IncompleteQuiz.findOne({userId,subcategoryId});

  if (!existing) {
    existing = await IncompleteQuiz.create({ userId, subcategoryId });
}

return { _id: existing._id, userId, subcategoryId };
  
}

// exports.getIncompleteQuizzes =async (userId) => {
//   const incompleteQuizzes = await IncompleteQuiz.find({ userId }).populate('subcategoryId',"title").lean();
  
//   const formattedData = incompleteQuizzes.map(quiz => {
//     if (quiz.subcategoryId) {
//       return {
//         subcategoryId: quiz.subcategoryId._id,
//         subcategoryTitle: quiz.subcategoryId.title
//       };
//     } else {
//       return null; // handle cases where subcategory doesn't exist
//     }
//   }).filter(item => item !== null); // remove null values

//   return formattedData;
// }
exports.deleteQuestion = async (questionId) => {
  try {
    const quiz = await QuizModel.findOne({ "questions._id": questionId });

    if (!quiz) {
      throw new Error("Quiz not found for the given question ID");
    }

    // Filter out the question to delete it
    quiz.questions = quiz.questions.filter(q => q._id.toString() !== questionId);
    await quiz.save();

    return { message: "Question deleted successfully", deletedQuestionId: questionId };
  } catch (error) {
    throw new Error("Error deleting question: " + error.message);
  }
};


exports.deleteQuiz=async (quizId)=>{
  try {
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Remove quiz ID from subcategory
      await subcategoryModel.findByIdAndUpdate(
      quiz.subcategory,
      { $pull: { quizzes: quizId } }, 
      { new: true }
    );

    // Delete the quiz
    await QuizModel.findByIdAndDelete(quizId);
    return { message: "Quiz deleted successfully" }; // Returning the result
  } catch (error) {
    throw new Error("Error deleting quiz: " + error.message);
  }
}




//create Quiz Old code
  // try {
  //   const subcategoryDoc = await subcategoryModel.findById(subcategory);
  //   if (!subcategoryDoc) {
  //     throw new Error('Subcategory not found');
  //   }
    
  //   for(const questionObj of questions){
  //     const existingQuiz= await QuizModel.findOne({
  //       subcategory,
  //       'questions.question':questionObj.question
  //     })

  //     if(existingQuiz){
  //       throw new Error(`Duplicate question found :${questionObj.question}`);
  //     }
  //        // Remove the _id field from each option in the question
  //       //  questionObj.options = questionObj.options.map(option => {
  //       //   const { _id, ...rest } = option;  // Remove the _id field
  //       //   return rest; // Return the option without _id
  //       // });
  //     }

  //   const quiz = new QuizModel({ title, subcategory: subcategoryDoc._id, category, questions });
  //   const savedQuiz= await quiz.save();


  //   subcategoryDoc.quizzes.push(savedQuiz._id);
  //   await subcategoryDoc.save();

  //   return savedQuiz;

  // } catch (error) {
  //   throw new Error('Error creating quiz:' + error.message);
  // }




// exports.getRandomQuestionsBySubcategory = async (subcategoryId) => {
//   try {
//     const objectId = new mongoose.Types.ObjectId(subcategoryId); // Convert to ObjectId

//     const quizzes = await QuizModel.aggregate([
//         { $match: { subcategory: objectId } }, // Ensure subcategory ID matches
//         { $unwind: "$questions" }, // Flatten questions array
//         { $sample: { size: 9 } }, // Get 9 random questions
//         { 
//             $project: { 
//                 _id: 0, 
//                 "questions.question": 1, 
//                 "questions.options": 1, 
//                 "questions.correctOption": 1 
//             } 
//         } 
//     ]);

//     return quizzes.map(q => q.questions); // Return only questions array
// } catch (error) {
//     console.error("Error fetching random questions:", error);
//     return [];
// }// Extract only the question objects
// };




// exports.getQuizzesBySubcategory = async (subcategoryId) => {
//   try {
//     return await QuizModel.find({ subcategory: subcategoryId });
//   } catch (error) {
//     throw new Error('Error fetching quizzes: ' + error.message);
//   }
// };

// exports.getQuizzesBySubcategory = async (subcategoryId) => {
//   const quizzes = await QuizModel.find({ subcategory: subcategoryId });

//   //  Limit questions to 9 per quiz
//   return quizzes.map(quiz => ({
//       ...quiz._doc,
//       questions: quiz.questions.slice(0, 9) // 
//   }))
// };














//-----------------------------------------------------------

//this is the hashtags queestion
// const Subcategory=require('../models/subcategoryModel')
// const Quiz=require('../models/QuizModel')

// exports.createQuiz= async(data)=>{
  
//   const{title,subcategory,category}=data;

//   const existingSubcategory = await Subcategory.findById(subcategory);
//   if (!existingSubcategory) {
//       throw new Error('Subcategory not found');
//   }

//   const newQuiz= new Quiz({
//     title,
//     subcategory,
//     category,
   
//   });
//   const savedQuiz= await newQuiz.save();

//   await Subcategory.findByIdAndUpdate(subcategory,{
//     $push:{quizzes:savedQuiz.id}
//   })
//   return savedQuiz;

// }

// exports.getAllQuizzes = async () => {
//    try {
//         const quizzes = await Quiz.find()
//             .populate({
//                 path: 'subcategory',
//                 select: 'name image' // Include only name and image
//             })
//             .populate({
//                 path: 'category',
//                 select: 'name imageUrl' // Include only name and image
//             }).populate({
//               path: "questions", 
//               select: "question options image correctOption hints hashtags"
//             });
//             console.log(quizzes);
//         return quizzes;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };
// exports.getQuizById = async (id) => {
//   return await Quiz.findById(id)
//     .populate({
//       path: "subcategory",
//       select: "name image quizzes",
//       populate: {
//         path: "quizzes",
//         select: "title"
//       }
//     })
//     .populate({
//       path: "category",
//       select: "name imageUrl"
//     })
//     .populate({
//       path: "questions", 
//       select: "question options image correctOption hints"
//     })
//     .exec();
// };

// exports.getAllQuizzes = async () => {
//   return await Quiz.find().populate({
//     path: 'questions',
//     select: 'question options image correctOption hints'
//   }).exec();
// };

// exports.getQuizById = async (id) => {
//   return await Quiz.findById(id).populate({
//     path: 'questions',
//     select: 'question options image correctOption hints'
//   }).exec();
// };





// exports.getAllQuizzes = async () => {
//   try {
//     const quizzes = await QuizModel.find()
//       .populate({
//         path: 'subcategory',
//         select: '-__v -quizzes -createdAt -updatedAt',
//         populate: {
//           path: 'category',
//           select: '-__v -subcategories -createdAt -updatedAt',
//         },
//       })
//       .lean(); // Use lean to get plain JavaScript objects

//     // Process quizzes to match the correctOption and remove _id fields
//     const cleanedQuizzes = quizzes.map((quiz) => {
//       const { _id, __v, ...quizWithoutId } = quiz; // Remove _id and __v from quiz

//       quizWithoutId.questions = quiz.questions.map((question) => {
//         const { _id: questionId, ...questionWithoutId } = question; // Remove _id from question

//         // Match the correct option based on the correctOption id
//         const correctOption = question.options.find(
//           (option) => option.id === question.correctOption.id
//         );
//         if (correctOption) {
//           questionWithoutId.correctOption = {
//             id: correctOption.id,
//             name: correctOption.name,
//           };
//         }

//         // Remove _id from options
//         questionWithoutId.options = question.options.map(({ _id: optionId, ...option }) => option);

//         return questionWithoutId;
//       });

//       return quizWithoutId;
//     });

//     return cleanedQuizzes;
//   } catch (error) {
//     throw new Error('Error fetching quizzes: ' + error.message);
//   }
// };

