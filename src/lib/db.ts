import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { serverSelectionTimeoutMS: 30000 };

// Create a single MongoClient instance shared across the application.
// In development, preserve it across hot-reloads with a global variable.
const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

if (!globalWithMongo._mongoClient) {
  globalWithMongo._mongoClient = new MongoClient(uri, options);
}

export const mongoClient = globalWithMongo._mongoClient;

// Export the default database. The MongoDB driver auto-connects on first use.
export const db = mongoClient.db();

// clientPromise for any code that explicitly awaits a connected client
export default mongoClient.connect().catch(() => mongoClient);
