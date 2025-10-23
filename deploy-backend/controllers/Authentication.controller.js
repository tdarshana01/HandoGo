const User = require('../model/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'YOUR_JWT_SECRET', {
        expiresIn: '7d',
    });
};

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
}

const uploadBufferToCloudinary = (buffer, folder = 'users') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const normalizedRole = 'Customer';

        user = new User({
            fullName,
            email,
            password: hashedPassword,
            role: normalizedRole,
        });

        await user.save();
        const token = generateToken(user._id, user.role);

    res.status(201).json({ success: true, token, user: { id: user._id, fullName: user.fullName, role: user.role } });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send({ success: false, message: 'Server Error during registration' });
    }
};


exports.createUserByAdmin = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'fullName, email and password are required' });
        }

        const allowedRoles = ['Admin'];
        const normalizedRole = allowedRoles.includes(role) ? role : 'Customer';

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ fullName, email, password: hashedPassword, role: normalizedRole });
        await user.save();

        res.status(201).json({ success: true, user: { id: user._id, fullName: user.fullName, role: user.role } });
    } catch (error) {
        console.error('Admin create user error:', error);
        res.status(500).send({ success: false, message: 'Server Error creating user' });
    }
};

exports.createCoordinator = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'fullName, email and password are required' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserData = { fullName, email, password: hashedPassword, role: 'Coordinator' };

        if (req.file && req.file.buffer && cloudinary) {
            try {
                const result = await uploadBufferToCloudinary(req.file.buffer, 'users');
                newUserData.avatar = { url: result.secure_url, public_id: result.public_id };
            } catch (err) {
                console.error('Cloudinary upload failed:', err);
            }
        }

        user = new User(newUserData);
        await user.save();

        res.status(201).json({ success: true, user: { id: user._id, fullName: user.fullName, role: user.role, avatar: user.avatar } });
    } catch (error) {
        console.error('Create coordinator error:', error);
        res.status(500).send({ success: false, message: 'Server Error creating coordinator' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        const token = generateToken(user._id, user.role);
        res.json({ success: true, token, user: { id: user._id, fullName: user.fullName, role: user.role } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ success: false, message: 'Server Error during login' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // return a compact, explicit user object (avoid exposing internal fields)
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching user profile' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).send('Server Error fetching all users');
    }
};

exports.assignCoordinator = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.role = 'Coordinator';
        await user.save();
        res.status(200).json({ success: true, user: { id: user._id, fullName: user.fullName, role: user.role } });
    } catch (err) {
        console.error('Assign coordinator error:', err);
        res.status(500).json({ success: false, message: 'Server error assigning role' });
    }
};
