import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileTopBar } from "@/components/dashboard/mobile-topbar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { AdminLink } from "@/components/dashboard/admin-link";
import { CreditMeter } from "@/components/dashboard/credit-meter";
import { Toaster } from "@/components/ui/sonner";
import { getUserCredits } from "@/lib/credits";

const ADMIN_EMAILS = ["t99.sultan@gmail.com"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: folders } = await supabase
    .from("folders")
    .select("*")
    .order("created_at", { ascending: false });

  const isAdmin = !!user.email && ADMIN_EMAILS.includes(user.email);
  const folderRows = folders ?? [];
  const email = user.email ?? "";

  const credits = await getUserCredits(supabase, user.id);

  return (
    <div className="flex h-svh">
      <Sidebar folders={folderRows} userEmail={email} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar — visible <md */}
        <MobileTopBar
          folders={folderRows}
          userEmail={email}
          rightSlot={
            <>
              <CreditMeter credits={credits} />
              {isAdmin && <AdminLink />}
              <UserMenu email={email} />
            </>
          }
        />
        {/* Desktop top bar — visible md+ */}
        <header className="hidden h-14 items-center justify-end gap-2 border-b border-border/60 bg-background/80 px-5 backdrop-blur-md md:flex">
          <CreditMeter credits={credits} />
          {isAdmin && <AdminLink />}
          <UserMenu email={email} />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
