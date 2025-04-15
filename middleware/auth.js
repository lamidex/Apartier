const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Please log in to continue' });
  };
  
  module.exports = { isAuthenticated };