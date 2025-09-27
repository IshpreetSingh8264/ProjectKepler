import { NextResponse } from "next/server";
import { authAdmin, firestoreAdmin } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
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
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');

    // Build query
    let query = firestoreAdmin.collection('detections')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    // Add status filter if provided
    if (status) {
      query = query.where('status', '==', status);
    }

    const detectionsSnapshot = await query.get();
    const detections = detectionsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      detections,
      count: detections.length
    });

  } catch (error) {
    console.error("Detection history error:", error);
    return NextResponse.json(
      { 
        error: "Failed to get detection history", 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}