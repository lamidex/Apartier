const router = require('express').Router();
const bookingController = require('../controller/booking.controller.js');
const { isAuthenticated } = require('../middleware/auth');

router.post('/bookings', isAuthenticated, bookingController.createBooking);


router.get('/bookings/verify/:reference', isAuthenticated, bookingController.verifyPayment);

module.exports = router;