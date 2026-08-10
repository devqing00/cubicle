"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import HugeIcon from "@/components/ui/HugeIcon";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [role, setRole] = useState<"student" | "tutor">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        fullName: name,
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
      });
      
      const idToken = await user.getIdToken();
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      
      toast.success("Account created successfully!");
      router.push(role === "tutor" ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create account";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "Student",
        fullName: user.displayName || "Student",
        email: user.email,
        role: role, 
        createdAt: new Date().toISOString(),
      }, { merge: true });
      
      const idToken = await user.getIdToken();
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      toast.success("Signed in with Google!");
      router.push(role === "tutor" ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign up with Google";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-[28px] shadow-sm border border-border-light relative z-10 space-y-6">
      
      {/* Header */}
      <div>
        <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-3 inline-block">
          New Registration
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-1">
          Create an account
        </h1>
        <p className="font-body text-xs text-text-secondary">
          Join Cubicle to schedule 1-on-1 language lessons.
        </p>
      </div>

      {/* Role Switcher */}
      <div className="flex p-1 bg-surface-muted rounded-xl border border-border-light" role="tablist" aria-label="Account role selection">
        <button
          type="button"
          role="tab"
          aria-selected={role === "student"}
          onClick={() => setRole("student")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            role === "student"
              ? "bg-white text-text-primary shadow-xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          I am a Student
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={role === "tutor"}
          onClick={() => setRole("tutor")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            role === "tutor"
              ? "bg-white text-text-primary shadow-xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          I am a Tutor
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailSignup} className="space-y-4" aria-label="Sign up registration form">
        <div>
          <label htmlFor="signup-name" className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary placeholder:text-text-subtle transition-colors focus:border-accent-blue"
            placeholder="Alexander Adetayo"
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary placeholder:text-text-subtle transition-colors focus:border-accent-blue"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="signup-password" className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] font-medium text-accent-blue hover:underline focus-visible:ring-1 focus-visible:ring-accent-blue"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary placeholder:text-text-subtle transition-colors focus:border-accent-blue"
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-xs"
        >
          {loading ? "Creating account..." : "Complete Registration"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border-light" />
        <span className="font-body text-[10px] text-text-subtle uppercase tracking-widest font-semibold">Or</span>
        <div className="flex-1 h-px bg-border-light" />
      </div>

      {/* Google Button */}
      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full py-3 bg-white text-text-primary border border-border-light rounded-full font-body text-xs font-semibold flex items-center justify-center gap-2.5 hover:bg-surface-muted transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Sign up with Google account"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span>Sign up with Google</span>
      </button>

      {/* Switch to Log in */}
      <p className="text-center font-body text-xs text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-text-primary font-bold hover:underline focus-visible:ring-1 focus-visible:ring-accent-blue rounded">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="bg-white p-8 rounded-[28px] border border-border-light min-h-[350px] flex items-center justify-center font-body text-xs text-text-secondary">Loading registration...</div>}>
      <SignupForm />
    </Suspense>
  );
}
