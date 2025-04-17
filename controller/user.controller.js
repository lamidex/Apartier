const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userController = {
  signup: async (req, res) => {
    try {
      const { email, password } = req.body;

      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      
      const user = await User.create({
        email,
        password,
        role: 'USER'
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error creating session' });
        }
        res.json({ message: 'Signup successful', user });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      
      user.lastLogin = new Date();
      await user.save();

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error creating session' });
        }
        res.json({ message: 'Login successful', user });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  getProfile: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      const user = await User.findByPk(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  updateUserRole: async (req, res) => {
    try {
      const { userId, role } = req.body;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.role = role;
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;