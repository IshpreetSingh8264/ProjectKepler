# ProjectKepler ML API Backend

This is the Python FastAPI backend for ProjectKepler that provides machine learning capabilities using YOLO models with Firebase and API key authentication.

## Features

- 🤖 **YOLO Object Detection**: Image and video object detection using Ultralytics YOLO
- 🔐 **Dual Authentication**: Supports both Firebase JWT tokens and API keys
- 🚀 **FastAPI**: High-performance API with automatic documentation
- 📊 **Real-time Processing**: Efficient image and video analysis
- 🛡️ **Security**: Rate limiting and input validation
- 📚 **API Documentation**: Automatic OpenAPI/Swagger documentation

## Quick Start

### 1. Setup Environment

```bash
# Navigate to the backend directory
cd python-backend

# Run the startup script (recommended)
./start.sh
```

Or manually:

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Access the API

- **API Base URL**: http://localhost:8000
- **Interactive Documentation**: http://localhost:8000/docs
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Authentication

The API supports two authentication methods:

### 1. Firebase JWT Token

Use the Firebase ID token from your frontend authentication:

```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_JWT_TOKEN" \
     http://localhost:8000/api/v1/user/info
```

### 2. API Key

Use an API key generated from the frontend:

```bash
curl -H "Authorization: Bearer pk_your_api_key_here" \
     http://localhost:8000/api/v1/user/info
```

## API Endpoints

### Authentication Endpoints

- `GET /api/v1/user/info` - Get authenticated user information

### ML Endpoints

- `POST /api/v1/image/predict` - Analyze objects in an image
- `POST /api/v1/video/analyze` - Analyze objects in a video

### System Endpoints

- `GET /` - Health check and system status
- `GET /docs` - Interactive API documentation

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=projectkepler-cd680
FIREBASE_WEB_API_KEY=your_firebase_web_api_key_here

# Development Mode (set to true for simplified auth during development)
DEVELOPMENT_MODE=true

# API Configuration
API_VERSION=v1
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/jpg
ALLOWED_VIDEO_TYPES=video/mp4,video/avi,video/mov

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Origins (comma-separated list)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Model Configuration
MODEL_PATH=yolov8n.pt
```

## Development vs Production

### Development Mode (`DEVELOPMENT_MODE=true`)

- Simplified authentication that accepts any properly formatted token
- Useful for testing and development
- Less secure, do not use in production

### Production Mode (`DEVELOPMENT_MODE=false`)

- Full Firebase authentication verification
- Requires proper Firebase configuration
- Secure API key validation with Firestore

## Usage Examples

### Image Analysis

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg" \
  http://localhost:8000/api/v1/image/predict
```

### Video Analysis

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@video.mp4" \
  http://localhost:8000/api/v1/video/analyze
```

## Error Handling

The API returns structured error responses:

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

Common status codes:

- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (authentication failed)
- `403`: Forbidden (insufficient permissions)
- `422`: Validation Error (invalid file format)
- `500`: Internal Server Error

## File Support

### Images

- **Formats**: JPEG, PNG, JPG
- **Max Size**: 10MB
- **Processing**: YOLO object detection with bounding boxes

### Videos

- **Formats**: MP4, AVI, MOV
- **Max Size**: 10MB
- **Processing**: Frame-by-frame analysis with aggregated results

## Model Information

- **Default Model**: YOLOv8n (nano) - fast and lightweight
- **Classes**: 80 COCO dataset classes
- **Performance**: Optimized for real-time processing

## Logging

The API includes comprehensive logging:

- Request/response logging
- Authentication events
- ML processing performance
- Error tracking

## Security Features

- Firebase JWT token verification
- API key hashing and validation
- Input file validation
- Rate limiting (configurable)
- CORS protection
- Request size limits

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Check Firebase configuration
   - Verify token format and expiration
   - Ensure DEVELOPMENT_MODE is set correctly

2. **File Upload Issues**

   - Check file size (max 10MB)
   - Verify file format is supported
   - Ensure proper Content-Type headers

3. **Model Loading Issues**
   - Verify MODEL_PATH in .env
   - Check if model file exists
   - Ensure sufficient memory for model loading

### Debug Mode

Enable debug logging by setting the log level:

```python
logging.basicConfig(level=logging.DEBUG)
```

## Development

### Project Structure

```
python-backend/
├── main.py              # FastAPI application
├── auth_simple.py       # Authentication middleware
├── requirements.txt     # Python dependencies
├── .env.example        # Environment template
├── start.sh            # Startup script
└── README.md           # This file
```

### Adding New Endpoints

1. Define the endpoint in `main.py`
2. Add authentication with `Depends(get_auth_dependency())`
3. Include proper error handling and logging
4. Update this README with the new endpoint

### Testing

```bash
# Install test dependencies
pip install pytest httpx

# Run tests (if test files exist)
pytest

# Manual testing with curl
curl -X GET http://localhost:8000/
```

## Production Deployment

For production deployment:

1. Set `DEVELOPMENT_MODE=false`
2. Configure proper Firebase service account
3. Use a production WSGI server (gunicorn)
4. Set up reverse proxy (nginx)
5. Configure SSL certificates
6. Set up monitoring and logging

```bash
# Production server with gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## License

This project is part of ProjectKepler and follows the same license terms.

## Support

For issues and support, please check the main ProjectKepler repository or contact the development team.
