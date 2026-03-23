"use server";

import { auth, signOut as authSignOut } from "@/lib/auth";
import { headers } from "next/headers";

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

