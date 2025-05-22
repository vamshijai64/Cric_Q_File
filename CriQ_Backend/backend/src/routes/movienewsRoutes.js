const express = require('express');
const router = express.Router();
const movienewsController = require('../controllers/movienewsController');
const upload=require('../middlewares/uploadMiddleware')



router.post('/addmovienews',movienewsController.addMovieNews);

router.get('/latest', movienewsController.getLatestMovieNews);
router.get('/:id',movienewsController.getMovieNewsById);
router.put('/update/:id',movienewsController.updateMovieNews);

router.get('/',movienewsController.getMovieNews);
router.delete('/delete/:id',movienewsController.deleteMovieNews);
module.exports = router;


