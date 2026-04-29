import { Moon, Star } from "lucide-react";
import { EmailSignInForm } from "@/components/auth/EmailSignInForm";
import Link from "next/link";

export const metadata = {
  title: "Sign In — LunaRhythm",
};

export default function LoginPage() {
  return (
    <main className="luna-bg-gradient min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm fade-in">
        <div className="text-center mb-8 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-luna-accent/20 luna-glow-sm group-hover:bg-luna-accent/30 transition-colors">
              <Moon className="h-6 w-6 text-luna-accent" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-luna-text">LunaRhythm</h1>
            <p className="text-luna-muted text-sm mt-1">
              Your cycle. Your rhythm. Your power.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-luna-border bg-luna-surface/50 backdrop-blur-sm p-6 space-y-6 luna-glow">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-luna-text">
              Welcome back
            </h2>
            <p className="text-sm text-luna-muted">
              Sign in to continue to your lunar journey
            </p>
          </div>

          <EmailSignInForm />
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-luna-muted">
          <div className="flex items-center gap-1.5">
            <Star className="h-3 w-3 text-luna-accent/60" />
            <span>Secure & private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Moon className="h-3 w-3 text-luna-accent/60" />
            <span>AI-powered insights</span>
          </div>
        </div>

        <p className="text-center text-xs text-luna-muted/50 mt-8">
          By signing in, you agree to our{" "}
          <span className="underline cursor-pointer hover:text-luna-muted">
            Terms
          </span>{" "}
          &{" "}
          <span className="underline cursor-pointer hover:text-luna-muted">
            Privacy Policy
          </span>
        </p>
      </div>
    </main>
  );
}
