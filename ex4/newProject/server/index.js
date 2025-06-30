import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;
import cookieParser from 'cookie-parser';
import authRoute from './routes/User.js';
import supplierRoutes from './routes/Supplier.js';
import orderRoutes from './routes/Order.js';
import dotenv from 'dotenv';
dotenv.config();

app.use(cors({ origin:"http://localhost:3000", credentials:true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoute);
app.use("/api/suppliers", supplierRoutes);
app.use('/api/orders', orderRoutes);

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongoose Connected!!!");
        
    } catch (error) {
        console.log("Connection Failed",error);
        process.exit(1);
        
    }
}
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB();
});