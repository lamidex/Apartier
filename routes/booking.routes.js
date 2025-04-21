const router = require('express').Router();
const bookingController = require('../controller/booking.controller.js');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, bookingController.createBooking);
router.get('/verify/:reference', verifyToken, bookingController.verifyPayment);

module.exports = router;