import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

export const createFirebaseAdminApp = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (!firebaseAdminConfig.privateKey || !firebaseAdminConfig.clientEmail) {
    console.warn("Missing Firebase Admin credentials. Falling back to application default.");
    try {
      return initializeApp();
    } catch (error) {
      console.error("Failed to initialize default Firebase app", error);
      throw error;
    }
  }

  try {
    // Robust parsing for Vercel environments where quotes might be retained
    const formattedPrivateKey = firebaseAdminConfig.privateKey.replace(/"/g, "").replace(/\\n/g, "\n");
    return initializeApp({
      credential: cert({
        projectId: firebaseAdminConfig.projectId,
        clientEmail: firebaseAdminConfig.clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error. Check private key format:", error);
    throw error;
  }
};

const adminApp = createFirebaseAdminApp();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
