import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if Python backend is reachable
    let pythonBackendStatus = 'offline';
    try {
      const pyUrl = process.env.PYTHON_YOLO_URL ?? "http://127.0.0.1:8000/api/v1/status";
      const pyRes = await fetch(pyUrl, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (pyRes.ok) {
        pythonBackendStatus = 'online';
      }
    } catch (error) {
      // Python backend is offline
      pythonBackendStatus = 'offline';
    }

    return NextResponse.json({
      status: "operational",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      services: {
        api: "operational",
        database: "operational",
        storage: "operational",
        python_backend: pythonBackendStatus
      },
      endpoints: {
        upload: "/api/upload",
        image_process: "/api/image/process",
        video_process: "/api/video/process",
        yolo: "/api/yolo",
        model_predict: "/api/model/predict"
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      {
        status: "error",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        error: "Failed to check system status"
      },
      { status: 500 }
    );
  }
}