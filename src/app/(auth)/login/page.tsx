"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import HugeIcon from "@/components/ui/HugeIcon";
import { getCleanErrorMessage } from "@/lib/firebaseErrors";
import Logo from "@/components/ui/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal state for when user logs in with Google/Email but has no registered Cubicle profile
  const [unregisteredModal, setUnregisteredModal] = useState<{
    uid: string;
    email: string;
    displayName: string;
    idToken: string;
  } | null>(null);
  const [registering, setRegistering] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      
      // Verify account document exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        setUnregisteredModal({
          uid: result.user.uid,
          email: result.user.email || email,
          displayName: result.user.displayName || "Student",
          idToken,
        });
        return;
      }

      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      
      toast.success("Welcome back!");
      router.push(redirectPath);
    } catch (err: unknown) {
      toast.error(getCleanErrorMessage(err, "Failed to log in"));
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
      
      // Verify account document exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        setUnregisteredModal({
          uid: result.user.uid,
          email: result.user.email || "",
          displayName: result.user.displayName || "Student",
          idToken,
        });
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server Login Error Details:", errorData);
        throw new Error(errorData.details || errorData.error || "Server failed to create session.");
      }
      
      toast.success("Logged in with Google!");
      router.push(redirectPath);
    } catch (err: any) {
      console.error("Login exception:", err);
      toast.error(getCleanErrorMessage(err, "Failed to log in with Google"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUnregistered = async () => {
    if (!unregisteredModal) return;
    setRegistering(true);
    try {
      await setDoc(doc(db, "users", unregisteredModal.uid), {
        uid: unregisteredModal.uid,
        displayName: unregisteredModal.displayName,
        fullName: unregisteredModal.displayName,
        email: unregisteredModal.email,
        role: "student",
        createdAt: new Date().toISOString(),
      }, { merge: true });

      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: unregisteredModal.idToken }),
      });

      toast.success("Account created successfully! Welcome to Cubicle.");
      setUnregisteredModal(null);
      router.push("/onboarding");
    } catch (err) {
      toast.error(getCleanErrorMessage(err, "Failed to create account"));
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelUnregistered = async () => {
    await signOut(auth);
    setUnregisteredModal(null);
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-[28px] shadow-sm border border-border-light relative z-10 space-y-6">
      
      {/* Header */}
      <div>
        <div className="mb-4">
          <Logo variant="blue" size={26} />
        </div>
        <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-3 inline-block">
          Account Login
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="font-body text-xs text-text-secondary">
          Enter your credentials to access your lessons and schedule.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4" aria-label="Log in form">
        <div>
          <label htmlFor="login-email" className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
            Email address
          </label>
          <input
            id="login-email"
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
            <label htmlFor="login-password" className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider">
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
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs text-text-primary placeholder:text-text-subtle transition-colors focus:border-accent-blue"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-xs"
        >
          {loading ? "Logging in..." : "Log in"}
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
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-3 bg-white text-text-primary border border-border-light rounded-full font-body text-xs font-semibold flex items-center justify-center gap-2.5 hover:bg-surface-muted transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Log in with Google account"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Switch to Sign up */}
      <p className="text-center font-body text-xs text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-text-primary font-bold hover:underline focus-visible:ring-1 focus-visible:ring-accent-blue rounded">
          Sign up
        </Link>
      </p>

      {/* Unregistered Account Modal */}
      {unregisteredModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-border-light shadow-xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
              <HugeIcon name="sparkles" size={24} />
            </div>

            <div>
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/20 mb-2 inline-block">
                Account Not Found
              </span>
              <h3 className="font-heading text-xl font-bold text-text-primary">
                Create a student profile?
              </h3>
              <p className="font-body text-xs text-text-secondary mt-1.5 leading-relaxed">
                No registered Cubicle account was found for <strong className="text-text-primary">{unregisteredModal.email}</strong>. Would you like to create a new student account with this email now?
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleRegisterUnregistered}
                disabled={registering}
                className="w-full py-3 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2"
              >
                {registering ? "Creating Account..." : "Create Account & Continue"}
              </button>
              <button
                onClick={handleCancelUnregistered}
                disabled={registering}
                className="w-full py-2.5 bg-surface-near-white text-text-secondary border border-border-light rounded-full font-body text-xs font-medium hover:text-text-primary transition-colors"
              >
                Use Different Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-white p-8 rounded-[28px] border border-border-light min-h-[350px] flex items-center justify-center font-body text-xs text-text-secondary">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
