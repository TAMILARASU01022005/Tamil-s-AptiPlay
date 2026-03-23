import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileStats } from "@/features/profile/actions";
import ProfileClient from "./ProfileClient";
import type { User } from "@/types/user";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) redirect("/register");

  const stats = await getProfileStats(session.user.id ?? "");

  return <ProfileClient user={session.user as User} stats={stats} />;
}
