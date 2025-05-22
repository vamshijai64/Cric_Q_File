const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: mongoose.Schema.Types.ObjectId, ref: 'Title', required: true }, // Referencing Title
    // rating: { type: Number, required: true, min: 1, max: 5, default: 0.0 },
    rating: { type: mongoose.Schema.Types.Decimal128, required: true }, // Force Decimal storage
    reviewText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});


reviewSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.rating = parseFloat(ret.rating.toString());  
        return ret;
    }
});


reviewSchema.set('toObject', {
    transform: (doc, ret) => {
        ret.rating = parseFloat(ret.rating.toString());
        return ret;
    }
});

module.exports = mongoose.model('Review', reviewSchema);