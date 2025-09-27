"""
ProjectKepler ML API - Main Application
Clean, modular FastAPI application with custom model support
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our modules
from routes import setup_routes
from model_loader import load_yolo_ensemble

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="ProjectKepler ML API",
    description="Machine Learning API with custom model support",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for localhost:3000 and localhost:3001 only
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up routes
app = setup_routes(app)

# Load custom model on startup
@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("Starting ProjectKepler ML API...")
    
    # Try to load YOLO ensemble
    success = load_yolo_ensemble()
    if success:
        logger.info("✅ Application startup complete - YOLO Ensemble loaded")
    else:
        logger.warning("⚠️ Application started but no YOLO models found")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    logger.info("Shutting down ProjectKepler ML API...")

# Development/testing endpoints
@app.get("/api/v1/status")
async def get_api_status():
    """Get API status and configuration"""
    from model_loader import get_ensemble_status
    
    return {
        "api_version": "1.0.0",
        "environment": "development" if os.getenv('DEVELOPMENT_MODE', 'false').lower() == 'true' else "production",
        "ensemble_status": get_ensemble_status(),
        "cors_origins": ["http://localhost:3000", "http://localhost:3001"]
    }

if __name__ == "__main__":
    import uvicorn
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )