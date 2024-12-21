const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

class AuthController {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
        this.TOKEN_EXPIRY = '24h';
    }

    generateToken(userId) {
        return jwt.sign(
            { userId },
            this.JWT_SECRET,
            { expiresIn: this.TOKEN_EXPIRY }
        );
    }

    sanitizeUserData(user) {
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            createdAt: user.createdAt
        };
    }

    async register(req, res) {
        try {
            const { username, email, password, fullName } = req.body;
    
            if (!username || !email || !password || !fullName) {
                return res.status(400).json({
                    success: false,
                    message: 'Semua field harus diisi'
                });
            }
    
            const userExists = await User.findOne({
                $or: [
                    { email: email.toLowerCase() },
                    { username: username.toLowerCase() }
                ]
            });
    
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: userExists.email === email.toLowerCase() ?
                        'Email sudah terdaftar' :
                        'Username sudah digunakan'
                });
            }
    
            const user = await User.create({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password,
                fullName
            });
    
            const token = this.generateToken(user._id);
    
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });
    
            res.status(201).json({
                success: true,
                message: 'User berhasil didaftarkan',
                token,
                user: this.sanitizeUserData(user)
            });
    
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Terjadi kesalahan saat pendaftaran' 
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
    
            // Basic validation
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email dan password harus diisi'
                });
            }
    
            // Find user
            const user = await User.findOne({ 
                email: email.toLowerCase() 
            }).select('+password');
    
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }
    
            // Check password
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }
    
            // Generate token
            const token = this.generateToken(user._id);
    
            // Set token in HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
    
            res.json({
                success: true,
                message: 'Login berhasil',
                token,
                user: this.sanitizeUserData(user)
            });
    
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Terjadi kesalahan saat login' 
            });
        }
    }

    async logout(req, res) {
        try {
            // Clear token cookie
            res.clearCookie('token');
            
            res.json({
                message: 'Logout berhasil'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ 
                error: 'Terjadi kesalahan saat logout' 
            });
        }
    }

    // Method untuk cek status autentikasi
    async checkAuth(req, res) {
        try {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    authenticated: false,
                    message: 'Token tidak ditemukan'
                });
            }

            const decoded = jwt.verify(token, this.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json({
                    authenticated: false,
                    message: 'User tidak ditemukan'
                });
            }

            res.json({
                authenticated: true,
                user: this.sanitizeUserData(user)
            });

        } catch (error) {
            res.status(401).json({
                authenticated: false,
                message: 'Token tidak valid'
            });
        }
    }
}

module.exports = AuthController;