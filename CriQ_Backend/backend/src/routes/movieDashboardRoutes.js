const express = require('express');
const router = express.Router();
const movieDashoardController = require('../controllers/movieDashboardController');

router.get('/',movieDashoardController.getMovieDashboard)

module.exports = router;