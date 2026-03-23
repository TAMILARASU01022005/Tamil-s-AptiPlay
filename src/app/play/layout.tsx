import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/common/Header";
import type { User } from "@/types/user";

// Gameplay pages are not SEO targets — the /games/* pages are.
// noindex prevents Google from indexing auth-gated gameplay URLs.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return redirect("/register");
  }

  const user = (session?.user as User) ?? null;
  
  return (
    <UserProvider user={user}>
              <Header />
      <main className="flex-1 p-6">{children}</main>

    </UserProvider>
  );
}
