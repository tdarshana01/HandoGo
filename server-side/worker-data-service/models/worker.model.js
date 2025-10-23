const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    specialty: {
        type: String,
        required: true,
        trim: true,
    },
    area: {
        type: String,
        required: true,
        trim: true,
    },
    nationalId: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrls: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['Available', 'On Job', 'Unavailable'],
        default: 'Available',
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Worker', WorkerSchema);
