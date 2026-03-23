import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const session = await auth()

   if (session?.user) {
      return redirect("/")
   }
   return (
      <main>
         <div className="h-screen flex flex-col items-center justify-center">
            {children}
         </div>
      </main>
   );
}
