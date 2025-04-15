const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.get('/auth/google', authController.googleLogin);
router.get('/auth/google/callback', authController.googleCallback);
router.get('/logout', authController.logout);

module.exports = router;