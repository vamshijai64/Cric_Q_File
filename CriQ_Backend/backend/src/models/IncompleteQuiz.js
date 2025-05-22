const mongoose=require('mongoose');

const incompleteQuizSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:"User",required:true
    },
    subcategoryId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' 
    },

    quizStatus: { type: String, default: "incomplete" },
    createdAt: { 
        type: Date, default: Date.now
    }
})
module.exports=mongoose.model('IncompleteQuiz',incompleteQuizSchema)

// const IncompleteQuiz =mongoose.model('IncompleteQuiz',incompleteQuizSchema);

// module.exports=IncompleteQuiz;