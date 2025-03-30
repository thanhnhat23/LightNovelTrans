import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully:", connection.connection.host);
  } catch (error) {
    console.log("MongoDB connection failed:", error);
  }
};
