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
    console.warn("Missing Firebase Admin credentials. Using fallback...");
    adminAppInstance = initializeApp();
    return adminAppInstance;
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
    // Fallback to prevent immediate crash, though subsequent calls will likely fail
    adminAppInstance = initializeApp();
    return adminAppInstance;
  }
};

export const adminAuth = new Proxy({} as any, {
  get: (target, prop) => {
    return (getAuth(getFirebaseAdminApp()) as any)[prop];
  }
});

export const adminDb = new Proxy({} as any, {
  get: (target, prop) => {
    return (getFirestore(getFirebaseAdminApp()) as any)[prop];
  }
});
