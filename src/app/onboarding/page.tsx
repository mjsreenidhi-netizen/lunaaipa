import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { Moon } from "lucide-react";

export const metadata = {
  title: "Get Started — LunaRhythm",
};

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("users")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  const profile = profileData as { onboarding_completed: boolean } | null;

  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  return (
    <main className="luna-bg-gradient min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-luna-accent/20 luna-glow-sm mb-4">
            <Moon className="h-7 w-7 text-luna-accent" />
          </div>
          <h1 className="text-2xl font-bold text-luna-text">
            Welcome to LunaRhythm
          </h1>
          <p className="text-luna-muted text-sm mt-2">
            Let&apos;s personalize your experience in just a few steps
          </p>
        </div>

        <div className="rounded-2xl border border-luna-border bg-luna-surface/50 backdrop-blur-sm p-6 luna-glow">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
