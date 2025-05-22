
const categoryService=require('../services/categoryService')
const CategeoryModel=require('../models/CategeoryModel')


exports.createCategory=async(req,res)=>{
    try {

        const {title,imageUrl,images }=req.body;
       // const imageFile=req.file 
    //    if (!title || !imageUrl) {
    //     return res.status(400).json({ error: "Title and Image URL are required" });
    // }
    if (
      !title ||
      !imageUrl ||
      !imageUrl.landscape ||
      !imageUrl.portrait ||
      !imageUrl.thumbnail
    ) {
      return res
        .status(400)
        .json({ error: "Title and all image sizes are required" });
    }


    
    //this line user for aws configuration
    // const imageUrl = imageFile.location;
    const category= await categoryService.createCategory(title,imageUrl,images);
  
      
   return res.status(201).json({ success: true, category });
        
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log("error",error);
        
    }
 }
  exports.getCategories = async (req, res) => {

        try {
          const categories = await categoryService.getAllCategories();
          res.status(200).json(categories);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching categories', error: error.message });
        }
        
      };
exports.getCategoryById=async (req,res)=>{
  try {

    const {id} =req.params;
    const category= await categoryService.getCategoryById(id);
    if(!category){

      return res.json(404).json({message:'Category not found'});

    }
           res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Error fetching category by ID", error: error.message });
    }
  }
}


exports.updateCategory =async (req,res) => {
  try {
    const { title,imageUrl } = req.body;
 
    const categoryId=req.params.id;

    const category = await categoryService.updateCategory(categoryId, title,imageUrl);
    res.status(200).json(category);
} catch (error) {
    res.status(400).json({ message: error.message });
}
  
} 

exports.getCategoriesBySearch = async (req, res) => {
  try {
      const { title } = req.query;

      if (!title) {
        console.log(" Search query is missing");
          return res.status(400).json({ message: "Search query is required" });
      }
      console.log(` Searching for categories matching: "${title}"`);

      // Case-insensitive search for categories that contain the search
      const categories = await CategeoryModel.find(title, {$regex: title, $options: "i"}).populate('subcategories');

      if (categories.length === 0) {
        console.log(" No categories found");
          return res.status(404).json({ message: "No categories found" });
      }
      console.log(` Found ${categories.length} categories`);
      return res.status(200).json(categories);

  } catch (error) {
    console.error(" Error searching categories:", error);
    return res.status(500).json({ message: "Error searching categories" });
   
  }
};

///Get by name 
exports.getCategorieyByName=async(req,res)=>{
  try {
    const { title } = req.query;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    console.log(` Searching for category: "${title}"`);

    const category = await categoryService.getCategorieyByName(title);

    if (!category) {
      console.log(` No category found for: "${title}"`);
      return res.status(404).json({ message: "Category Not Found" });
    }

    console.log(` Found category:`, category);
    return res.status(200).json(category);
  } catch (error) {
    console.error(" Error fetching category by name:", error);
    return res.status(500).json({
      message: "Error fetching category by name",
      error: error.message,
    });
  }

 
}



exports.deleteCategory = async (req, res) => {
  try {
    const response = await categoryService.deleteCategory(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};