const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true
  },
  role: {
    type: DataTypes.ENUM('USER', 'ADMIN'),
    defaultValue: 'USER'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = User;