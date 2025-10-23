const express = require('express');
const { protect, authorize } = require('../middleware/service.middleware');
const { 
    createRequest, 
    getCustomerRequests, 
    getCoordinatorRequests, 
    getAllRequests,
    updateRequestStatus 
} = require('../controllers/service.controller');

const router = express.Router();
router.route('/').post(protect, authorize(['Customer']), createRequest);
router.route('/all').get(protect, authorize(['Coordinator']), getAllRequests);
router.route('/customer').get(protect, authorize(['Customer']), getCustomerRequests);
router.route('/coordinator').get(protect, authorize(['Coordinator']), getCoordinatorRequests);
router.route('/:id').patch(protect, authorize(['Coordinator']), updateRequestStatus);

module.exports = router;
