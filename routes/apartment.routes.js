const router = require('express').Router();
const apartmentController = require('../controller/apartment.controller.js');
const { isAdmin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/apartments', apartmentController.getAllApartments);
router.post('/apartments', isAdmin, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 }
]), apartmentController.createApartment);

router.get('/apartments/state/:state', apartmentController.getByState);
router.get('/apartments/available', apartmentController.getTotalAvailable);

module.exports = router;