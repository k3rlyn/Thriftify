require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(cors({
    origin: ['https://thriftify.vercel.app', 'http://localhost:3000'], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Logging middleware untuk debug
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Server is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// MongoDB Connection
async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 1000
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

// Initialize server
async function initializeServer() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Routes
        app.use('/api/auth', authRoutes);

        // 404 handler
        app.use((req, res) => {
            res.status(404).json({ 
                error: 'Route not found',
                path: req.path
            });
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error:', err);
            
            // Mongoose validation error
            if (err.name === 'ValidationError') {
                return res.status(400).json({
                    error: 'Validation Error',
                    details: Object.values(err.errors).map(e => e.message)
                });
            }

            // JWT error
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    error: 'Invalid token'
                });
            }

            // Default error
            res.status(err.status || 500).json({
                error: process.env.NODE_ENV === 'development' 
                    ? err.message 
                    : 'Something went wrong!'
            });
        });

        // Start server
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
        });

    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Initialize server
initializeServer();

module.exports = app;