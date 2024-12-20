const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

class AuthController {
    constructor(db) {
        this.db = db;
        this.collection = db.collection('users');
    }

    async register(req, res) {
        try {
            const { username, email, password, fullName } = req.body;

            // Validate input
            const errors = User.validate({ username, email, password, fullName });
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            // Check if user already exists
            const existingUser = await this.collection.findOne({ 
                $or: [{ email }, { username }] 
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    error: 'Email atau username sudah terdaftar' 
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new User(username, email, hashedPassword, fullName);
            
            // Save to database
            const result = await this.collection.insertOne(user);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id.toString() }, 
                process.env.JWT_SECRET || 'fallback-secret-key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User berhasil didaftarkan',
                token,
                user: {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email dan password harus diisi' });
            }

            // Find user
            const user = await this.collection.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Email atau password salah' });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Email atau password salah' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id.toString() },
                process.env.JWT_SECRET || 'fallback-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login berhasil',
                token,
                user: {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = AuthController;