// config/database.js
const mongoose = require('mongoose');

let db = null;

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        db = conn.connection;
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });
        db.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

        return db;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Get database instance
const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
};

module.exports = { connectDB, getDB };

// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username harus diisi'],
        unique: true,
        minlength: [3, 'Username minimal 3 karakter']
    },
    email: {
        type: String,
        required: [true, 'Email harus diisi'],
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email tidak valid']
    },
    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        minlength: [6, 'Password minimal 6 karakter']
    },
    fullName: {
        type: String,
        required: [true, 'Nama lengkap harus diisi']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

// server.js or app.js
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const initAuthRoutes = require('./routes/authRoutes');

const app = express();

// Connect to database before starting server
const startServer = async () => {
    try {
        const db = await connectDB();
        
        app.use(express.json());
        
        // Initialize routes with database connection
        app.use('/api/auth', initAuthRoutes(db));
        
        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ 
                error: 'Internal Server Error',
                message: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();