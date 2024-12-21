import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email dan password harus diisi' 
            });
        }

        // Find user in MongoDB
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Email atau password salah' 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Email atau password salah' 
            });
        }

        // Create token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response
        res.status(200).json({
            success: true,
            token,
            message: 'Login berhasil'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Terjadi kesalahan pada server' 
        });
    }
};

export const register = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;

        // Enhanced validation
        if (!username || !email || !password || !fullName) {
            return res.status(400).json({
                message: 'Semua field harus diisi'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Format email tidak valid'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({
                    message: 'Email sudah terdaftar'
                });
            }
            return res.status(400).json({
                message: 'Username sudah digunakan'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in MongoDB
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            fullName
        });

        await newUser.save();

        // Create token
        const token = jwt.sign(
            { 
                userId: newUser._id,
                email: newUser.email,
                username: newUser.username,
                fullName: newUser.fullName
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response
        res.status(200).json({
            success: true,
            token,
            message: 'Registrasi berhasil'
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${field === 'email' ? 'Email' : 'Username'} sudah digunakan`
            });
        }

        res.status(500).json({
            message: 'Terjadi kesalahan pada server'
        });
    }
};