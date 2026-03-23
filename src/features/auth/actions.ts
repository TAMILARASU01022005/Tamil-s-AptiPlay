"use server";

import { auth, signOut as authSignOut } from "@/lib/auth";
import { headers } from "next/headers";

import { db } from "@/lib/db";
import { COLLECTIONS } from "@/lib/schema";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

/**
 * Server-side sign out action.
 */
export async function signOut() {
    try {
        await authSignOut();
        return {
            status: true,
        };
    } catch (error) {
        console.log(error);
        return {
            status: false,
            error,
        };
    }
}

/**
 * Server-side user registration action.
 */
export async function registerUser(values: { name: string; email: string; password?: string }) {
    try {
        const { name, email, password } = values;

        // Check if user already exists
        const existingUser = await db.collection(COLLECTIONS.USERS).findOne({ email });
        if (existingUser) {
            return { status: false, error: "User already exists" };
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const newUser = {
            id: randomUUID(),
            name,
            email,
            password: hashedPassword,
            emailVerified: null,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.collection(COLLECTIONS.USERS).insertOne(newUser);

        return { status: true, data: { name: newUser.name, email: newUser.email } };
    } catch (error) {
        console.error("REGISTRATION: Failed to register user:", error);
        return { status: false, error: "Registration failed" };
    }
}

