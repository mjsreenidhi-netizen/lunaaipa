"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIMEZONES } from "@/lib/utils/timezone";
import { submitOnboarding } from "@/app/onboarding/actions";
import { ChevronRight, ChevronLeft, Moon, Sparkles } from "lucide-react";

const onboardingSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timezone: z.string().min(1, "Timezone is required"),
  city: z.string().max(100).optional(),
  cycleLength: z.number().min(21, "Cycle length must be at least 21 days").max(45, "Cycle length must be at most 45 days"),
  periodDuration: z.number().min(1, "Period duration must be at least 1 day").max(10, "Period duration must be at most 10 days"),
  cycleRegularity: z.enum(["regular", "irregular", "uncertain"]),
  primaryGoal: z.enum([
    "track_fertility",
    "manage_symptoms",
    "understand_body",
    "productivity",
  ]),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const STEPS = [
  { id: "personal", label: "About You", icon: "✨" },
  { id: "cycle", label: "Your Cycle", icon: "🌙" },
  { id: "goals", label: "Your Goals", icon: "⭐" },
];

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      cycleLength: 28,
      periodDuration: 5,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    },
  });

  const watchedTimezone = watch("timezone");
  const watchedCycleRegularity = watch("cycleRegularity");
  const watchedPrimaryGoal = watch("primaryGoal");

  async function goToNextStep() {
    const fields: Record<number, (keyof OnboardingFormValues)[]> = {
      0: ["name", "dateOfBirth", "timezone"],
      1: ["cycleLength", "periodDuration", "cycleRegularity"],
    };

    const currentFields = fields[step];
    if (currentFields) {
      const valid = await trigger(currentFields);
      if (!valid) return;
    }

    setStep((s) => s + 1);
  }

  async function onSubmit(data: OnboardingFormValues) {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      const result = await submitOnboarding(formData);
      if (result?.error) {
        setServerError(result.error);
        setIsSubmitting(false);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300 ${
                i < step
                  ? "bg-luna-accent text-luna-bg"
                  : i === step
                    ? "bg-luna-accent/20 border-2 border-luna-accent text-luna-accent"
                    : "bg-luna-surface border border-luna-border text-luna-muted"
              }`}
            >
              {i < step ? "✓" : s.icon}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 transition-all duration-300 ${
                  i < step ? "bg-luna-accent" : "bg-luna-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <Moon className="h-8 w-8 text-luna-accent mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-luna-text">Tell us about yourself</h2>
              <p className="text-sm text-luna-muted mt-1">This helps us personalize your experience</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                placeholder="What shall we call you?"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-400">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={watchedTimezone}
                onValueChange={(val) => setValue("timezone", val)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timezone && (
                <p className="text-xs text-red-400">{errors.timezone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                City{" "}
                <span className="text-luna-muted font-normal">(optional)</span>
              </Label>
              <Input
                id="city"
                placeholder="e.g. New York, London, Tokyo"
                {...register("city")}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🌙</div>
              <h2 className="text-xl font-semibold text-luna-text">Your cycle</h2>
              <p className="text-sm text-luna-muted mt-1">
                Help us understand your rhythm. You can always update this later.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cycleLength">Cycle length (days)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  min={21}
                  max={45}
                  {...register("cycleLength", { valueAsNumber: true })}
                />
                {errors.cycleLength && (
                  <p className="text-xs text-red-400">{errors.cycleLength.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodDuration">Period duration (days)</Label>
                <Input
                  id="periodDuration"
                  type="number"
                  min={1}
                  max={10}
                  {...register("periodDuration", { valueAsNumber: true })}
                />
                {errors.periodDuration && (
                  <p className="text-xs text-red-400">{errors.periodDuration.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>How regular is your cycle?</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "regular", label: "Regular", desc: "±2 days" },
                  { value: "irregular", label: "Irregular", desc: "Varies a lot" },
                  { value: "uncertain", label: "Uncertain", desc: "Not sure" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setValue(
                        "cycleRegularity",
                        opt.value as "regular" | "irregular" | "uncertain"
                      )
                    }
                    className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                      watchedCycleRegularity === opt.value
                        ? "border-luna-accent bg-luna-accent/10 text-luna-text"
                        : "border-luna-border bg-luna-bg text-luna-muted hover:border-luna-accent/50"
                    }`}
                  >
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
              {errors.cycleRegularity && (
                <p className="text-xs text-red-400">Please select an option</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <Sparkles className="h-8 w-8 text-luna-accent mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-luna-text">Your primary goal</h2>
              <p className="text-sm text-luna-muted mt-1">
                What do you most want to achieve with LunaRhythm?
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  value: "track_fertility",
                  label: "Track Fertility",
                  desc: "Monitor fertile windows and reproductive health",
                  emoji: "🌸",
                },
                {
                  value: "manage_symptoms",
                  label: "Manage Symptoms",
                  desc: "Understand and ease PMS, cramps, and other symptoms",
                  emoji: "💆",
                },
                {
                  value: "understand_body",
                  label: "Understand My Body",
                  desc: "Learn about my cycle phases and hormonal patterns",
                  emoji: "🔮",
                },
                {
                  value: "productivity",
                  label: "Optimize Productivity",
                  desc: "Align work and life with my natural energy cycles",
                  emoji: "⚡",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setValue(
                      "primaryGoal",
                      opt.value as
                        | "track_fertility"
                        | "manage_symptoms"
                        | "understand_body"
                        | "productivity"
                    )
                  }
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                    watchedPrimaryGoal === opt.value
                      ? "border-luna-accent bg-luna-accent/10"
                      : "border-luna-border bg-luna-bg hover:border-luna-accent/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{opt.emoji}</span>
                    <div>
                      <div className="text-sm font-medium text-luna-text">
                        {opt.label}
                      </div>
                      <div className="text-xs text-luna-muted mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    {watchedPrimaryGoal === opt.value && (
                      <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-luna-accent flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-luna-bg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
              {errors.primaryGoal && (
                <p className="text-xs text-red-400">Please select a goal</p>
              )}
            </div>

            {serverError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-400">{serverError}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={goToNextStep}
              className="flex-1"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-luna-bg border-t-transparent" />
                  Setting up...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Enter LunaRhythm
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
