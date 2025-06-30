import User from '../models/User.js';

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await User.find({ role: 'supplier' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Get suppliers failed', error });
  }
};
