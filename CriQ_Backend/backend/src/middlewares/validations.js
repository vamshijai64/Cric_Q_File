const userModel = require('../models/userModel');
const bcrypt = require('bcrypt')

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (userpassword, dbPassword) => {
    return await bcrypt.compare(userpassword, dbPassword)
};

exports.isEmailRegistered = async (email) => {
    const existingUser = await userModel.findOne({email});
    return existingUser; // Will return null if no user found
}