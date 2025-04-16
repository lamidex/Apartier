const User = require('../models/user');

const userController = {
  
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