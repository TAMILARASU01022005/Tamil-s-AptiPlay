"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { COLLECTIONS } from "@/lib/schema";
import { randomUUID } from "crypto";

/**
 * Save a game score for the authenticated user.
 */
export async function saveScore(gameId: string, score: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await db.collection(COLLECTIONS.GAME_SCORES).insertOne({
      id: randomUUID(),
      userId: session.user.id,
      gameId,
      score,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save score:", error);
    return { success: false, error: "Failed to save score" };
  }
}
