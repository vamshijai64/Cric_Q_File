// const cron = require('node-cron');
// const admin = require('../configs/firebase');
// const User = require('../models/userModel');
// const MovieNewsmodel = require('../models/movieNewsModel'); // Assuming you have a MovieNews model

// const sendDailyMovieNews = async () => {
//   try {
//     const newsList = await MovieNewsmodel.find().sort({ createdAt: -1 }).limit(5);
//     if (!newsList.length) return;

//     const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
//     const tokens = users.map(user => user.fcmToken).filter(Boolean);

//     for (const token of tokens) {
//       for (const news of newsList) {
//         const message = {
//           notification: {
//             title: 'Top Movie News',
//             body: `${news.title}: ${news.description.slice(0, 50)}...`,
//           },
//           token,
//         };
//         try {
//           await admin.messaging().send(message);
//           console.log(`Sent notification for "${news.title}" to ${token}`);
//         } catch (err) {
//           console.error(`Failed for token ${token}:`, err.message);
//         }
//       }
//     }
//   } catch (err) {
//     console.error("Error in daily movie news cron job:", err);
//   }
// };

// // Schedule: 9:00 AM daily
// cron.schedule('0 9 * * *', sendDailyMovieNews);
// // cron.schedule('* * * * *', sendDailyMovieNews);
// // cron.schedule('*/10 * * * * *', sendDailyMovieNews);




const cron = require('node-cron');
const admin = require('../configs/firebase');
const User = require('../models/userModel');
const MovieNewsmodel = require('../models/movienewsModel');

// Function to send daily movie news notifications
const sendDailyMovieNews = async () => {
  try {
    // Fetch the top 5 latest movie news
    const newsList = await MovieNewsmodel.find().sort({ createdAt: -1 }).limit(2);
    if (!newsList.length) return; // If no news found, exit the function

    // Fetch all users with a valid fcmToken
    const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
    const tokens = users.map(user => user.fcmToken).filter(Boolean);

    if (tokens.length === 0) {
      console.log('No valid FCM tokens found.');
      return;
    }

    // Loop through each user token and send notifications
    for (const token of tokens) {
      // Prepare message for each user
      const messages = newsList.map(news => ({
        notification: {
          title: 'Top Cricket News',
          body: `${news.title}: ${news.description.slice(0, 50)}...`,
        },
        token,
      }));

      // Send notifications for all news items for this user
      for (const message of messages) {
        try {
          await admin.messaging().send(message); // Send each message
          console.log(`Sent notification for "${message.notification.title}" to ${message.token}`);
        } catch (err) {
          console.error(`Failed to send notification for token ${message.token}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error("Error in daily movie news cron job:", err);
  }
};

// Schedule: Run at 9:00 AM daily
cron.schedule('0 9 * * *', sendDailyMovieNews); // Adjust to your desired time (9:00 AM in this case)
 //cron.schedule('* * * * *', sendDailyMovieNews); // Uncomment this for every minute (testing only)
//cron.schedule('*/10 * * * * *', sendDailyMovieNews); // Uncomment for every 10 seconds (testing only)
