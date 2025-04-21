const router = require('express').Router();
const apartmentController = require('../controller/apartment.controller.js');
const { verifyToken, isAdmin } = require('../middleware/auth.js');
const upload = require('../middleware/upload');

router.get('/', apartmentController.getAllApartments);
router.post('/', verifyToken, isAdmin, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 }
]), apartmentController.createApartment);

router.get('/state/:state', apartmentController.getByState);
router.get('/available', apartmentController.getTotalAvailable);

module.exports = router;