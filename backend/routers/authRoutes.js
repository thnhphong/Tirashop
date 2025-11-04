const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//customer auth routes 
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

module.exports = router;