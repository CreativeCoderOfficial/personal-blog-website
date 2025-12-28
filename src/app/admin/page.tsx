"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- MOCK LOGIN FUNCTION ---
  // In production, this would call an API route (e.g. /api/auth/login)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate Network Delay
    setTimeout(() => {
      // HARDCODED CHECK FOR DEMO PURPOSES ONLY
      if (username === "admin" && password === "password123") {
        // Set a cookie (Client-side simulation)
        document.cookie = "admin_session=true; path=/";
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Access denied.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-main flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Card */}
        <div className="
          bg-card/50 backdrop-blur-xl border border-border-subtle 
          p-8 md:p-10 rounded-3xl shadow-2xl
        ">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-orange/10 text-accent-orange mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Portal</h1>
            <p className="text-text-secondary">Please enter your credentials to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-accent-purple transition-colors" />
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="
                    w-full pl-12 pr-4 py-3.5
                    bg-main/50 border border-border-subtle rounded-xl 
                    text-text-primary placeholder:text-text-secondary/50
                    focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple
                    transition-all
                  "
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-accent-purple transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full pl-12 pr-4 py-3.5
                    bg-main/50 border border-border-subtle rounded-xl 
                    text-text-primary placeholder:text-text-secondary/50
                    focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple
                    transition-all
                  "
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="
                w-full py-4 rounded-xl font-bold text-lg
                bg-gradient-to-r from-accent-purple to-purple-600
                text-white shadow-lg shadow-purple-500/20
                hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-70 disabled:cursor-not-allowed
                transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              ← Return to Website
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}