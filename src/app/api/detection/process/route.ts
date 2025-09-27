import { NextResponse } from "next/server";
import { authAdmin, firestoreAdmin } from "@/lib/firebaseAdmin"; 
import { uploadFileToStorage } from "@/lib/storage";

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

    // Parse the request body
    const body = await req.json();
    const { 
      imageUrl, 
      imageFile, 
      confidence = 0.5, 
      iouThreshold = 0.45, 
      modelVariant = 'yolov8n',
      targetObjects = ['Fire Extinguisher', 'Space Suit', 'Oxygen Cylinder']
    } = body;

    let finalImageUrl = imageUrl;

    // If image file is provided, upload it to Firebase Storage first
    if (imageFile && !imageUrl) {
      try {
        // Convert base64 to file if needed
        const timestamp = Date.now();
        const storagePath = `detection-images/${userId}/${timestamp}_detection.jpg`;
        
        // For now, assume imageFile is already a proper file or URL
        // In production, you might need to handle base64 conversion
        if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
          // Handle base64 data URL
          const base64Data = imageFile.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const file = new File([buffer], 'detection-image.jpg', { type: 'image/jpeg' });
          finalImageUrl = await uploadFileToStorage(file, storagePath);
        }
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json(
          { error: "Failed to upload image to storage" },
          { status: 500 }
        );
      }
    }

    if (!finalImageUrl) {
      return NextResponse.json(
        { error: "No image URL or file provided" }, 
        { status: 400 }
      );
    }

    // Create detection job record in Firestore
    const detectionId = `detection_${userId}_${Date.now()}`;
    const detectionData = {
      id: detectionId,
      userId,
      imageUrl: finalImageUrl,
      parameters: {
        confidence,
        iouThreshold,
        modelVariant,
        targetObjects
      },
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    await firestoreAdmin.collection('detections').doc(detectionId).set(detectionData);

    console.log('Detection job created:', {
      detectionId,
      userId,
      imageUrl: finalImageUrl,
      parameters: { confidence, iouThreshold, modelVariant, targetObjects }
    });

    // Prepare data for Python backend (when it's ready)
    const pythonBackendPayload = {
      detectionId,
      imageUrl: finalImageUrl,
      confidence,
      iouThreshold,
      modelVariant,
      targetObjects,
      userId
    };

    // For now, simulate processing and return mock results
    // TODO: Replace this with actual Python backend call when ready
    setTimeout(async () => {
      try {
        // Simulate processing results
        const mockResults = [
          {
            name: 'Fire Extinguisher',
            confidence: 95.8,
            bbox: [100, 100, 200, 300],
            color: 'red'
          },
          {
            name: 'Space Suit',
            confidence: 87.3,
            bbox: [300, 50, 150, 400],
            color: 'cyan'
          },
          {
            name: 'Oxygen Cylinder',
            confidence: 92.1,
            bbox: [500, 200, 100, 250],
            color: 'green'
          }
        ].filter(result => 
          targetObjects.includes(result.name) && result.confidence >= (confidence * 100)
        );

        // Update Firestore with results
        await firestoreAdmin.collection('detections').doc(detectionId).update({
          status: 'completed',
          results: mockResults,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        console.log('Detection completed:', detectionId);
      } catch (error) {
        console.error('Error updating detection results:', error);
        // Update status to failed
        await firestoreAdmin.collection('detections').doc(detectionId).update({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          updatedAt: new Date().toISOString()
        });
      }
    }, 3000); // Simulate 3 second processing time

    // Return immediate response with detection ID for polling
    return NextResponse.json({
      success: true,
      detectionId,
      status: 'processing',
      message: 'Detection started successfully',
      imageUrl: finalImageUrl,
      parameters: {
        confidence,
        iouThreshold,
        modelVariant,
        targetObjects
      },
      // Include Python backend payload for debugging
      pythonBackendPayload
    });

  } catch (error) {
    console.error("Detection processing error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process detection", 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}