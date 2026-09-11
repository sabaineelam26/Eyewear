const express = require('express');
const router = express.Router();
const { loginAdmin, getMe } = require('../controllers/adminController');
const { getDashboardStats } = require('../controllers/adminDashboardController');
const { getAllOrders, getOrderDetails, updateOrderStatus } = require('../controllers/adminOrderController');
const { protectAdmin } = require('../middleware/adminMiddleware');

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getMe);
router.get('/dashboard', protectAdmin, getDashboardStats);

router.get('/orders', protectAdmin, getAllOrders);
router.get('/orders/:id', protectAdmin, getOrderDetails);
router.put('/orders/:id/status', protectAdmin, updateOrderStatus);

module.exports = router;
