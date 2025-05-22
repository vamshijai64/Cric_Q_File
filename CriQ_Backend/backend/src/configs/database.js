const mongoose = require('mongoose');

require('dotenv').config();

const dbUrl = process.env.MONGO_URI;
 const { initializeAdmin } = require('../controllers/adminController')

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('MongoDB connected...')
        // initializeAdmin();  
    } catch (error) {
        console.log('MongoDB connection error: ', error.message);
        process.exit(1)
    }
}

module.exports = connectDB;