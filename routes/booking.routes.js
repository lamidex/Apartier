const router = require('express').Router();
const bookingController = require('../controller/booking.controller.js');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, bookingController.createBooking);
router.get('/verify/:reference', verifyToken, bookingController.verifyPayment);
router.post('/webhook', bookingController.handleWebhook);
router.get('/user', verifyToken, bookingController.getUserBookings);

module.exports = router;