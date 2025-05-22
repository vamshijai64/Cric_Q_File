const express=  require("express");
const router=express.Router();
const upload=require('../middlewares/uploadMiddleware')

const categoryController=require("../controllers/categoryController") 

router.post("/create",categoryController.createCategory)
router.get('/:id',categoryController.getCategoryById)
router.get('/name/search',categoryController.getCategorieyByName)
router.get('/search',categoryController.getCategoriesBySearch)
router.put("/:id",  categoryController.updateCategory);
//router.put("/:id", upload.single('image'), categoryController.updateCategory);

router.get('/', categoryController.getCategories);
router.delete("/:id", categoryController.deleteCategory);

module.exports=router