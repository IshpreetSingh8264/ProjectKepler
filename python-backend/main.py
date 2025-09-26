from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from typing import Dict, Any
import logging
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our authentication system
from auth_simple import get_auth_dependency, AuthResult

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ProjectKepler ML API",
    description="Machine Learning API with Firebase and API Key authentication",
    version="1.0.0"
)

# Configure CORS to allow requests from your frontend
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model 
model_path = os.getenv("MODEL_PATH", "yolov8n.pt")
try:
    model = YOLO(model_path)
    logger.info(f"YOLO model loaded successfully from {model_path}")
except Exception as e:
    logger.error(f"Failed to load YOLO model: {e}")
    model = None

@app.get("/health")
async def health():
    """Health check endpoint - no authentication required"""
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "model_loaded": model is not None
    }

@app.post("/api/v1/image/predict")
async def predict_image(
    file: UploadFile = File(...),
    auth: AuthResult = Depends(get_auth_dependency())
) -> Dict[str, Any]:
    """
    Predict objects in an uploaded image using YOLO model.
    Requires authentication via Firebase JWT token or API key.
    """
    if not model:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model is not available"
        )
    
    try:
        # Log the request
        logger.info(f"Image prediction request from user {auth.user_id} using {auth.auth_type}")
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read and process the image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file"
            )
        
        # Run YOLO prediction
        results = model(img)
        
        # Return results with metadata
        return {
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": auth.user_id,
            "auth_type": auth.auth_type,
            "api_key_id": auth.api_key_id,
            "filename": file.filename,
            "image_size": {
                "width": img.shape[1],
                "height": img.shape[0]
            },
            "predictions": results[0].tojson()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing image prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing image"
        )

@app.post("/api/v1/video/analyze")
async def analyze_video(
    file: UploadFile = File(...),
    auth: AuthResult = Depends(get_auth_dependency())
) -> Dict[str, Any]:
    """
    Analyze objects in an uploaded video using YOLO model.
    Requires authentication via Firebase JWT token or API key.
    """
    if not model:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model is not available"
        )
    
    try:
        # Log the request
        logger.info(f"Video analysis request from user {auth.user_id} using {auth.auth_type}")
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith('video/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be a video"
            )
        
        # For now, return a placeholder response
        # Video processing is more complex and may require additional setup
        return {
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": auth.user_id,
            "auth_type": auth.auth_type,
            "api_key_id": auth.api_key_id,
            "filename": file.filename,
            "status": "Video analysis feature coming soon",
            "message": "Video processing capabilities will be implemented in the next version"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing video analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing video"
        )

@app.get("/api/v1/user/info")
async def get_user_info(auth: AuthResult = Depends(get_auth_dependency())) -> Dict[str, Any]:
    """
    Get information about the authenticated user.
    Requires authentication via Firebase JWT token or API key.
    """
    return {
        "user_id": auth.user_id,
        "auth_type": auth.auth_type,
        "api_key_id": auth.api_key_id,
        "timestamp": datetime.utcnow().isoformat()
    }

# Legacy endpoint for backward compatibility (deprecated)
@app.post("/predict")
async def predict_legacy(
    file: UploadFile = File(...),
    auth: AuthResult = Depends(get_auth_dependency())
):
    """
    Legacy prediction endpoint - deprecated, use /api/v1/image/predict instead
    """
    logger.warning("Legacy /predict endpoint used - please migrate to /api/v1/image/predict")
    return await predict_image(file, auth)
