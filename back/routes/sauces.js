const express = require('express');
const router = express.Router();

saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth'); 
const multer = require('../middleware/multer-config'); 


router.post('/', auth, multer, saucesCtrl.createSauce); 
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce); 


module.exports = router; 