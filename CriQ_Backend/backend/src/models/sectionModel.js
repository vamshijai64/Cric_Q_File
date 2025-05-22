const mongoose = require('mongoose');
// const titleModel = require('../models/titleModel');

const sectionSchema = mongoose.Schema({
   title: { type: String, required: true, unique: true, index: true },
   imageUrl: {
      landscape: { type: String, default: "" },
      portrait: { type: String, default: "" },
      thumbnail: { type: String, default: "" },
    },
    images: [
      {
        landscape: { type: String,  },
        portrait: { type: String,  },
        thumbnail: { type: String,  },
      }
    ],
   titles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Title" }]
}, { timestamps: true });

module.exports = mongoose.model("Section", sectionSchema);