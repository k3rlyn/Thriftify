const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware'); // Import middleware

const authController = new AuthController();

// Debug logging middleware
router.use((req, res, next) => {
    console.log(`Auth Route accessed: ${req.method} ${req.path}`);
    next();
});

// Public routes (tidak perlu auth)
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

// Protected routes (perlu auth)
router.get('/test', auth, (req, res) => {
    res.json({ 
        message: 'Auth route is working',
        user: req.user // Middleware auth menambahkan ini
    });
});

module.exports = router;