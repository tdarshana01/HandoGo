const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes.js');

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected to User Service.');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
