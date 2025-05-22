const userService = require('../services/userService')
const mongoose = require('mongoose')
const UserModel = require('../models/userModel')    

exports.socialRegister = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.registerUser({ email, password });
        res.json({ message: 'User registered successfully for social login', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.socialLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.socialLogin({ email, password });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const userIdFromToken = req.user.userId; 
        
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

 
        if (userId !== userIdFromToken) {
            return res.status(403).json({ error: "Unauthorized: Cannot access another user's profile" });
        }

        const user = await userService.getUserById(userId);
        if(!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        if(!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' })
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        // const userIdFromToken = req.user._id; 
        const userIdFromToken = req.user.userId; 
        const { userId, username,profileImage,gender,fan } = req.body;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Ensure user can only update their own profile
        if (userId && userId !== userIdFromToken) {
            return res.status(403).json({ error: "Unauthorized: Cannot update another user's profile" });
        }

        const updateData = {};        
        if (username) updateData.username = username;

        //this line without /

        //if (req.file?.path) updateData.profileImage = req.file.path; 


        //this line with / ....
        // if (req.file) {
        //     updateData.profileImage = req.file.location; // AWS S3 URL
        //   }

        // if (req.file) {
        //     updateData.profileImage = req.file.location; // AWS S3 URL  
        //   }
// if(req.file?.filename){
//     updateData.profileImage = `/upload/${req.file.filename}`
// }
        if(profileImage) updateData.profileImage = profileImage; // AWS S3 URL
        if(gender) updateData.gender = gender;
        if(fan) updateData.fan = fan

        const updatedUser = await userService.updateUserProfile(userIdFromToken, updateData);
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await userService.forgetPassword(email);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.validateOtp = async (req, res) => {
   try {
    const { email, otp } = req.body;
    await userService.validateOtp(email, otp);
    res.status(200).json({ message: 'OTP validated successfully' }); 
   } catch (error) {
    res.status(500).json({ error: error.message });
   }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        await userService.resetPassword(email, otp, newPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



exports.saveFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  try {
    await UserModel.findByIdAndUpdate(userId, { fcmToken });
    res.status(200).json({ message: 'FCM token saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save token' });
  }
};
