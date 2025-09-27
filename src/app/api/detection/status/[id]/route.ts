import { NextResponse } from "next/server";
import { authAdmin, firestoreAdmin } from "@/lib/firebaseAdmin";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Authorization header with Bearer token is required" }, 
        { status: 401 }
      );
    }

    // Verify the token
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
    const { id: detectionId } = await params;

    // Get detection from Firestore
    const detectionDoc = await firestoreAdmin.collection('detections').doc(detectionId).get();

    if (!detectionDoc.exists) {
      return NextResponse.json(
        { error: "Detection not found" },
        { status: 404 }
      );
    }

    const detectionData = detectionDoc.data();

    // Check if user owns this detection
    if (detectionData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to detection" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      detection: detectionData
    });

  } catch (error) {
    console.error("Detection status check error:", error);
    return NextResponse.json(
      { 
        error: "Failed to check detection status", 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}