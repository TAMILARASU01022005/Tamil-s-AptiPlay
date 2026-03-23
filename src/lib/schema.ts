// ── Collection Names ─────────────────────────────────────────────────────────

export const COLLECTIONS = {
  USERS: "user",
  SESSIONS: "session",
  ACCOUNTS: "account",
  VERIFICATIONS: "verification",
  GAME_SCORES: "game_score",
  POLLS: "poll",
  POLL_OPTIONS: "poll_option",
} as const;

// ── Types & Interfaces ───────────────────────────────────────────────────────

export interface User {
  _id?: string;
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface GameScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  createdAt: Date;
}

export interface Poll {
  id: string;
  question: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
  isInput: boolean;
  pollId: string;
}
