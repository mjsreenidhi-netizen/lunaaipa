"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const onboardingSchema = z.object({
  name: z.string().min(1).max(100),
  dateOfBirth: z.string().min(1),
  timezone: z.string().min(1),
  city: z.string().max(100).optional(),
  cycleLength: z.coerce.number().min(21).max(45),
  periodDuration: z.coerce.number().min(1).max(10),
  cycleRegularity: z.enum(["regular", "irregular", "uncertain"]),
  primaryGoal: z.enum([
    "track_fertility",
    "manage_symptoms",
    "understand_body",
    "productivity",
  ]),
});

export async function submitOnboarding(
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to complete onboarding." };
  }

  const rawData = {
    name: formData.get("name"),
    dateOfBirth: formData.get("dateOfBirth"),
    timezone: formData.get("timezone"),
    city: formData.get("city"),
    cycleLength: formData.get("cycleLength"),
    periodDuration: formData.get("periodDuration"),
    cycleRegularity: formData.get("cycleRegularity"),
    primaryGoal: formData.get("primaryGoal"),
  };

  const parsed = onboardingSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: "Invalid form data. Please check your inputs." };
  }

  const data = parsed.data;

  const { error: upsertError } = await (supabase as any).from("users").upsert({
    id: user.id,
    email: user.email!,
    name: data.name,
    date_of_birth: data.dateOfBirth,
    timezone: data.timezone,
    city: data.city || null,
    cycle_length: data.cycleLength,
    period_duration: data.periodDuration,
    cycle_regularity: data.cycleRegularity,
    primary_goal: data.primaryGoal,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  });

  if (upsertError) {
    console.error("Onboarding upsert error:", upsertError);
    return { error: "Failed to save your profile. Please try again." };
  }

  redirect("/dashboard");
}
