const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const requestRoutes = require('./routes/service.routes');
const authRoutes = require('./routes/auth.routes');
const workerRoutes = require('./routes/worker.routes');

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['https://servicecustomer-app.netlify.app', 'https://servicecoordinator-app.netlify.app', 'https://serviceadmin-app.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
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
