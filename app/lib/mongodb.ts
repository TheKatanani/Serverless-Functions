import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Use a global variable to cache the client during development
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    console.log("Connected to MongoDB!");
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    await client.close(); // Ensure client is closed on connection error
    throw error;
  }
}