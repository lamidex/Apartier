const passport = require('passport');
const User = require('../models/user');

const authController = {
  
  googleLogin: passport.authenticate('google', {
    scope: ['profile', 'email']
  }),

  
  googleCallback: passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }),

  
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error logging out' });
      }
      res.redirect('/login');
    });
  },

  
  getProfile: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'email', 'role', 'googleId']
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;