

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: { type: String, default: "" },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type: String ,default: ""},
    fan: { type: String,default: "" },
    profileImage: { type: String ,default: ""},
    points: { type: Number, default: 0 }, // Total score of user
    quizzesPlayed: { type: Number, default: 0 }, // Total quizzes played
    fcmToken: { type: String, default: "" },


},{timestamps:true}
)

userSchema.pre('save', async function (next) {
    // Ensure password is not already hashed before rehashing
    if (!this.isModified('password') || this.password.startsWith('$2b$')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", userSchema);
