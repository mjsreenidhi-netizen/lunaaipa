import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata = {
  title: "Dashboard — LunaRhythm",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profileData) {
    redirect("/onboarding");
  }

  const profile = profileData as import("@/types/database").UserRow;

  return (
    <DashboardContent
      profile={profile}
    />
  );
}
