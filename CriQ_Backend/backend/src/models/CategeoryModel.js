// models/Category.js
const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({

  title: { type: String, required: true, unique: true },
  // imageUrl:{type:String,default:""},

  imageUrl: {
    landscape: { type: String, default: "" },
    portrait: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
  },
  images: [
    {
      landscape: { type: String,},
      portrait: { type: String,  },
      thumbnail: { type: String, },
    }
  ],
 
 
  subcategories: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Subcategory' }]
},
 { timestamps: true });




module.exports = mongoose.model('Category', categorySchema);
