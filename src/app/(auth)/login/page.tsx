"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      const idToken = await result.user.getIdToken();
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      
      router.push(redirectPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to log in";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const idToken = await result.user.getIdToken();
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      
      router.push(redirectPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to log in with Google";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-brutal border border-border-warm relative z-10">
      <h1 className="font-heading text-3xl font-bold text-dark-charcoal mb-2">Welcome back</h1>
      <p className="font-body text-[15px] text-mid-gray-brown mb-8">Enter your details to access your account.</p>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-5">
        <div>
          <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-blue/20 focus:outline-none focus:ring-2 focus:ring-chip-blue focus:border-chip-blue transition-all duration-300 font-body text-dark-charcoal placeholder:text-gray-400 hover:bg-chip-blue/10"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-dark-charcoal mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-blue/20 focus:outline-none focus:ring-2 focus:ring-chip-blue focus:border-chip-blue transition-all duration-300 font-body text-dark-charcoal placeholder:text-gray-400 hover:bg-chip-blue/10"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-4 bg-oboe-black text-white rounded-full font-body text-[15px] font-medium hover:bg-chip-blue hover:text-oboe-black transition-all duration-300 shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-border-warm"></div>
        <span className="font-body text-xs text-mid-gray-brown uppercase tracking-widest font-medium">Or</span>
        <div className="flex-1 h-px bg-border-warm"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-4 bg-white text-dark-charcoal border border-border-warm rounded-full font-body text-[15px] font-medium flex items-center justify-center gap-3 hover:bg-chip-pink/30 hover:border-chip-pink transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <p className="mt-8 text-center font-body text-[15px] text-mid-gray-brown">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-oboe-black font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-white p-8 rounded-3xl shadow-brutal border border-border-warm relative z-10 min-h-[400px] flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
