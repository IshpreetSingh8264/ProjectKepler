@echo off
REM ProjectKepler Python Backend Startup Script for Windows

echo 🚀 Starting ProjectKepler ML API Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Error: Failed to create virtual environment. Make sure Python is installed.
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Error: Failed to activate virtual environment.
    pause
    exit /b 1
)

REM Install/upgrade dependencies
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
)

REM Check for YOLO models
echo 🎯 Checking for YOLO models...
if not exist "models" (
    echo 📁 Creating models directory...
    mkdir models
)

REM Check for ONNX files
dir /b models\*.onnx >nul 2>&1
if errorlevel 1 (
    echo ⚠️  No ONNX models found in models\ directory!
    echo 🎯 Please add your YOLO ONNX models to the 'models\' directory
    echo 📝 Then update MODEL_PATHS in model_loader.py
    echo.
) else (
    echo ✅ Found ONNX models in models\ directory
    echo 📋 Available models:
    dir /b models\*.onnx
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Copying from .env.example...
    if exist ".env.example" (
        copy .env.example .env
    ) else (
        echo 📝 Please create .env file with your configuration.
    )
)

REM Start the server
echo.
echo 🔥 Starting FastAPI server with YOLO Ensemble...
echo 🌐 API will be available at: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo 🎯 YOLO Endpoint: http://localhost:8000/api/v1/yolo/predict
echo 📊 Status Check: http://localhost:8000/api/v1/status
echo Press Ctrl+C to stop the server
echo.

uvicorn main:app --host 0.0.0.0 --port 8000 --reload

REM Keep window open if there's an error
if errorlevel 1 (
    echo.
    echo ❌ Server failed to start. Check the error messages above.
    pause
)