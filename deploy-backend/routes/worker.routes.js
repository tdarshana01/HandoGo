const express = require('express');
const { protect, authorize } = require('../middleware/work.middleware'); // authMiddleware copy needed
const multer = require('multer');

// multer memory storage to pass file buffer to controller
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { 
    createWorker, 
    getAllWorkers, 
    getWorkerById, 
    updateWorker, 
    deleteWorker 
} = require('../controllers/worker.controller');

const router = express.Router();

router.route('/')
    .post(
        protect,
        authorize(['Coordinator']),
        // accept a single multi-file field named 'images'
        upload.array('images', 8),
        createWorker
    )
    .get(getAllWorkers);

router.route('/:id')
    .get(getWorkerById)
    .patch(protect, authorize(['Coordinator']), updateWorker)
    .delete(protect, authorize(['Coordinator']), deleteWorker);

module.exports = router;
