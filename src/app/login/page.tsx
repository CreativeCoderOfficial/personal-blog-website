// src/app/admin/page.tsx
//
// On submit, we call NextAuth's signIn() with the "credentials" provider.
// NextAuth internally:
//   1. Sends the credentials to /api/auth/signin (with a valid CSRF token automatically)
//   2. Runs the authorize() function in auth.ts
//   3. On success: creates a signed JWT cookie and redirects to /admin
//   4. On failure: redirects back here with ?error=CredentialsSignin in the URL

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

//  we import from "next-auth/react" (not "@/lib/auth") for client components.
//   "next-auth/react" provides the browser-side version of signIn that
//   communicates with the API route 

import { Lock, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // signIn() sends credentials to NextAuth's /api/auth/signin endpoint.
    // "redirect: false" means we handle the result ourselves instead of
    // letting NextAuth do a full page redirect — this gives us control
    // to show an error message if login fails.
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    // In NextAuth v5, check result.ok explicitly rather than just result.error
    if (!result?.ok) {
      setError("Invalid credentials. Access denied.");
      setIsLoading(false);
      return;
    }
    // if (result?.error) {
    //   // NextAuth returns a generic error string — we show our own message
    //   // to avoid leaking any specifics about why login failed
    //   setError("Invalid credentials. Access denied.");
    //   setIsLoading(false);
    //   return;
    // }

    // Success — manually redirect to the dashboard
    router.push("/admin");
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
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-purple/50 transition-colors"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-purple/50 transition-colors"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-orange hover:bg-accent-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}