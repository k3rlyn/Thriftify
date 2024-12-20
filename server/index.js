require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const initAuthRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Initialize MongoDB connection and routes
async function initializeServer() {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');
        
        const db = client.db('thriftify');

        // Initialize routes
        app.use('/api/auth', initAuthRoutes(db));

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Something broke!' });
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

// Initialize server
initializeServer();

// Vercel akan menangani port secara otomatis
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;