import Link from "next/link";
import { Moon, Sparkles, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="luna-bg-gradient min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-luna-border/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-luna-accent/20">
            <Moon className="h-4 w-4 text-luna-accent" />
          </div>
          <span className="font-bold text-luna-text">LunaRhythm</span>
        </div>
        <Link href="/login">
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="fade-in max-w-2xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-luna-accent/30 bg-luna-accent/10 text-luna-accent text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            Phase 1 — Now Available
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-luna-text leading-tight">
            Live in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-luna-accent to-luna-rose">
              rhythm
            </span>{" "}
            with yourself
          </h1>

          <p className="text-lg text-luna-muted max-w-lg mx-auto leading-relaxed">
            LunaRhythm syncs your cycle, work, and wellness with AI-powered
            insights. Two realms, one flow — designed for how you actually live.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Moon className="h-4 w-4" />
                Begin your journey
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-luna-border/50">
            <div className="p-5 rounded-xl border border-luna-border bg-luna-surface/30 text-left space-y-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-luna-personal/20">
                <Moon className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-luna-text">Personal Realm</h3>
              <p className="text-sm text-luna-muted">
                Cycle tracking, wellness insights, and body literacy in one
                beautiful space.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-luna-border bg-luna-surface/30 text-left space-y-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-luna-work/20">
                <Briefcase className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-luna-text">Work Realm</h3>
              <p className="text-sm text-luna-muted">
                Align your professional goals with your natural energy patterns
                for peak performance.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-luna-border bg-luna-surface/30 text-left space-y-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-luna-accent/20">
                <Star className="h-5 w-5 text-luna-accent" />
              </div>
              <h3 className="font-semibold text-luna-text">Luna AI</h3>
              <p className="text-sm text-luna-muted">
                Your personal AI companion that understands your cycle and
                tailors guidance to your rhythm.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-luna-muted border-t border-luna-border/30">
        © {new Date().getFullYear()} LunaRhythm. Built with care for every phase.
      </footer>
    </main>
  );
}
