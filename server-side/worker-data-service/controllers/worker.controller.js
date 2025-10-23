const Worker = require('../models/worker.model');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const createWorker = async (req, res) => {
    try {
        const {
            workerName,
                email,
                phone,
                skill,
                location,
                availabilityStatus,
                nationalId
        } = req.body;

        const streamUpload = (buffer, folder = 'workers') => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                });
                stream.end(buffer);
            });
        };

        const imageUrls = [];

        if (req.files && req.files.length) {
            for (const f of req.files) {
                if (f && f.buffer) {
                    try {
                        const uploadResult = await streamUpload(f.buffer, 'workers');
                        if (uploadResult && uploadResult.secure_url) imageUrls.push(uploadResult.secure_url);
                    } catch (err) {
                        console.error('Cloudinary image upload error:', err);
                    }
                }
            }
        }

        const missing = [];
        if (!workerName) missing.push('workerName');
        if (!phone) missing.push('phone');
        if (!skill) missing.push('skill');
        if (!location) missing.push('location');
        if (!nationalId) missing.push('nationalId');

        if (missing.length) {
            return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
        }

        
        if (!imageUrls.length) {
            return res.status(400).json({ success: false, message: 'At least one image is required' });
        }

        const payload = {
            name: workerName,
            email: email || '',
            contactNumber: phone,
            specialty: skill,
            area: location,
            status: availabilityStatus || 'Available',
            nationalId: nationalId || '',
            imageUrls: imageUrls
        };

        const newWorker = await Worker.create(payload);
        res.status(201).json({ success: true, message: 'Worker added successfully', worker: newWorker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error adding worker' });
    }
};

const getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find().sort({ name: 1 });
        res.status(200).json({ success: true, workers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error fetching workers' });
    }
};

const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ success: false, message: 'Worker not found' });
        }
        res.status(200).json({ success: true, worker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error fetching worker' });
    }
};

const updateWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!worker) {
            return res.status(404).json({ success: false, message: 'Worker not found' });
        }
        res.status(200).json({ success: true, message: 'Worker updated successfully', worker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error updating worker' });
    }
};

const deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndDelete(req.params.id);
        if (!worker) {
            return res.status(404).json({ success: false, message: 'Worker not found' });
        }
        res.status(200).json({ success: true, message: 'Worker deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error deleting worker' });
    }
};

module.exports = {
    createWorker,
    getAllWorkers,
    getWorkerById,
    updateWorker,
    deleteWorker
};
