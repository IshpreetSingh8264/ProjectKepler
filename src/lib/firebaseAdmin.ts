import admin from "firebase-admin";
import "firebase-admin/storage";
import { existsSync, readFileSync } from "fs";
import path from "path";

if (!admin.apps.length) {
  const options: admin.AppOptions = {};
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (storageBucket) {
    options.storageBucket = storageBucket;
  }

  let credentialsConfigured = false;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (serviceAccountPath) {
    const resolvedPath = path.resolve(serviceAccountPath);
    if (existsSync(resolvedPath)) {
      try {
        const fileContents = readFileSync(resolvedPath, "utf-8");
        const serviceAccount = JSON.parse(fileContents);
        options.credential = admin.credential.cert(serviceAccount);
        if (!options.projectId && serviceAccount.project_id) {
          options.projectId = serviceAccount.project_id;
        }
        credentialsConfigured = true;
      } catch (error) {
        console.error("Firebase Admin: Failed to load service account file", error);
      }
    } else {
      console.warn(`Firebase Admin: Service account file not found at ${resolvedPath}`);
    }
  }

  if (!credentialsConfigured && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      options.credential = admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
      credentialsConfigured = true;
    } catch (error) {
      console.error("Firebase Admin: Failed to configure credentials from environment", error);
    }
  }

  if (!credentialsConfigured) {
    console.warn("Firebase Admin: Credentials not fully configured. Using default application credentials if available.");
  }

  if (!options.projectId) {
    options.projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  }

  admin.initializeApp(options);
}

export const authAdmin = admin.auth();
export const firestoreAdmin = admin.firestore();
export const storageAdmin = admin.storage();
export const storageBucket = admin.storage().bucket();
