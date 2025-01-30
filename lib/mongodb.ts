import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
let db: any;

export const connectToDatabase = async () => {
  if (db) return { db };
  try {
    await client.connect();
    db = client.db();
    return { db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
