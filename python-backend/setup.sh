#!/bin/bash

# Quick setup script for YOLO Ensemble backend
echo "🚀 Setting up YOLO Ensemble backend..."

# Create models directory if it doesn't exist
echo "📁 Creating models directory..."
mkdir -p models

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if models directory is empty
if [ -z "$(ls -A models/)" ]; then
    echo "⚠️  Models directory is empty!"
    echo "🎯 Please add your YOLO ONNX models to the 'models/' directory"
    echo "📝 Then update MODEL_PATHS in model_loader.py to point to your models"
    echo ""
    echo "Example model paths:"
    echo "  - models/yolo_model_1.onnx"
    echo "  - models/yolo_model_2.onnx"
    echo "  - models/yolo_model_3.onnx"
else
    echo "✅ Found models in models/ directory"
fi

echo ""
echo "🔧 Setup complete! Next steps:"
echo "1. Add your YOLO ONNX models to the 'models/' directory"
echo "2. Update MODEL_PATHS in model_loader.py with your model paths"
echo "3. Run: python main.py"
echo ""
echo "📚 API Endpoints:"
echo "  - POST /api/v1/yolo/predict - YOLO ensemble prediction"
echo "  - GET /api/v1/status - Check ensemble status"
echo "  - GET /docs - Interactive API documentation"