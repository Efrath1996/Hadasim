import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../email/sendEmail.js";
import { welcomeEmail } from "../email/registrationEmails.js";
export const registerUser = async (req, res) => {
  try {
    const { contactName, email, mobile, password, companyName, products } = req.body;

    if (!contactName || !email || !mobile || !password || !companyName || !products) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "At least one product is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);//Password encryption

    const user = new User({
      contactName,
      email,
      mobile,
      password: hashed,
      companyName,
      products
    });

    await user.save();

   try {
      const { subject, html } = welcomeEmail(user);
      await sendEmail({ to: user.email, subject, html });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error.", data: error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const isMatchPass = await bcrypt.compare(password, user.password);
    if (!isMatchPass) {
      return res.status(400).json({ message: "Invalid password" });
    }

   const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Login successful",
      token,
      userDetails:{
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        contactName: user.contactName,
        companyName: user.companyName,
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
