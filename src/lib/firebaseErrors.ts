/**
 * Maps raw Firebase Auth and Firestore error codes/messages to clean, user-understandable notifications.
 */
export function getCleanErrorMessage(error: unknown, fallbackMessage = "An unexpected error occurred. Please try again."): string {
  if (!error) return fallbackMessage;

  const rawMessage = typeof error === "string" ? error : error instanceof Error ? error.message : String(error);
  const errorCode = (error as { code?: string })?.code || "";

  // 1. Direct Firebase Auth Code Mappings
  if (errorCode === "auth/popup-closed-by-user") {
    return "Sign-in popup was closed before completing. Please try again.";
  }
  if (errorCode === "auth/cancelled-popup-request") {
    return "Sign-in request was cancelled. Please try again.";
  }
  if (errorCode === "auth/email-already-in-use") {
    return "An account with this email address already exists. Please log in instead.";
  }
  if (errorCode === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (errorCode === "auth/wrong-password" || errorCode === "auth/invalid-credential") {
    return "Invalid email or password. Please check your details and try again.";
  }
  if (errorCode === "auth/user-not-found") {
    return "No registered account found with this email. Please sign up first.";
  }
  if (errorCode === "auth/weak-password") {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (errorCode === "auth/user-disabled") {
    return "This user account has been deactivated. Please contact support.";
  }
  if (errorCode === "auth/too-many-requests") {
    return "Too many failed attempts. Access temporarily locked for security. Please try again later.";
  }
  if (errorCode === "auth/network-request-failed") {
    return "Network error. Please check your internet connection and try again.";
  }
  if (errorCode === "auth/account-exists-with-different-credential") {
    return "An account already exists with the same email address under a different sign-in method.";
  }
  if (errorCode === "permission-denied") {
    return "Access denied: You do not have permission to perform this action.";
  }

  // 2. Parse Firebase string format e.g. "Firebase: Error (auth/popup-closed-by-user)."
  if (rawMessage.includes("auth/popup-closed-by-user")) {
    return "Sign-in popup was closed before completing. Please try again.";
  }
  if (rawMessage.includes("auth/cancelled-popup-request")) {
    return "Sign-in request was cancelled. Please try again.";
  }
  if (rawMessage.includes("auth/email-already-in-use")) {
    return "An account with this email address already exists. Please log in instead.";
  }
  if (rawMessage.includes("auth/invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (rawMessage.includes("auth/wrong-password") || rawMessage.includes("auth/invalid-credential")) {
    return "Invalid email or password. Please check your details and try again.";
  }
  if (rawMessage.includes("auth/user-not-found")) {
    return "No registered account found with this email. Please sign up first.";
  }
  if (rawMessage.includes("auth/weak-password")) {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (rawMessage.includes("auth/too-many-requests")) {
    return "Too many failed attempts. Access temporarily locked for security. Please try again later.";
  }
  if (rawMessage.includes("auth/network-request-failed")) {
    return "Network error. Please check your internet connection and try again.";
  }
  if (rawMessage.includes("permission-denied") || rawMessage.includes("Missing or insufficient permissions")) {
    return "Permission denied. You do not have access to complete this request.";
  }

  // Strip generic "Firebase: Error (" wrapper if present
  const cleaned = rawMessage.replace(/^Firebase:\s*Error\s*\(([^)]+)\)\.?/i, "$1").trim();
  return cleaned || fallbackMessage;
}
