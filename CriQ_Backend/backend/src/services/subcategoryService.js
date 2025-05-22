
const fs = require("fs");
const path = require("path");
const CategeoryModel = require('../models/CategeoryModel');
const subcategoryModel = require('../models/subcategoryModel')
const quizModel=require('../models/QuizModel')
// const questionModel=require('../models/questionModel')


exports.createSubcategory = async (title, imageUrl,images,category) => {
 

  try {
    if (!title) {
      throw new Error("Subcategory title is required");
    }

    const normalizedName = title.trim().toLowerCase();

   
    if (!normalizedName) {
      throw new Error("Subcategory title cannot be empty");
    }


    const existingSubcategory = await subcategoryModel.findOne({
      title: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existingSubcategory) {
      throw new Error("Subcategory with this name already exists");
    }

 
    const categoryDoc = await CategeoryModel.findById(category);
    if (!categoryDoc) {
      throw new Error("Category not found");
    }
    const subcategory = new subcategoryModel({
      title: normalizedName, 
      imageUrl: imageUrl,
      images: images,
      category: categoryDoc._id,
    });

    const savedSubcategory = await subcategory.save();

    categoryDoc.subcategories.push(savedSubcategory._id);
    await categoryDoc.save();

    return savedSubcategory;
  } catch (error) {
    throw new Error("Error creating subcategory: " + error.message);
  }
};



exports.searchSubcategoryByName = async (title) => {
  try {
    return await subcategoryModel.findOne({  title: { $regex: title, $options: "i" }, 
    }).populate("category").populate("quizzes");

  } catch (error) {
    throw new Error("Error searching subcategory: " + error.message);
  }
};

exports.getAllSubcategories = async () => {
  try {
    return await subcategoryModel.find()
    .populate('category')
    .populate('quizzes')  
    .populate({
      path: "quizzes",
      select: "title subcategory category questions createdAt updatedAt",
      populate: {
          path: "questions", 
          select: "question options imageUrl correctOption hints hashtags" 
      }    }).lean()
  } catch (error) {
    throw new Error('Error fetching subcategories: ' + error.message);
  }
};


exports.getSubcategoryById = async (id) => {
  try {
    return await subcategoryModel.findById(id).populate("category").populate("quizzes");
  } catch (error) {
    throw new Error("Error fetching subcategory by ID: " + error.message);
  }
};


exports.updateSubcategory = async (subcategoryId, title, imageUrl) => {
  try {
    const subcategory = await subcategoryModel.findById(subcategoryId);
    if (!subcategory) throw new Error("Subcategory not found");

    let updateData = {};

    // Update title if different
    if (title && title !== subcategory.title) {
      updateData.title = title;
    }

    // Safely update imageUrl fields
    if (imageUrl) {
      const updatedImageUrl = { ...subcategory.imageUrl };

      if (imageUrl.landscape && imageUrl.landscape !== subcategory.imageUrl.landscape) {
        updatedImageUrl.landscape = imageUrl.landscape;
      }

      if (imageUrl.portrait && imageUrl.portrait !== subcategory.imageUrl.portrait) {
        updatedImageUrl.portrait = imageUrl.portrait;
      }

      if (imageUrl.thumbnail && imageUrl.thumbnail !== subcategory.imageUrl.thumbnail) {
        updatedImageUrl.thumbnail = imageUrl.thumbnail;
      }

      updateData.imageUrl = updatedImageUrl;
    }

    const updatedSubcategory = await subcategoryModel.findByIdAndUpdate(
      subcategoryId,
      { $set: updateData },
      { new: true }
    );

    return updatedSubcategory;
  } catch (error) {
    throw new Error("Error updating subcategory: " + error.message);
  }
};

//  Delete Subcategory
exports.deleteSubcategory = async (subcategoryId) => {
  try {
    console.log(" Received Subcategory ID for deletion:", subcategoryId);

    const subcategory = await subcategoryModel.findById(subcategoryId);
    if (!subcategory) throw new Error("Subcategory not found");

    console.log("Subcategory found. ID:", subcategoryId);

  
    console.log(" Removing subcategory reference from category...");
    await CategeoryModel.findByIdAndUpdate(subcategory.category, {
      $pull: { subcategories: subcategoryId },
    });
    console.log(" Subcategory removed from category.");

   
    console.log(" Checking related quizzes");
    const quizzes = await quizModel.find({ subcategory: subcategoryId });

    if (quizzes.length > 0) {
      console.log(" Found", quizzes.length, "quizzes. Deleting them...");
      await quizModel.deleteMany({ subcategory: subcategoryId });
      console.log(" All quizzes deleted.");
    }


    if (subcategory.image) {
      const imagePath = path.join(__dirname, "..", subcategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(" Subcategory image deleted.");
      }
    }

  
    await subcategoryModel.findByIdAndDelete(subcategoryId);
    console.log(" Subcategory deleted successfully.");

    return { message: "Subcategory and related quizzes deleted successfully" };
  } catch (error) {
    console.error(" Error deleting subcategory:", error.message);
    throw new Error("Error deleting subcategory: " + error.message);
  }
};