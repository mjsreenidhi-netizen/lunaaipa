"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function EmailSignInForm() {
  const [email, setEmail] = useState("mjsreenidhi@gmail.com");
  const [password, setPassword] = useState("Sreenidhi@123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Attempt to sign up since sign in failed
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          // If sign up fails because the user already exists, it means they just typed the wrong password
          if (signUpError.message.includes("already registered") || signUpError.message.includes("User already exists")) {
            throw new Error("Invalid password for existing account.");
          }
          // Otherwise throw the sign up error
          throw signUpError;
        }
        
        // Sign up successful! Since email confirm is off, we are logged in.
        window.location.href = "/dashboard";
        return;
      }
      
      // Sign in successful
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
