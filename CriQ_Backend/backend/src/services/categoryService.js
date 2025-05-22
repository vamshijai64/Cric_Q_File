
const CategeoryModel = require('../models/CategeoryModel');
const path = require("path");
const fs = require("fs");
const SubcategoryModel= require('../models/subcategoryModel')
const QuizModel=require('../models/QuizModel')



exports.createCategory=async(title,imageUrl,images)=>{

    try{
      if (!title || !imageUrl) {
        return res.status(400).json({ error: " Title and Image URL are required" });
    }
      
        const existingCategory = await CategeoryModel.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });

        if (existingCategory) {
          throw new Error('Category with this title already exists');
      }

  
    // const imageUrl=imageFile ? `/uploads/${imageFile.filename}`:null


         //  Save the actual S3 URL
    //const imageUrl = imageFile ? imageFile.location : null;
        
        const category=new CategeoryModel({title,imageUrl,images})
        
        return await category.save();
        
    }  catch(error){
        throw new Error(error.message)
    }   

}

exports.getAllCategories = async () => {
    try {
      return await CategeoryModel.find().populate('subcategories');
    } catch (error) {
      throw new Error('Error fetching categories: ' + error.message);
    }
  };

  // exports.getCategoryById=async(id)=>{
  // return await CategeoryModel.findById(id).populate("subcategories")
  // }

  exports.getCategoryById = async (id) => {
    try {
      return await CategeoryModel.findById(id).populate("subcategories");
    } catch (error) {
      console.error("Database error while fetching category:", error);
      throw new Error("Database error: " + error.message); 
    }
  };
  

exports.getCategorieyByName=async(title)=>{
    try {
      return await CategeoryModel.findOne({
        title: { $regex: new RegExp(title, "i") } // Case-insensitive search
      }).populate('subcategories');
    } catch (error) {
      throw new Error("Error fetching category by name: " + error.message);
    }
  }
  
//upadte category

exports.updateCategory =async (categoryId,  title, imageUrl)=>{
  try{
  const category=await CategeoryModel.findById(categoryId);
  if(!category) throw new Error('Categroy not found')
      // Update name if provided
  // const { title, imageUrl } = updateData;

  if (title) {
    category.title = title;
  }

 

    if (imageUrl) {
    // If the category already has an image in S3, delete it before updating
   
    category.imageUrl = imageUrl;
}
   if (title || imageUrl) {
      return await category.save();
    } else {
      throw new Error('No valid fields provided for update');
    }

} catch(error){
  throw new Error(error.message);

}
}

exports.deleteCategory = async (categoryId) => {
  try {
    console.log(" Checking if category exists...");

    // Find the category first
    const category = await CategeoryModel.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    console.log(" Category found. ID:", categoryId);

    // Fetch related subcategories
    const subcategories = await SubcategoryModel.find({ category: categoryId });
    
    if (subcategories.length > 0) {
      console.log(" Found", subcategories.length, "subcategories Checking quizzes");

      // Extract subcategory IDs
      const subcategoryIds = subcategories.map(subcategory => subcategory._id);

     
      await QuizModel.deleteMany({ subcategory: { $in: subcategoryIds } });
      console.log(" All quizzes related to subcategories deleted.");

      
      await SubcategoryModel.deleteMany({ category: categoryId });
      console.log(" All subcategories deleted.");
    }

   
    await CategeoryModel.findByIdAndDelete(categoryId);
    console.log(" Category deleted successfully.");

    return { message: "Category, subcategories, and quizzes deleted successfully" };
  } catch (error) {
    console.error(" Error deleting category:", error.message);
    throw new Error("Error deleting category: " + error.message);
  }
};
