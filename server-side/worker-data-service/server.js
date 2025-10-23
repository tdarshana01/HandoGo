const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const workerRoutes = require('./routes/worker.routes');

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected to Worker Data Service.');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

app.use('/api/v1/workers', workerRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Worker Data Service running on port ${PORT}`);
});
