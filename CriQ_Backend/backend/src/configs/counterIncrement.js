const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
    collectionName: { type: String, required: true },
    seq: { type: Number, default: 0 }
})

const Counter = mongoose.model('Counter', counterSchema);

exports.getNextSequenceValue = async (collectionName) => {
    const counter = await Counter.findOneAndUpdate(
        { collectionName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )
    return counter.seq
}