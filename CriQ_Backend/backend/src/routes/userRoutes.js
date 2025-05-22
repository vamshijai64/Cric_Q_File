const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
//const upload = require('../middlewares/uploadMiddleware'); // Middleware for handling file uploads
const authMiddleware = require("../middlewares/authMiddleware");
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

// Social login (Google)
router.post('/social-register', userController.socialRegister);
router.post('/social-login', userController.socialLogin);
router.post('/save-fcm-token', userController.saveFcmToken);

router.get('/profile/:userId', authMiddleware, userController.getUserProfile);
router.put('/profile/update', authMiddleware, userController.updateUserProfile);

router.post('/forgot-password', userController.forgotPassword);
router.post('/validate-otp', userController.validateOtp);
router.post('/reset-password', userController.resetPassword);

router.get('/users',  userController.getAllUsers);

module.exports = router;




