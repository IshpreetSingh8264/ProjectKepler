import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccountPath = "/home/jaiveer/Desktop/KhalsaCollegeHackathon/Kepler/ProjectKepler/secret.json";
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "projectkepler-cd680.appspot.com", // ✅ FIXED
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const providedUserId = formData.get("userId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const userId =
      typeof providedUserId === "string" && providedUserId.trim().length > 0
        ? providedUserId
        : "anonymous";

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const safeOriginalName =
      file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "image";
    const storagePath = `images/${userId}/${timestamp}_${randomId}_${safeOriginalName}`;

    // Get Firebase Storage bucket
    const bucket = admin.storage().bucket();
    const fileRef = bucket.file(storagePath);

    // Upload file
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make file publicly accessible
    await fileRef.makePublic();

    // ✅ Correct public URL
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    console.log("Image uploaded to Firebase Storage:", downloadURL);

    return NextResponse.json({
      success: true,
      downloadURL,
      storagePath,
      fileName: file.name,
      fileSize: buffer.length,
      fileType: file.type,
      userId,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
