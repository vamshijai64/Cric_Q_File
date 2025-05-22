

const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  bannerType: {
    type: String,
    enum: ['CricketNews', 'Analysis', 'Categories'],
    required: true
  },
  description: {
    type: String,
    default: '',
  },
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
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Banner", bannerSchema);
