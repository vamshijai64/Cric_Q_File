// homeRoutes.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');



router.get('/homepage', homeController.gethome);
router.get('/all-data', homeController.getAllData);
router.get('/suggestions', homeController.getBySearch);
router.get('/wrong/suggestions', homeController.getBySearchWrong);



module.exports = router;
