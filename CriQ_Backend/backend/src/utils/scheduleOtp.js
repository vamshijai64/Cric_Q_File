const cron = require('node-cron');
const Otp = require('../models/otpModel');

//Periodically clear expired OTP records from the database to avoid bloating the collection.
// Schedule a task to run every minute to clean up expired OTPs
cron.schedule('* * * * *', async () => {
        console.log('Running cron job to clean up expired OTPs');
        await Otp.deleteMany({ expiresAt: { $lt: new Date() }, status: 'sent' });
        console.log('Expired OTPs deleted');
});