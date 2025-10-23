const Request = require('../model/service.model');
// ensure User model is registered in this service so populate() can find it
const User = require('../models/User.model');

const createRequest = async (req, res) => {
    try {
        // Accept frontend fields: gigType (or serviceType), description, location, preferredStart, preferredEnd, email, phone, urgency, category
        const {
        gigType,
        serviceType: svcType,
        description,
        location,
        preferredStart,
        preferredEnd,
        email,
        phone,
        urgency,
        category,
        assignedWorker,
        } = req.body;

        const newRequest = await Request.create({
            customer: req.user.id,
            serviceType: gigType || svcType,
            description,
            location,
            preferredStart: preferredStart ? new Date(preferredStart) : null,
            preferredEnd: preferredEnd ? new Date(preferredEnd) : null,
            contact: { email: email || '', phone: phone || '' },
            urgency: urgency || 'Normal',
            category: category || '',
            // accept assignedWorker from frontend (customer may pre-select a worker)
            assignedWorker: assignedWorker || null,
            // if an assignedWorker was provided mark the request as Assigned
            status: assignedWorker ? 'Assigned' : undefined,
        });

        res.status(201).json({ success: true, message: 'Service request created successfully', request: newRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during request creation' });
    }
};

const getCustomerRequests = async (req, res) => {
    try {
        console.log('getCustomerRequests called for user:', req.user && req.user.id);
        const requests = await Request.find({ customer: req.user.id })
            .sort({ createdAt: -1 })
            .populate('customer', 'fullName email');
        console.log(`Found ${requests.length} requests for user ${req.user && req.user.id}`);
        // normalize customer display name for frontend convenience
        let transformed = requests.map(r => {
            const obj = (typeof r.toObject === 'function') ? r.toObject() : r;
            obj.customerDisplay = obj.customer && typeof obj.customer === 'object' && (obj.customer.fullName || obj.customer.name)
                ? (obj.customer.fullName || obj.customer.name)
                : null;
            return obj;
        });

        // fallback: for any requests lacking customerDisplay, lookup users directly from DB
        const missingIds = transformed
            .filter(r => !r.customerDisplay)
            .map(r => (r.customer && (r.customer._id || r.customer)) || r.customer)
            .map(id => id && id.toString ? id.toString() : id)
            .filter(Boolean);

        if (missingIds.length) {
            try {
                const users = await User.find({ _id: { $in: missingIds } }).select('fullName');
                const map = {};
                users.forEach(u => { map[String(u._id)] = u.fullName; });
                transformed = transformed.map(r => {
                    if (!r.customerDisplay) {
                        const id = r.customer && (r.customer._id || r.customer);
                        const key = id && id.toString ? id.toString() : id;
                        r.customerDisplay = map[key] || key || '—';
                    }
                    return r;
                });
            } catch (err) {
                console.warn('Fallback user lookup failed', err);
            }
        }

        res.status(200).json({ success: true, requests: transformed });
    } catch (error) {
        console.error('getCustomerRequests error for user', req.user && req.user.id, error && (error.stack || error.message || error));
        res.status(500).json({ success: false, message: 'Server error getting customer requests' });
    }
};

const getCoordinatorRequests = async (req, res) => {
    try {
        // Coordinators can see all 'New' or 'Pending' requests
        const requests = await Request.find({ status: { $in: ['New', 'Pending', 'Assigned'] } })
            .sort({ createdAt: -1 })
            .populate('customer', 'fullName email');
        let transformed = requests.map(r => {
            const obj = (typeof r.toObject === 'function') ? r.toObject() : r;
            obj.customerDisplay = obj.customer && typeof obj.customer === 'object' && (obj.customer.fullName || obj.customer.name)
                ? (obj.customer.fullName || obj.customer.name)
                : null;
            return obj;
        });

        const missingIds = transformed
            .filter(r => !r.customerDisplay)
            .map(r => (r.customer && (r.customer._id || r.customer)) || r.customer)
            .map(id => id && id.toString ? id.toString() : id)
            .filter(Boolean);
        if (missingIds.length) {
            try {
                const users = await User.find({ _id: { $in: missingIds } }).select('fullName');
                const map = {};
                users.forEach(u => { map[String(u._id)] = u.fullName; });
                transformed = transformed.map(r => {
                    if (!r.customerDisplay) {
                        const id = r.customer && (r.customer._id || r.customer);
                        const key = id && id.toString ? id.toString() : id;
                        r.customerDisplay = map[key] || key || '—';
                    }
                    return r;
                });
            } catch (err) {
                console.warn('Fallback user lookup failed', err);
            }
        }
        res.status(200).json({ success: true, requests: transformed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error getting coordinator requests' });
    }
};

const getAllRequests = async (req, res) => {
    try {
        // Only coordinators should access this route (ensure middleware enforces it)
        const requests = await Request.find()
            .sort({ createdAt: -1 })
            .populate('customer', 'fullName email');
        let transformed = requests.map(r => {
            const obj = (typeof r.toObject === 'function') ? r.toObject() : r;
            obj.customerDisplay = obj.customer && typeof obj.customer === 'object' && (obj.customer.fullName || obj.customer.name)
                ? (obj.customer.fullName || obj.customer.name)
                : null;
            return obj;
        });

        const missingIds = transformed
            .filter(r => !r.customerDisplay)
            .map(r => (r.customer && (r.customer._id || r.customer)) || r.customer)
            .map(id => id && id.toString ? id.toString() : id)
            .filter(Boolean);

        if (missingIds.length) {
            try {
                const users = await User.find({ _id: { $in: missingIds } }).select('fullName');
                const map = {};
                users.forEach(u => { map[String(u._id)] = u.fullName; });
                transformed = transformed.map(r => {
                    if (!r.customerDisplay) {
                        const id = r.customer && (r.customer._id || r.customer);
                        const key = id && id.toString ? id.toString() : id;
                        r.customerDisplay = map[key] || key || '—';
                    }
                    return r;
                });
            } catch (err) {
                console.warn('Fallback user lookup failed', err);
            }
        }

        res.status(200).json({ success: true, count: transformed.length, requests: transformed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error fetching all requests' });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { status, assignedWorker } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Only Coordinators can update status/assignment
        if (req.user.role !== 'Coordinator') {
            return res.status(403).json({ success: false, message: 'Forbidden: Only Coordinators can update requests' });
        }

        if (status) request.status = status;
        if (assignedWorker) request.assignedWorker = assignedWorker;

        await request.save();
        res.status(200).json({ success: true, message: 'Request updated successfully', request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error updating request status' });
    }
};

module.exports = {
    createRequest,
    getCustomerRequests,
    getAllRequests,
    getCoordinatorRequests,
    updateRequestStatus,
};
