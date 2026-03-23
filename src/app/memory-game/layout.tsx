import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/common/Header";
import type { User } from "@/types/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = (session?.user as User) ?? null;
  return (
    <UserProvider user={user}>
              <Header />
      <main className="flex-1 p-6">{children}</main>

    </UserProvider>
  );
}
