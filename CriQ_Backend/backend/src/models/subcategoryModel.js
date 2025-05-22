

const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  imageUrl: {
    landscape: { type: String, default: "" },
    portrait: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
  },
  images:[],
 
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
}, { timestamps: true });



module.exports = mongoose.model('Subcategory', subcategorySchema);




///---------------------------------
// // models/Subcategory.js
// const mongoose = require('mongoose');


// const subcategorySchema = new mongoose.Schema({
  
//   title: { type: String, required: true },

//   imageUrl:{type:String},

//   category: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Category', 
//     required: true },
//   quizzes: 
//   [
//     { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Quiz' 
//   }
// ]
// }, { timestamps: true });
// // Create a case-insensitive unique index
// subcategorySchema.index({ name: 1 }, { unique: true });



// module.exports = mongoose.model('Subcategory', subcategorySchema);

