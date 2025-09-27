import { NextResponse } from "next/server";
import { uploadFileToStorage, generateStoragePath } from "@/lib/storage";
import { authAdmin } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Authorization header with Bearer token is required" }, 
        { status: 401 }
      );
    }

    // Extract and verify the token
    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await authAdmin.verifyIdToken(idToken);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" }, 
        { status: 400 }
      );
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 100MB" }, 
        { status: 400 }
      );
    }

    // Generate unique storage path
    const storagePath = generateStoragePath(userId, file.name, folder);
    
    // Upload file to Firebase Storage
    const downloadURL = await uploadFileToStorage(file, storagePath);
    
    // Log the URL as requested
    console.log(`File uploaded to Firebase Storage (${folder}):`, downloadURL);
    
    // Return the storage information
    return NextResponse.json({
      success: true,
      downloadURL,
      storagePath,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      folder,
      userId,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { 
        error: "Failed to upload file", 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}