const router = require('express').Router();
const userController = require('../controller/user.controller');
const { isAdmin } = require('../middleware/admin');
const { isAuthenticated } = require('../middleware/auth');

router.get('/profile', isAuthenticated, userController.getProfile);
router.get('/all', isAuthenticated, isAdmin, userController.getAllUsers);
router.put('/role', isAuthenticated, isAdmin, userController.updateUserRole);

module.exports = router;