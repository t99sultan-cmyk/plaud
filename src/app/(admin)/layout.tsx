import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/sonner";

const ADMIN_EMAILS = ["t99.sultan@gmail.com"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-svh">
      <AdminSidebar email={user.email} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-muted/20">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
