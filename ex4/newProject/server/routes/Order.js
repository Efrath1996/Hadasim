import express from 'express';
import { createOrder, getAllOrders, getOrdersBySupplier, updateOrderStatus } from '../controllers/Order.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getAllOrders);
router.put('/:id/status', verifyToken, updateOrderStatus);
router.get('/by-supplier', verifyToken, getOrdersBySupplier);

export default router;
