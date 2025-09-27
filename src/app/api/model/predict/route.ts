import { NextResponse } from "next/server";
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

    // Verify the token
    const idToken = authHeader.split('Bearer ')[1];
    try {
      await authAdmin.verifyIdToken(idToken);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { imageUrl, modelType = 'yolo' } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" }, 
        { status: 400 }
      );
    }

    console.log(`Processing ${modelType} prediction for image:`, imageUrl);

    // Determine the Python backend endpoint based on model type
    let pyUrl: string;
    switch (modelType.toLowerCase()) {
      case 'yolo':
        pyUrl = process.env.PYTHON_YOLO_URL ?? "http://127.0.0.1:8000/api/v1/image/predict";
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported model type: ${modelType}` },
          { status: 400 }
        );
    }

    // Forward the request to Python backend
    const pyRes = await fetch(pyUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!pyRes.ok) {
      const txt = await pyRes.text();
      let errorMessage = txt;
      
      try {
        const errorJson = JSON.parse(txt);
        errorMessage = errorJson.detail || errorJson.error || txt;
      } catch {
        // Keep original text if not JSON
      }
      
      return NextResponse.json(
        { error: errorMessage }, 
        { status: pyRes.status }
      );
    }

    const result = await pyRes.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Model prediction error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process model prediction", 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
