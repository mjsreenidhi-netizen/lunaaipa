import { Moon } from "lucide-react";
import { EmailSignInForm } from "@/components/auth/EmailSignInForm";
import "./login.css";

export const metadata = {
  title: "Sign In — LunaRhythm",
};

export default function LoginPage() {
  return (
    <div className="login-root">
      {/* Background Elements */}
      <div className="stars-bg"></div>
      <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
      </div>

      <div className="auth-container">
          <div className="glass-panel auth-card">
              <div className="logo-auth">
                  <Moon className="h-6 w-6" fill="currentColor" strokeWidth={0} />
                  <span>LUNARHYTHM</span>
              </div>
              <h1>WELCOME, DAUGHTER<br/>OF THE MOON</h1>
              <p className="auth-subtitle">Your AI-powered adventure companion awaits.</p>
              
              <EmailSignInForm />
          </div>
      </div>
    </div>
  );
}
