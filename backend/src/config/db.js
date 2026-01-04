import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    console.log("Mongo connected to:", mongoose.connection.name);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
