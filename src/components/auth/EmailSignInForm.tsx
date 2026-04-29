"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    const supabase = createClient();

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        setSuccessMsg("Check your email for the confirmation link!");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleEmailAuth} className="space-y-4">
      {error && <div className="text-red-400 text-sm p-3 border border-red-400/20 bg-red-400/10 rounded-lg">{error}</div>}
      {successMsg && <div className="text-green-400 text-sm p-3 border border-green-400/20 bg-green-400/10 rounded-lg">{successMsg}</div>}
      
      <div className="space-y-2 text-left">
        <Label htmlFor="email" className="text-luna-text">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="bg-luna-surface border-luna-border text-luna-text"
        />
      </div>
      
      <div className="space-y-2 text-left">
        <Label htmlFor="password" className="text-luna-text">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-luna-surface border-luna-border text-luna-text"
        />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-luna-bg border-t-transparent" />
            <span>Please wait...</span>
          </div>
        ) : isSignUp ? "Sign Up" : "Sign In"}
      </Button>

      <div className="text-center text-sm text-luna-muted mt-4">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-luna-accent hover:underline focus:outline-none"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </form>
  );
}
