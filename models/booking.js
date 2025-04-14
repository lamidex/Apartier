const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  numberOfNights: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
    defaultValue: 'PENDING'
  },
  paymentReference: {
    type: DataTypes.STRING
  }
});


const User = require('./user');
const Apartment = require('./apartment');

Booking.belongsTo(User);
Booking.belongsTo(Apartment);
User.hasMany(Booking);
Apartment.hasMany(Booking);

module.exports = Booking;