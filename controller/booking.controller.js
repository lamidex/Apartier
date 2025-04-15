const Booking = require('../models/booking');
const Apartment = require('../models/apartment');
const paystack = require('../utils/paystack');

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const { apartmentId, numberOfNights } = req.body;
      const apartment = await Apartment.findByPk(apartmentId);

      if (!apartment || !apartment.available) {
        return res.status(400).json({ error: 'Apartment not available' });
      }

      const totalAmount = numberOfNights * apartment.pricePerNight;

      
      const paymentData = {
        amount: totalAmount * 100,
        email: req.user.email,
        metadata: {
          apartmentId,
          numberOfNights,
          userId: req.user.id
        }
      };

      const payment = await paystack.transaction.initialize(paymentData);

      
      const booking = await Booking.create({
        UserId: req.user.id,
        ApartmentId: apartmentId,
        numberOfNights,
        totalAmount,
        paymentReference: payment.data.reference
      });

      res.json({
        authorizationUrl: payment.data.authorization_url,
        reference: payment.data.reference
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { reference } = req.params;
      const booking = await Booking.findOne({
        where: { paymentReference: reference },
        include: [Apartment]
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const verification = await paystack.transaction.verify(reference);

      if (verification.data.status === 'success') {
        booking.paymentStatus = 'COMPLETED';
        await booking.save();

        res.status(200).json({
          status: 'success',
          apartmentName: booking.Apartment.name
        });
      } else {
        booking.paymentStatus = 'FAILED';
        await booking.save();
        res.status(400).json({ error: 'Payment failed' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookingController;