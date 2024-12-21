const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const authController = new AuthController();

// Logging untuk debug
router.use((req, res, next) => {
    console.log(`Auth Route accessed: ${req.method} ${req.path}`);
    next();
});

// Define routes
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

// Add test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working' });
});

module.exports = router;