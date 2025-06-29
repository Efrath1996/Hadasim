import express from 'express';
import { getAllSuppliers } from '../controllers/Supplier.js';
import verifyToken from '../middlewares/verifyToken.js'; 

const router = express.Router();

router.get('/', verifyToken, getAllSuppliers);

export default router;
