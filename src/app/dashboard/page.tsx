import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mockAIService } from "@/lib/ai/mock-service";
import { InsightCard, PhaseCard } from "@/components/dashboard/InsightCard";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import type { Realm } from "@/types/realm";

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

  const [cycleAnalysis, insights] = await Promise.all([
    mockAIService.analyzeCycleData({
      cycleLength: profile.cycle_length,
      periodDuration: profile.period_duration,
    }),
    mockAIService.getDailyInsights(
      user.id,
      (profile.current_realm ?? "personal") as Realm
    ),
  ]);

  const realm = (profile.current_realm ?? "personal") as Realm;

  return (
    <DashboardContent
      profile={profile}
      cycleAnalysis={cycleAnalysis}
      insights={insights}
      realm={realm}
    />
  );
}
