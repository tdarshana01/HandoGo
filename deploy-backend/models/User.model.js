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
        enum: ['Customer', 'Coordinator, Admin'],
        default: 'Customer',
    },
}, {
    timestamps: true
});

// Register model only if it isn't already registered (prevents OverwriteModelError in dev watches)
const ModelName = 'User';
const UserModel = mongoose.models[ModelName] || mongoose.model(ModelName, UserSchema);

// Also ensure a lowercase alias exists in case populate tries 'users'
if (!mongoose.models['users']) {
    mongoose.model('users', UserSchema);
}

module.exports = UserModel;
