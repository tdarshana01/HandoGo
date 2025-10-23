const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['Customer', 'Coordinator', 'Admin'],
        default: 'Customer',
    },
       avatar: {
        url: { type: String },
        public_id: { type: String }
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', UserSchema);
