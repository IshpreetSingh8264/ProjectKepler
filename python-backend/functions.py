"""
Functions for ProjectKepler ML API
All API functionality is implemented here
"""

from fastapi import HTTPException, UploadFile, File
from typing import Optional
import logging

# Import model loaders
from model_loader import predict_yolo_ensemble, get_ensemble_status
import cv2
import numpy as np

logger = logging.getLogger(__name__)

async def root_function():
    """Health check"""
    return {
        "message": "ProjectKepler ML API",
        "version": "1.0.0",
        "status": "running"
    }

async def health_check_function():
    """Detailed health check"""
    ensemble_status = get_ensemble_status()
    
    return {
        "api": "healthy",
        "yolo_ensemble": ensemble_status,
        "version": "1.0.0"
    }

async def model_status_function():
    """Check if YOLO ensemble is available"""
    ensemble_status = get_ensemble_status()
    
    if ensemble_status["loaded"]:
        return {
            "status": "available",
            "model": "yolo_ensemble",
            "model_count": ensemble_status["model_count"],
            "models": ensemble_status["model_paths"]
        }
    else:
        return {
            "status": "no models found",
            "message": "No YOLO models found or loaded"
        }

async def predict_function(data: dict):
    """
    Generic prediction function - redirects to YOLO ensemble
    """
    ensemble_status = get_ensemble_status()
    if not ensemble_status["loaded"]:
        raise HTTPException(status_code=503, detail="No YOLO ensemble loaded")
    
    return {
        "message": "Use /api/v1/yolo/predict endpoint for image predictions",
        "available_endpoint": "/api/v1/yolo/predict",
        "ensemble_status": ensemble_status,
        "input_data": data
    }

async def image_predict_function(file: UploadFile = File(...)):
    """
    Predict on uploaded image - redirects to YOLO endpoint
    """
    return {
        "message": "This endpoint is deprecated. Use /api/v1/yolo/predict for YOLO ensemble predictions",
        "recommended_endpoint": "/api/v1/yolo/predict",
        "filename": file.filename
    }

async def video_analyze_function(file: UploadFile = File(...)):
    """
    Analyze uploaded video - placeholder for future implementation
    """
    # Validate file type
    if not file.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    # Read file content
    contents = await file.read()
    
    return {
        "message": "Video analysis not yet implemented with YOLO ensemble",
        "filename": file.filename,
        "file_size": len(contents),
        "suggestion": "Consider extracting frames and using /api/v1/yolo/predict on individual frames"
    }

async def yolo_ensemble_predict_function(
    file: UploadFile = File(...),
    conf_threshold: float = 0.5,
    nms_threshold: float = 0.4
):
    """
    YOLO Ensemble prediction on uploaded image
    """
    # Check if ensemble is loaded
    status = get_ensemble_status()
    if not status["loaded"]:
        raise HTTPException(status_code=503, detail="YOLO Ensemble not loaded")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and decode image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Could not decode image")
        
        # Run YOLO ensemble prediction
        detections = predict_yolo_ensemble(image, conf_threshold, nms_threshold)
        
        return {
            "detections": detections,
            "detection_count": len(detections),
            "filename": file.filename,
            "image_shape": image.shape,
            "ensemble_status": status,
            "parameters": {
                "conf_threshold": conf_threshold,
                "nms_threshold": nms_threshold
            }
        }
        
    except Exception as e:
        logger.error(f"YOLO prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")