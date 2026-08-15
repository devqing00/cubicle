import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

let adminAppInstance: ReturnType<typeof initializeApp> | null = null;

export const getFirebaseAdminApp = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (adminAppInstance) return adminAppInstance;

  if (!firebaseAdminConfig.privateKey || !firebaseAdminConfig.clientEmail) {
    console.error("CRITICAL: Missing Firebase Admin credentials. Check Vercel Environment Variables.");
    // If we call initializeApp() without args on Vercel, it hangs trying to reach the GCP metadata server, 
    // causing a 500 timeout. So we throw an explicit error instead to fail fast.
    throw new Error("Firebase Admin credentials missing. Cannot initialize application.");
  }

  try {
    const formattedPrivateKey = firebaseAdminConfig.privateKey.replace(/"/g, "").replace(/\\n/g, "\n");
    adminAppInstance = initializeApp({
      credential: cert({
        projectId: firebaseAdminConfig.projectId,
        clientEmail: firebaseAdminConfig.clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
    return adminAppInstance;
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
    throw error;
  }
};

export const adminAuth = new Proxy({} as any, {
  get: (target, prop) => {
    const auth = getAuth(getFirebaseAdminApp());
    const val = (auth as any)[prop];
    return typeof val === "function" ? val.bind(auth) : val;
  }
});

export const adminDb = new Proxy({} as any, {
  get: (target, prop) => {
    const db = getFirestore(getFirebaseAdminApp());
    const val = (db as any)[prop];
    return typeof val === "function" ? val.bind(db) : val;
  }
});
