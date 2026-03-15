"use server";

import { db } from "@/lib/db";
import { COLLECTIONS, Poll, PollOption } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

/**
 * Get the most recent active poll with its options.
 * Creates a default poll if none exists (first-run seed).
 */
export async function getPoll() {
  try {
    const poll = (await db
      .collection(COLLECTIONS.POLLS)
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(1)
      .next()) as unknown as Poll | null;

    if (!poll) {
      const pollId = randomUUID();
      const now = new Date();

      const newPoll: Poll = {
        id: pollId,
        question: "Which game you want next?",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      await db.collection(COLLECTIONS.POLLS).insertOne(newPoll);

      const defaultOptions: PollOption[] = [
        { id: randomUUID(), label: "Inductive Challenge", votes: 45, isInput: false, pollId },
        { id: randomUUID(), label: "Grid Challenge", votes: 32, isInput: false, pollId },
        { id: randomUUID(), label: "Motion Challenge", votes: 28, isInput: false, pollId },
        { id: randomUUID(), label: "Suggest new game", isInput: true, votes: 12, pollId },
      ];

      await db.collection(COLLECTIONS.POLL_OPTIONS).insertMany(defaultOptions);

      const options = (await db
        .collection(COLLECTIONS.POLL_OPTIONS)
        .find({ pollId })
        .sort({ label: 1 })
        .toArray()) as unknown as PollOption[];

      return { ...newPoll, options };
    }

    const options = (await db
      .collection(COLLECTIONS.POLL_OPTIONS)
      .find({ pollId: poll.id })
      .sort({ label: 1 })
      .toArray()) as unknown as PollOption[];

    return { ...poll, options };
  } catch (error) {
    console.error("Error fetching poll:", error);
    return null;
  }
}

/**
 * Submit a vote for a poll option.
 */
export async function submitVote(optionId: string, suggestion?: string) {
  try {
    await db
      .collection(COLLECTIONS.POLL_OPTIONS)
      .updateOne({ id: optionId }, { $inc: { votes: 1 } });

    if (suggestion) {
      console.log("New game suggestion:", suggestion);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return { success: false, error: "Failed to submit vote" };
  }
}
