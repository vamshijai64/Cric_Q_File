const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ['sent', 'used'], default: 'sent' },
});

module.exports = mongoose.model('Otp', otpSchema);