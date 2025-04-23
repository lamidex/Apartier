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
        },
        callback_url: `${process.env.APP_URL || 'https://mysql-production-e899.up.railway.app'}/api/bookings/verify`
      };

      const payment = await paystack.initializeTransaction(paymentData);

      const booking = await Booking.create({
        UserId: req.user.id,
        ApartmentId: apartmentId,
        numberOfNights,
        totalAmount,
        paymentReference: payment.data.reference,
        paymentStatus: 'PENDING'
      });

      res.json({
        authorizationUrl: payment.data.authorization_url,
        reference: payment.data.reference,
        booking: booking
      });
    } catch (error) {
      console.error('Booking creation error:', error);
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

      const verification = await paystack.verifyTransaction(reference);
      console.log('Payment verification response:', verification);

      if (verification.data.status === 'success' || verification.data.status === 'SUCCESS') {
        booking.paymentStatus = 'COMPLETED';
        await booking.save();

        const apartment = await Apartment.findByPk(booking.ApartmentId);
        if (apartment) {
          apartment.available = false;
          await apartment.save();
        }

        res.json({
          status: 'success',
          booking,
          apartmentName: booking.Apartment.name
        });
      } else if (verification.data.status === 'pending' || verification.data.status === 'PENDING') {
        res.status(202).json({ 
          status: 'pending',
          message: 'Payment is being processed' 
        });
      } else {
        booking.paymentStatus = 'FAILED';
        await booking.save();
        res.status(400).json({ error: 'Payment failed' });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  handleWebhook: async (req, res) => {
    try {
      
      if (process.env.NODE_ENV !== 'production') {
        const event = req.body;
        console.log('Webhook event received:', event);

        if (event.event === 'charge.success') {
          const booking = await Booking.findOne({
            where: { paymentReference: event.data.reference },
            include: [Apartment]
          });

          if (booking) {
            console.log('Updating booking status to COMPLETED');
            booking.paymentStatus = 'COMPLETED';
            await booking.save();

            const apartment = await Apartment.findByPk(booking.ApartmentId);
            if (apartment) {
              console.log('Updating apartment availability to false');
              apartment.available = false;
              await apartment.save();
            }
          }
        }
        return res.sendStatus(200);
      }

      
      
      if (event.event === 'charge.success') {
        const booking = await Booking.findOne({
          where: { paymentReference: event.data.reference },
          include: [Apartment]
        });

        if (booking) {
          console.log('Updating booking status to COMPLETED');
          booking.paymentStatus = 'COMPLETED';
          await booking.save();

          const apartment = await Apartment.findByPk(booking.ApartmentId);
          if (apartment) {
            console.log('Updating apartment availability to false');
            apartment.available = false;
            await apartment.save();
          }
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Webhook handling error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        where: { UserId: req.user.id },
        include: [Apartment],
        order: [['createdAt', 'DESC']]
      });

      res.json(bookings);
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookingController;