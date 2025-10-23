const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const requestRoutes = require('./src/routes/service.routes');

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected to Request Service.');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

app.use('/api/v1/requests', requestRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Request Service running on port ${PORT}`);
});
