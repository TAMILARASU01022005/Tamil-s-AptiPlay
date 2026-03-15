"use server";

import { db } from "@/lib/db";
import { COLLECTIONS, User } from "@/lib/schema";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  score: number;
};

export async function getLeaderboard(
  gameId?: string
): Promise<LeaderboardEntry[]> {
  try {
    if (gameId) {
      const scores = await db
        .collection(COLLECTIONS.GAME_SCORES)
        .aggregate([
          { $match: { gameId } },
          { $group: { _id: "$userId", maxScore: { $max: "$score" } } },
          { $sort: { maxScore: -1 } },
          { $limit: 30 },
        ])
        .toArray();

      const userIds = scores.map((s) => s._id);
      if (userIds.length === 0) return [];

      const userRows = (await db
        .collection(COLLECTIONS.USERS)
        .find({ id: { $in: userIds } })
        .toArray()) as unknown as User[];

      return scores
        .map((s, i) => {
          const user = userRows.find((u) => u.id === s._id);
          if (!user) return null;
          return { rank: i + 1, userId: user.id, name: user.name, image: user.image, score: s.maxScore ?? 0 };
        })
        .filter((x): x is LeaderboardEntry => x !== null);
    } else {
      const allBest = await db
        .collection(COLLECTIONS.GAME_SCORES)
        .aggregate([
          { $group: { _id: { userId: "$userId", gameId: "$gameId" }, bestScore: { $max: "$score" } } },
          { $group: { _id: "$_id.userId", totalScore: { $sum: "$bestScore" } } },
          { $sort: { totalScore: -1 } },
          { $limit: 50 },
        ])
        .toArray();

      const userIds = allBest.map((s) => s._id);
      if (userIds.length === 0) return [];

      const userRows = (await db
        .collection(COLLECTIONS.USERS)
        .find({ id: { $in: userIds } })
        .toArray()) as unknown as User[];

      return allBest
        .map((s, i) => {
          const user = userRows.find((u) => u.id === s._id);
          if (!user) return null;
          return { rank: i + 1, userId: user.id, name: user.name, image: user.image, score: s.totalScore };
        })
        .filter((x): x is LeaderboardEntry => x !== null);
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}
