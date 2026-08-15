import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminAppInstance: ReturnType<typeof initializeApp> | null = null;
let initError: any = null;

export const getFirebaseAdminApp = () => {
  if (getApps().length > 0) return getApps()[0];
  if (adminAppInstance) return adminAppInstance;

  try {
    const pk = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!pk || !clientEmail) {
      throw new Error(`Missing credentials. pk exists: ${!!pk}, email exists: ${!!clientEmail}`);
    }

    const formattedPrivateKey = pk.replace(/"/g, "").replace(/\\n/g, "\n");
    adminAppInstance = initializeApp({
      credential: cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
    return adminAppInstance;
  } catch (error) {
    initError = error;
    throw error;
  }
};

export const getAdminAuth = () => getAuth(getFirebaseAdminApp());
export const getAdminDb = () => getFirestore(getFirebaseAdminApp());

export const getInitError = () => initError;
