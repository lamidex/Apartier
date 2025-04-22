const router = require('express').Router();
const userController = require('../controller/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');


router.post('/signup', userController.signup);
router.post('/login', userController.login);


router.get('/profile', verifyToken, userController.getProfile);
router.get('/all', verifyToken, isAdmin, userController.getAllUsers);
router.put('/role', verifyToken, isAdmin, userController.updateUserRole);
router.post('/create-admin', verifyToken, isAdmin, userController.createAdmin);
router.get('/test-token', verifyToken, (req, res) => {
    res.json({
      message: 'Token is valid',
      user: req.user
    });
  });

  
module.exports = router;