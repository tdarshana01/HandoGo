const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        // match the model name used in User.model.js
        ref: 'User',
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    preferredStart: {
        type: Date,
        default: null,
    },
    preferredEnd: {
        type: Date,
        default: null,
    },
    contact: {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
    },
    urgency: {
        type: String,
        default: 'Normal',
    },
    category: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['New', 'Pending', 'Assigned', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'],
        default: 'New',
    },
    assignedWorker: {
        type: String, 
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Request', RequestSchema);
