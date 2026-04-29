"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function EmailSignInForm() {
  const [email, setEmail] = useState("moonchild@realm.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleEmailAuth} className="auth-form">
        {error && <div style={{ color: "#e57373", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{error}</div>}
        
        <input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
          placeholder="Email Address"
        />
        
        <input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
          placeholder="Password"
        />

        <button type="submit" className="btn-primary-auth" disabled={isLoading}>
          {isLoading ? "PLEASE WAIT..." : "ENTER REALM"}
        </button>
      </form>

      <div className="divider-auth">OR</div>
      
      <button type="button" className="google-btn-auth" onClick={handleGoogleSignIn} disabled={isLoading}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="20" />
        Continue with Google
      </button>
    </>
  );
}
