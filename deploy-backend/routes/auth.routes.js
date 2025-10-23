const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { registerUser, loginUser, getMe, getAllUsers, createUserByAdmin, createCoordinator, assignCoordinator } = require('../controllers/Authentication.controller');
const {protect, authorize} = require("../middleware/auth.middleware");
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create-user',createUserByAdmin);
router.post('/create-coordinator', protect, authorize('Admin'), upload.single('avatar'), createCoordinator);
router.get('/profile', protect, getMe);
router.get('/', protect, authorize('Coordinator','Admin'), getAllUsers);
router.patch('/:id/assign-coordinator', protect, authorize('Admin'), assignCoordinator);

module.exports = router;
