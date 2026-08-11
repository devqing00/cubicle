"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  fullName?: string;
  role: "student" | "tutor";
  createdAt?: string;
  onboardingComplete?: boolean;
  firstName?: string;
  age?: number;
  whatsappNumber?: string;
  whatsapp?: string;
  phoneNumber?: string;
  learningGoals?: string;
  learningGoal?: string;
  targetLanguage?: string;
  experienceLevel?: string;
  level?: string;
  timeZone?: string;
  guardianName?: string;
  guardianContact?: string;
  tutorNotes?: string;
  meetLink?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true, refreshUserData: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userDocUnsubscribe: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      // Clean up previous Firestore listener if user changes
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }

      setUser(authUser);

      if (authUser) {
        // Setup real-time listener for user profile document in Firestore
        userDocUnsubscribe = onSnapshot(doc(db, "users", authUser.uid), async (userSnap) => {
          if (!userSnap.exists()) {
            const isAuthRoute = typeof window !== "undefined" && (
              window.location.pathname.startsWith("/login") ||
              window.location.pathname.startsWith("/signup") ||
              window.location.pathname.startsWith("/onboarding")
            );

            if (!isAuthRoute) {
              console.warn("User document deleted or not found. Force signing out.");
              await signOut(auth);
              await fetch("/api/auth/logout", { method: "POST" });
              setUser(null);
              setUserData(null);
              setLoading(false);
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
              return;
            }

            setUserData(null);
            setLoading(false);
            return;
          }

          let fetchedData = userSnap.data() as UserData;

          // Auto-promote to Tutor if email matches
          if (authUser.email && process.env.NEXT_PUBLIC_ADMIN_EMAIL && authUser.email.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase()) {
            if (fetchedData.role !== "tutor" || !fetchedData.onboardingComplete) {
              fetchedData.role = "tutor";
              fetchedData.onboardingComplete = true;
              await setDoc(doc(db, "users", authUser.uid), { role: "tutor", onboardingComplete: true }, { merge: true });
            }
          }

          setUserData(fetchedData);
          setLoading(false);
        }, (err) => {
          console.error("Firestore user doc listener error:", err);
          setLoading(false);
        });

        // Sync session cookie with server
        try {
          const idToken = await authUser.getIdToken();
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
        } catch (e) {
          console.warn("Session login sync warning:", e);
        }
      } else {
        setUserData(null);
        await fetch("/api/auth/logout", { method: "POST" });
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (userDocUnsubscribe) userDocUnsubscribe();
    };
  }, []);

  const refreshUserData = async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
