import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get authorization header from the incoming request
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" }, 
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" }, 
        { status: 400 }
      );
    }

    const forwardForm = new FormData();
    forwardForm.append("file", file, (file as any).name ?? "upload.jpg");

    // Use the new API endpoint with authentication
    const pyUrl = process.env.PYTHON_YOLO_URL ?? "http://127.0.0.1:8000/api/v1/image/predict";

    const pyRes = await fetch(pyUrl, {
      method: "POST",
      body: forwardForm,
      headers: {
        'Authorization': authHeader, // Forward the authorization header
      },
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
    console.error("YOLO proxy error:", error);
    return NextResponse.json(
      { error: "YOLO proxy error", details: String(error) }, 
      { status: 500 }
    );
  }
}
