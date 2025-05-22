const express = require('express');
const router = express.Router();
const TitleController = require('../controllers/titleController');
// const adminAuthController = require('../middlewares/adminAuthMiddleware');
const adminAuthController = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
                                    //adminAuthController,
 router.post('/addTitle/:sectionId', TitleController.addTitle);
//router.post('/addTitle/:sectionId', upload.single('imageUrl'), TitleController.addTitle);
router.get('/getTitle/:id', TitleController.getTitle); // To fetch all title based on the id
router.get('/getAllTitles/:sectionId', TitleController.getTitlesBySectonId); // To get all titles based on section id
 router.get('/getAllTotalTitles', TitleController.getAllTitles)
 router.put('/updateTitle/:titleId', TitleController.updateTitleById);
 router.delete('/deleteTitle/:titleId', TitleController.deleteTitleById);

module.exports = router;