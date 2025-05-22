const userModel = require('../models/userModel')
const validations = require('../middlewares/validations')
const otpUtils = require('../utils/otpUtils');
const otpModel = require('../models/otpModel');
const mongoose = require('mongoose')
const Token = require('../models/tokenModel'); 
const jwt = require('jsonwebtoken')

exports.registerUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Email and password are required login.');
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error('User already registered with this email.');
    }

    const hashedPassword = await validations.hashPassword(password);
    const newUser = new userModel({ email, password: hashedPassword });
    return await newUser.save();
};

exports.socialLogin = async ({ email, password }) => {
    const user = await userModel.findOne({ email }).select("+password");;
    if (!user) throw new Error('Invalid email or user does not exist.');

    const validPassword = await validations.comparePassword(password, user.password);
    if (!validPassword){
        throw new Error('Invalid password.');
    } 

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET);


    await Token.create({ userId: user._id, token, });
    return { message: "Social login successful", user, token };
};

exports.getUserById = async (userId) => {
    if (!mongoose.isValidObjectId(userId)) return null;
    return await userModel.findById(userId, { password: 0 }).lean();
};

exports.getAllUsers = async () => {
    return await userModel.find().select('-password').lean();
};

exports.updateUserProfile = async (userId, updateData) => {
    if (!mongoose.isValidObjectId(userId)) throw new Error('Invalid user ID');
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
};

// exports.updateUserProfile = async (userId, updateData) => {
    
//     const user = await userModel.findById(userId).lean();
//     if (!user) throw new Error('User not found');
    
//     return await userModel.findByIdAndUpdate(userId, updateData, { new: true });
// };

exports.forgetPassword = async (email) => {
    const user = await userModel.findOne({ email });
    if(!user) throw new Error('User not found');

    const otp = otpUtils.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await otpModel.findOneAndUpdate(
        { email }, 
        { otp, expiresAt, status: 'sent' }, 
        { upsert: true, new: true }
    );

    await otpUtils.sendOtpEmail(email, otp);
};

exports.validateOtp = async (email, otp) => {
    const otpRecord = await otpModel.findOne({ email, otp, status: 'sent' });
    if (!otpRecord) throw new Error('Invalid or expired OTP');
    return otpRecord;
};

exports.resetPassword = async (email, otp, newPassword) => {
    const otpRecord = await otpModel.findOne({ email, otp, status: 'sent', expiresAt: { $gt: new Date() } });

    if (!otpRecord) throw new Error('Invalid or expired OTP');

    const hashedPassword = await validations.hashPassword(newPassword);
    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });

    // Now mark OTP as used after successful password reset
    await otpModel.findByIdAndUpdate(otpRecord._id, { status: 'used' });
    return { message: 'Password reset successful' };
}