import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./secrets/serviceAccountKey.json";
  // Make sure serviceAccountPath points to a valid service account JSON
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const authAdmin = admin.auth();
export const firestoreAdmin = admin.firestore();
