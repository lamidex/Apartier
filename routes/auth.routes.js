const router = require('express').Router();
const authController = require('../controller/auth.controller.js');

router.get('/google', authController.googleLogin);
router.get('/auth/google/callback', authController.googleCallback);
router.get('/logout', authController.logout);

module.exports = router;
