const CategeoryModel = require('../models/CategeoryModel');
const subcategoryService = require('../services/subcategoryService');

exports.createSubcategory = async (req, res) => {

  try {
    const { title, category,imageUrl,images } = req.body;
    
    const subcategory = await subcategoryService.createSubcategory(title, imageUrl,images, category);
    
    res.status(201).json({ message: 'Subcategory created successfully', subcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating subcategory', error: error.message });
  }
};

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await subcategoryService.getAllSubcategories();
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
  }
};

exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await subcategoryService.getSubcategoryById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategory", error: error.message });
  }
};



exports.searchSubcategoryByName = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Search query is required" });
    }
    console.log(` Searching subcategory for: ${title}`);

    const subcategory = await subcategoryService.searchSubcategoryByName(title);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    
    res.status(200).json(subcategory);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error searching subcategory", error: error.message });
  }
};



// controllers/subcategoryController.js

exports.updateSubcategory = async (req, res) => {
  try {
    const { title, imageUrl } = req.body; 
    console.log("Received Title:", title);
    console.log("Received Image URL:", imageUrl) // Destructuring title and imageUrl from the request body
    const subcategoryId = req.params.id;   // Getting the subcategoryId from the request params

    console.log("Received Title:", title);
    console.log("Received Image URL:", imageUrl);

    if (!subcategoryId) {
      return res.status(400).json({ message: "Invalid subcategory ID" });
    }

    // Call service to update the subcategory
    const updatedSubcategory = await subcategoryService.updateSubcategory(subcategoryId, title, imageUrl);

    return res.status(200).json({
      message: "Subcategory updated successfully",
      updatedSubcategory,
    });
  } catch (error) {
    console.error("Error updating subcategory:", error.message);
    return res.status(400).json({
      message: "Error updating subcategory",
      error: error.message,
    });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    await subcategoryService.deleteSubcategory(req.params.id);
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subcategory", error: error.message });
  }
};