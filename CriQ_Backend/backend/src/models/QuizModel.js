


const mongoose = require('mongoose');  

const quizSchema = new mongoose.Schema({
  title: { 
    type: String,  
    default: "", 
  },
  subcategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategory', 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  questions: [
    {
      question: { 
        type: String, 
        required: true 
      },
      options: [
        { 
          id: { type: String, required: true }, 
          name: { type: String, required: true } 
        }
      ],
      correctOption: { 
        id: { type: String, required: true }, 
      },
      hint: {  
        type: String, 
        default: "",
      },
      imageUrl:{ 
        type: String, 
        default: "",
      },
      hashtags: [
        { 
          type: String, 
        
          trim: true, 
          lowercase: true, 
        }
      ], 
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);





