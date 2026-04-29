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

  let profile = profileData as import("@/types/database").UserRow | null;

  if (!profile) {
    profile = {
      id: user.id,
      email: user.email || "",
      name: "Luna",
      cycle_length: 28,
      period_duration: 5,
      cycle_regularity: "regular",
      primary_goal: "understand_body",
      onboarding_completed: true,
      current_realm: "personal",
    };
  }

  return (
    <DashboardContent />
  );
}
