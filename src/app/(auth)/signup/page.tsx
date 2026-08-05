"use client";

import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "tutor">("student");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email: user.email,
        role,
        createdAt: new Date().toISOString(),
      });
      
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "User",
        email: user.email,
        role, 
        createdAt: new Date().toISOString(),
      }, { merge: true });

      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-brutal border border-border-warm relative z-10">
      <h1 className="font-heading text-3xl font-bold text-dark-charcoal mb-2">Create an account</h1>
      <p className="font-body text-[15px] text-mid-gray-brown mb-6">Join Cubicle and start your journey.</p>

      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-body">
          {error}
        </div>
      )}

      {/* Role Toggle */}
      <div className="flex gap-2 bg-surface-base p-1.5 rounded-2xl mb-6 border border-border-warm shadow-inner">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex-1 py-3 rounded-xl font-body text-[15px] font-medium transition-all duration-300 relative ${
            role === "student" 
            ? "bg-chip-orange text-dark-charcoal border border-black" 
            : "text-mid-gray-brown hover:text-dark-charcoal hover:bg-white/50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            I'm a Student
          </div>
        </button>
        <button
          type="button"
          onClick={() => setRole("tutor")}
          className={`flex-1 py-3 rounded-xl font-body text-[15px] font-medium transition-all duration-300 relative ${
            role === "tutor" 
            ? "bg-chip-blue text-dark-charcoal border border-black" 
            : "text-mid-gray-brown hover:text-dark-charcoal hover:bg-white/50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            I'm a Tutor
          </div>
        </button>
      </div>

      <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
        <div>
          <label className="block font-body text-sm font-medium text-dark-charcoal mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-green/20 focus:outline-none focus:ring-2 focus:ring-chip-green focus:border-chip-green transition-all duration-300 font-body text-dark-charcoal placeholder:text-gray-400 hover:bg-chip-green/10"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-dark-charcoal mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-green/20 focus:outline-none focus:ring-2 focus:ring-chip-green focus:border-chip-green transition-all duration-300 font-body text-dark-charcoal placeholder:text-gray-400 hover:bg-chip-green/10"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-dark-charcoal mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-border-warm bg-surface-base focus:bg-chip-green/20 focus:outline-none focus:ring-2 focus:ring-chip-green focus:border-chip-green transition-all duration-300 font-body text-dark-charcoal placeholder:text-gray-400 hover:bg-chip-green/10"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-4 bg-oboe-black text-white rounded-full font-body text-[15px] font-medium hover:bg-chip-green hover:text-oboe-black transition-all duration-300 shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <div className="flex-1 h-px bg-border-warm"></div>
        <span className="font-body text-xs text-mid-gray-brown uppercase tracking-widest font-medium">Or</span>
        <div className="flex-1 h-px bg-border-warm"></div>
      </div>

      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full py-4 bg-white text-dark-charcoal border border-border-warm rounded-full font-body text-[15px] font-medium flex items-center justify-center gap-3 hover:bg-chip-blue hover:border-chip-blue transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign up with Google
      </button>

      <p className="mt-8 text-center font-body text-[15px] text-mid-gray-brown">
        Already have an account?{" "}
        <Link href="/login" className="text-oboe-black font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
