const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const requestRoutes = require('./routes/service.routes');
const authRoutes = require('./routes/auth.routes');
const workerRoutes = require('./routes/worker.routes');

const app = express();

app.use(express.json());
// Configure CORS to allow specific origins via ALLOWED_ORIGINS env var (comma separated).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    }
}));

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected to Service Application.');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workers', workerRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Request Service running on port ${PORT}`);
});
