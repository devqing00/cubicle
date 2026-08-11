import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

export interface AppNotification {
  id?: string;
  userId: string; // Target recipient UID
  title: string;
  message: string;
  type: "booking" | "payment" | "chat" | "reminder" | "system";
  link?: string;
  read: boolean;
  createdAt: string;
}

export async function sendAppNotification({
  userId,
  title,
  message,
  type = "system",
  link = "/dashboard",
}: {
  userId: string;
  title: string;
  message: string;
  type?: "booking" | "payment" | "chat" | "reminder" | "system";
  link?: string;
}) {
  try {
    if (!userId) return;
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}
