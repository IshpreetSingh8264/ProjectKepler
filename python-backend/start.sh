#!/bin/bash

# ProjectKepler Python Backend Startup Script

echo "🚀 Starting ProjectKepler ML API Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check for YOLO models
echo "🎯 Checking for YOLO models..."
if [ ! -d "models" ]; then
    echo "📁 Creating models directory..."
    mkdir -p models
fi

# Count ONNX files in models directory
onnx_count=$(find models -name "*.onnx" 2>/dev/null | wc -l)
if [ "$onnx_count" -eq 0 ]; then
    echo "⚠️  No ONNX models found in models/ directory!"
    echo "🎯 Please add your YOLO ONNX models to the 'models/' directory"
    echo "📝 Then update MODEL_PATHS in model_loader.py"
    echo ""
else
    echo "✅ Found $onnx_count ONNX model(s) in models/ directory"
    echo "📋 Available models:"
    find models -name "*.onnx" -exec basename {} \;
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env 2>/dev/null || echo "📝 Please create .env file with your configuration."
fi

# Start the server
echo ""
echo "🔥 Starting FastAPI server with YOLO Ensemble..."
echo "🌐 API will be available at: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🎯 YOLO Endpoint: http://localhost:8000/api/v1/yolo/predict"
echo "📊 Status Check: http://localhost:8000/api/v1/status"
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload