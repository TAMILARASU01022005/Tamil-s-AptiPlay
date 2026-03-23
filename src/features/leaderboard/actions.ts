"use server";

import { db } from "@/lib/db";
import { COLLECTIONS, User } from "@/lib/schema";
import { ObjectId } from "mongodb";

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
    const pipeline: any[] = [
      {
        $lookup: {
          from: COLLECTIONS.GAME_SCORES,
          let: { userIdStr: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userIdStr"] },
                    ...(gameId && gameId !== 'overall' ? [{ $eq: ["$gameId", gameId] }] : []),
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                sumScore: { $sum: "$score" },
              },
            },
          ],
          as: "scoreInfo",
        },
      },
      {
        $addFields: {
          totalScore: {
            $ifNull: [{ $arrayElemAt: ["$scoreInfo.sumScore", 0] }, 0],
          },
        },
      },
      { $sort: { totalScore: -1, name: 1 } },
      { $limit: 100 },
    ];

    const usersWithScores = await db
      .collection(COLLECTIONS.USERS)
      .aggregate(pipeline)
      .toArray();

    return usersWithScores.map((u, i) => ({
      rank: i + 1,
      userId: u._id.toString(),
      name: u.name,
      image: u.image,
      score: u.totalScore,
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}
