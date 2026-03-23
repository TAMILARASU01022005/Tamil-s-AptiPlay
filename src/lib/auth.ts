import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { mongoClient, db } from "./db";

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db("aptitude1"), {
    mongoClient,
    // Disable transactions for MongoDB Atlas free tier (no replica set required)
    transaction: false,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "https://tamil-s-aptiplay.onrender.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://10.0.2.2:3000",
    "http://10.0.2.2:3001",
    "http://localhost:8081",
    "games-apti://",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  rateLimit: {
    window: 60,
    max: 10,
  },
});
