const movieNewsService = require('../services/movienewsService');
//const User = require('../models/userModel');
const { sendPushToAllUsers } = require('../services/firebaseService');
exports.addMovieNews = async (req, res) => {
    try {
     
        const { title, description,images } = req.body;

           // Check if imageUrl is present in the request body
           let { imageUrl } = req.body;
        
           // If imageUrl is not provided, assign an empty object
           if (!imageUrl) {
               imageUrl = {};
           }
        //const imageFile=req.file;
        console.log("Received imageUrl:", imageUrl);
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: "At least one image set is required" });
        }

    const news = await movieNewsService.addMovieNews({ title, description, imageUrl,images });

    await sendPushToAllUsers('Cricket News!', `${title}: ${description}`);

    const responseNews = {
        ...news.toObject(),
        imageUrl: imageUrl || {},  // Ensure imageUrl is empty if not provided
    };


  
    // // 2. Get all users with a valid FCM token
    // const users = await User.find({ fcmToken: { $ne: null } });

    // // 3. Build FCM message payload
    // const message = {
    //   notification: {
    //     title: 'New Movie News!',
    //     body: `${title}: ${description}`,
    //   },
    // };

    // // 4. Send notification to each user
    // for (const user of users) {
    //   if (user.fcmToken) {
    //     await sendNotification(user.fcmToken, message);
    //   }
    // }

        // res.status(201).json({ message: "Movie news added successfully", news });
        // console.log(news, "movienews");

        res.status(201).json({ message: "Cricket News added successfully", news: responseNews });
        console.log(responseNews, "Cricket News");
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Cricket News error:", error);
    }
};
exports.getMovieNewsById=async(req,res)=>{
    try{
        const {id}=req.params
        const news=await movieNewsService.getMovieNewsById(id);
        if (!news) {
            return res.status(404).json({ error: "Cricket News not found" });
        }
        res.json(news);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}
exports.getMovieNews = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        const news = await movieNewsService.getMovieNews({ title, description, imageUrl });
        
        res.status(201).json({ message: 'Cricket news added successfully', news });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error,"Cricket News error");
        
    }
};
exports.updateMovieNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, imageUrl, images } = req.body;

        // Check if the movie news exists
        const existingNews = await movieNewsService.getMovieNewsById(id);
        if (!existingNews) {
            return res.status(404).json({ error: "Movie news not found" });
        }

        // Build updateFields dynamically
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;
        if (images !== undefined) updateFields.images = images;

        // If no valid fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const updatedNews = await movieNewsService.updateMovieNews(id, updateFields);

        res.status(200).json({
            message: "Cricket news updated successfully",
            updatedNews,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLatestMovieNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        const news = await movieNewsService.getLatestMovieNews({
            page: parseInt(page),
            limit: parseInt(limit),
            search
        });

        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteMovieNews = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await movieNewsService.deleteMovieNews(id);
        if (!news) {
            return res.status(404).json({ error: "Movie news not found" });
        }

        res.status(200).json({
            message: "Cricket news deleted successfully",
            deletedNews: news,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
