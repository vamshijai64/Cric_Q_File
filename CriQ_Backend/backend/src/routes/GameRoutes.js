const express=require('express');
const router=express.Router();
const GameController=require('../controllers/GameContorller');
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/GameDashBoard',authMiddleware,GameController.getGameApiDashboard)




module.exports=router;