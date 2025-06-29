import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplierName: {
    type: String,
    required: true 
  },
  product: {
    name: String,
    price: Number,
    quantity: Number
  },
   orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
  type: String,
  enum: ['Waiting for Approval', 'In Process', 'Completed', 'Rejected'],
  default: 'Waiting for Approval'
  },
}, { timestamps: true }); 

export default mongoose.model("Order", orderSchema);
