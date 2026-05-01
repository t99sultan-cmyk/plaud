import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { AdminLink } from "@/components/dashboard/admin-link";
import { Toaster } from "@/components/ui/sonner";

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

  return (
    <div className="flex h-svh">
      <Sidebar folders={folders ?? []} userEmail={user.email ?? ""} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-end gap-2 border-b border-border/60 bg-background/80 px-5 backdrop-blur-md">
          {isAdmin && <AdminLink />}
          <UserMenu email={user.email ?? ""} />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
