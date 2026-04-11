import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Count actionable passports for notification badge
  const { count: reviewCount } = await supabase
    .from("passports")
    .select("id", { count: "exact", head: true })
    .eq("status", "under_review");

  const { count: draftCount } = await supabase
    .from("passports")
    .select("id", { count: "exact", head: true })
    .eq("status", "draft");

  const notificationCount = (reviewCount ?? 0) + (draftCount ?? 0);

  return (
    <AppShell notificationCount={notificationCount}>
      {children}
    </AppShell>
  );
}
