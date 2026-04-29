import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RealmProvider } from "@/contexts/RealmContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { RealmToggle } from "@/components/dashboard/RealmToggle";
import { UserMenu } from "@/components/dashboard/UserMenu";
import type { Realm } from "@/types/realm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("users")
    .select("name, current_realm, onboarding_completed")
    .eq("id", user.id)
    .single();

  const profile = profileData as {
    name: string | null;
    current_realm: string;
    onboarding_completed: boolean;
  } | null;

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const currentRealm = (profile?.current_realm ?? "personal") as Realm;

  return (
    <RealmProvider initialRealm={currentRealm} userId={user.id}>
      <div className="flex min-h-screen bg-luna-bg">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-6 py-3 border-b border-luna-border bg-luna-surface/20 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-luna-muted hidden md:block">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <RealmToggle />
              <UserMenu
                name={profile?.name ?? null}
                email={user.email!}
                avatarUrl={user.user_metadata?.avatar_url}
              />
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </RealmProvider>
  );
}
