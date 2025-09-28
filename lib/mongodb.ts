import { type User as UserType } from "@/types";
import mongoose, { Schema, Document, Model } from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

// mapping wallet to farcaster id
const UserSchema = new Schema(
  {
    fid: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model<UserType & Document>("User", UserSchema);

// Connection management
let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    const options = {
      bufferCommands: true, // Enable buffering to allow operations before connection is complete
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(uri, options);
    isConnected = true;

    mongoose.connection.on("error", (error: any) => {
      console.error("MongoDB connection error:", error);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

    console.log("✅ Connected to MongoDB via Mongoose");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}

export class UserDatabase {
  constructor() {
    // Ensure connection on instantiation
    if (!isConnected) {
      connectToDatabase();
    }
  }

  async getUserByFid(fid: string): Promise<UserType | null> {
    try {
      await connectToDatabase();
      return await User.findOne({ fid }).exec();
    } catch (error) {
      console.error("Error getting user by fid:", error);
      throw error;
    }
  }

  async getUserByWallet(walletAddress: string): Promise<UserType | null> {
    try {
      await connectToDatabase();
      return await User.findOne({ walletAddress }).exec();
    } catch (error) {
      console.error("Error getting user by wallet address:", error);
      throw error;
    }
  }

  async createUser(fid: string, walletAddress: string): Promise<UserType> {
    try {
      await connectToDatabase();

      const user = new User({ fid, walletAddress });
      return await user.save();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(fid: string, walletAddress: string): Promise<UserType | null> {
    try {
      await connectToDatabase();

      const user = await User.findOneAndUpdate(
        { fid },
        { walletAddress },
        { new: true, runValidators: true },
      ).exec();

      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUserByFid(fid: string): Promise<boolean> {
    try {
      await connectToDatabase();

      const result = await User.deleteOne({ fid }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export const userDatabase = new UserDatabase();
export { User };
