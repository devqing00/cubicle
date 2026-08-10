"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  learningGoals?: string;
  guardianName?: string;
  guardianContact?: string;
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          let fetchedData = null;
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            fetchedData = userDoc.data() as UserData;
          } else {
            // Auto-create a basic student profile if they signed in via Google on the login page instead of signup
            fetchedData = {
              uid: user.uid,
              displayName: user.displayName || "Student",
              email: user.email,
              role: "student",
              createdAt: new Date().toISOString(),
            } as UserData;
            await setDoc(doc(db, "users", user.uid), fetchedData);
          }

          // Auto-promote to Tutor if email matches
          if (user.email && process.env.NEXT_PUBLIC_ADMIN_EMAIL && user.email.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase()) {
            if (fetchedData.role !== "tutor" || !fetchedData.onboardingComplete) {
              fetchedData.role = "tutor";
              fetchedData.onboardingComplete = true;
              await setDoc(doc(db, "users", user.uid), { role: "tutor", onboardingComplete: true }, { merge: true });
            }
          }

          setUserData(fetchedData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        // Automatically sync the session cookie with the server when client logs in
        const idToken = await user.getIdToken();
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
      } else {
        setUserData(null);
        // Clear session cookie when client logs out
        await fetch("/api/auth/logout", { method: "POST" });
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
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
