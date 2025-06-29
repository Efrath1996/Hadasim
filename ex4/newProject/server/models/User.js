import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    minlength: 2,
  },
  contactName: {
    type: String,
    required: true,
    minlength: 3,
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["supplier", "owner"],
    default: "supplier",
  },
  products: {
    type: [{
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      minQuantity: {
        type: Number,
        required: true,
      }
    }],
    default: [],
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
