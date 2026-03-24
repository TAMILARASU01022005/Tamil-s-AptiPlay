import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./db";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { COLLECTIONS } from "./schema";

// Render automatically exposes RENDER_EXTERNAL_URL (e.g. https://tamil-s-aptiplay.onrender.com).
// Set it as NEXTAUTH_URL / AUTH_URL before NextAuth initialises so it never falls back to localhost.
if (process.env.RENDER_EXTERNAL_URL) {
  process.env.NEXTAUTH_URL = process.env.RENDER_EXTERNAL_URL;
  process.env.AUTH_URL = process.env.RENDER_EXTERNAL_URL;
}

// Reuse BETTER_AUTH_SECRET if AUTH_SECRET is not explicitly set
const secret = process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret,
  adapter: MongoDBAdapter(clientPromise),
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.collection(COLLECTIONS.USERS).findOne({
          email: credentials.email,
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Fix: Render uses internal port 10000, so NextAuth generates localhost:10000 URLs.
      // Always rewrite the URL to use the real public base URL.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const redirectUrl = new URL(url);
        const base = new URL(baseUrl);
        // If the host is wrong (e.g. localhost:10000), replace it with the correct host
        if (redirectUrl.host !== base.host) {
          redirectUrl.host = base.host;
          redirectUrl.port = "";
          redirectUrl.protocol = base.protocol;
          return redirectUrl.toString();
        }
      } catch {}
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
