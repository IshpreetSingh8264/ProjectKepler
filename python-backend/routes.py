"""
Routes for ProjectKepler ML API
All API routes are declared here - functionality is in functions.py
"""

from fastapi import FastAPI
from functions import (
    root_function,
    health_check_function,
    model_status_function,
    predict_function,
    image_predict_function,
    video_analyze_function,
    yolo_ensemble_predict_function
)

def setup_routes(app: FastAPI):
    """Set up all API routes"""
    
    # Root routes
    app.get("/")(root_function)
    app.get("/health")(health_check_function)
    
    # Model routes
    app.get("/model/status")(model_status_function)
    app.post("/model/predict")(predict_function)
    
    # API v1 routes
    app.post("/api/v1/image/predict")(image_predict_function)
    app.post("/api/v1/video/analyze")(video_analyze_function)
    app.post("/api/v1/yolo/predict")(yolo_ensemble_predict_function)
    
    return app