# ProjectKepler ML API - Backend

Clean and modular FastAPI backend for ProjectKepler ML operations with custom model support.

## Setup

### Quick Start

**Linux/Mac:**

```bash
./start.sh
```

**Windows:**

```cmd
start.bat
```

### Manual Setup

1. **Create virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate.bat  # Windows
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Configure environment:**

```bash
cp .env.example .env
# Edit .env with your Firebase config
```

4. **Run server:**

```bash
uvicorn main:app --reload
```

## Configuration

Edit `.env` file:

```bash
# Your Firebase config (copy from Firebase console)
FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"..."}

# Your model file
MODEL_PATH=model.pt

# Allowed origins for CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health check
- `GET /model-status` - Check if model is loaded
- `POST /validate-key` - Validate API key
- `GET /check-origin` - Check if origin is allowed
- `POST /predict` - Make prediction (requires API key)

## Usage Examples

### Validate API Key

```bash
curl -X POST http://localhost:8000/validate-key \
  -H "Authorization: Bearer pk_your_api_key"
```

### Make Prediction

```bash
curl -X POST http://localhost:8000/predict \
  -H "Authorization: Bearer pk_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"data": "your_data"}'
```

## Testing

Run the test script:

```bash
python test_simple.py
```

## Model Integration

1. Place your model file in the backend directory
2. Update `MODEL_PATH` in `.env`
3. Modify `model.py` to load your specific model type

## Files Structure

```
python-backend/
├── main.py              # Main FastAPI app
├── model.py             # Model loading logic
├── firebase_client.py   # Firebase integration
├── requirements.txt     # Dependencies
├── .env.example         # Environment template
├── start.sh            # Linux/Mac startup
├── start.bat           # Windows startup
└── test_simple.py      # Simple tests
```

## Notes

- No model included - you need to add your own
- Firebase config goes in `.env` as JSON
- API key validation connects to your Firestore
- CORS configured for web access
- Simple and clean - no unnecessary complexity
