import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { COLLECTIONS, GameScore } from "@/lib/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const GET = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scores = (await db
      .collection(COLLECTIONS.GAME_SCORES)
      .find({ userId: session.user.id })
      .sort({ score: -1 })
      .limit(10)
      .toArray()) as unknown as GameScore[];

    return NextResponse.json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { gameId, score } = body;

    if (!gameId || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const newScore: GameScore = {
      id: randomUUID(),
      userId: session.user.id,
      gameId,
      score,
      createdAt: new Date(),
    };

    await db.collection(COLLECTIONS.GAME_SCORES).insertOne(newScore);

    return NextResponse.json(newScore);
  } catch (error) {
    console.error("Error saving score:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
