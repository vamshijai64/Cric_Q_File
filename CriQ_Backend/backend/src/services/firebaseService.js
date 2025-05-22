// services/firebaseService.js
const admin = require('../configs/firebase');
const User = require('../models/userModel');

exports.sendPushToAllUsers = async (title, body) => {
  try {
    const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
    const tokens = users.map(user => user.fcmToken).filter(Boolean);

    if (tokens.length === 0) {
        console.log('No tokens to send push');
        return;
      }


      const message = {
        notification: {
          title:title,
          body: body,
        }
      };

      for (const token of tokens) {
        try {
          await admin.messaging().send({
            ...message,
            token,
          });
          console.log(`Notification sent to token: ${token}`);
        } catch (err) {
          console.error(` Error sending to ${token}:`, err.message);
        }

    }
    
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
}
