import Order from '../models/Order.js';
import User from '../models/User.js'; 
import jwt from 'jsonwebtoken';
import { sendEmail } from '../email/sendEmail.js';
import {
  orderCreatedEmail,
  orderStatusEmailToOwner,
  orderReceivedConfirmationEmailToSupplier
} from '../email/orderEmails.js';

export const createOrder = async (req, res) => {
  try {
    const { supplierId, product } = req.body;

    const supplier = await User.findById(supplierId);
    if (!supplier) {
      return res.status(400).json({ error: 'Supplier not found' });
    }

    const newOrder = new Order({
      supplierId,
      supplierName: supplier.companyName,
      product,
      orderNumber: `ORD-${Date.now()}`
    });

    await newOrder.save();

    const emailData = orderCreatedEmail({ supplier, order: newOrder });
    await sendEmail({ to: supplier.email, subject: emailData.subject, html: emailData.html });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Create order failed' });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('supplierId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Get orders failed' });
  }
};


export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const owner = await User.findOne({ role: 'owner' });
    const supplier = await User.findById(order.supplierId);

    if (status === 'Rejected' || status === 'In Process') {
      const emailStatus = status === 'Rejected' ? 'rejected' : 'approved';
      const emailData = orderStatusEmailToOwner({ owner, order, supplier, status: emailStatus });
      await sendEmail({ to: owner.email, subject: emailData.subject, html: emailData.html });

    } else if (status === 'Completed') {
      const emailData = orderReceivedConfirmationEmailToSupplier({ supplier, order, owner });
      await sendEmail({ to: supplier.email, subject: emailData.subject, html: emailData.html });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update status failed' });
  }
};

export const getOrdersBySupplier = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const supplierId = decoded.userID;
    console.log("decoded ", decoded);
    console.log("token ", token);
    console.log("supplierId ", supplierId);
    const orders = await Order.find({ supplierId: supplierId });
    console.log(orders);
   res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Get supplier orders failed' });
  }
};
