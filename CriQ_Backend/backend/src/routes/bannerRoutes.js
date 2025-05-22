const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');


router.post('/ides/banners', bannerController.uploadBanners);
router.get('/banners/type/:bannerType', bannerController.getbyBannerId);
router.get('/banners/:id', bannerController.getBannerById);

router.patch('/banners/:id/image', bannerController.updateBannerImage);
router.get('/banners', bannerController.getAllBanners);

module.exports = router;
