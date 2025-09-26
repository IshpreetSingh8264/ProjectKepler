# API Routes Documentation

This document describes the available API routes in the ProjectKepler Next.js application.

## Authentication

All API routes require authentication via Firebase ID token passed in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## File Upload Routes

### POST /api/upload

General file upload endpoint that stores files in Firebase Storage.

**Request:**

- Content-Type: multipart/form-data
- Body: FormData with `file` and optional `folder` fields

**Response:**

```json
{
  "success": true,
  "downloadURL": "https://firebasestorage.googleapis.com/...",
  "storagePath": "uploads/userId/timestamp_randomId_filename.ext",
  "fileName": "original-filename.ext",
  "fileSize": 12345,
  "fileType": "image/jpeg",
  "folder": "uploads",
  "userId": "firebase-user-id",
  "uploadedAt": "2025-09-26T12:00:00.000Z"
}
```

### POST /api/image/process

Specialized endpoint for image uploads to Firebase Storage.

**Request:**

- Content-Type: multipart/form-data
- Body: FormData with `file` field (image files only)

**Response:**

```json
{
  "success": true,
  "downloadURL": "https://firebasestorage.googleapis.com/...",
  "storagePath": "images/userId/timestamp_randomId_filename.jpg",
  "fileName": "image.jpg",
  "fileSize": 12345,
  "fileType": "image/jpeg",
  "userId": "firebase-user-id",
  "uploadedAt": "2025-09-26T12:00:00.000Z"
}
```

**Constraints:**

- File must be an image (type starts with 'image/')
- Maximum file size: 10MB

### POST /api/video/process

Specialized endpoint for video uploads to Firebase Storage.

**Request:**

- Content-Type: multipart/form-data
- Body: FormData with `file` field (video files only)

**Response:**

```json
{
  "success": true,
  "downloadURL": "https://firebasestorage.googleapis.com/...",
  "storagePath": "videos/userId/timestamp_randomId_filename.mp4",
  "fileName": "video.mp4",
  "fileSize": 123456,
  "fileType": "video/mp4",
  "userId": "firebase-user-id",
  "uploadedAt": "2025-09-26T12:00:00.000Z"
}
```

**Constraints:**

- File must be a video (type starts with 'video/')
- Maximum file size: 50MB

## ML Processing Routes

### POST /api/model/predict

General model prediction endpoint that forwards requests to the Python backend.

**Request:**

- Content-Type: application/json
- Body:

```json
{
  "imageUrl": "https://firebasestorage.googleapis.com/...",
  "modelType": "yolo"
}
```

**Response:**
Returns the response from the Python backend ML model.

### POST /api/yolo

YOLO-specific image detection endpoint.

**Request:**

- Content-Type: application/json
- Body:

```json
{
  "imageUrl": "https://firebasestorage.googleapis.com/..."
}
```

**Response:**
Returns YOLO detection results from the Python backend.

## Workflow

### Image Processing Workflow

1. **Upload**: Client uploads image via `/api/image/process`
2. **Storage**: Image is stored in Firebase Storage
3. **URL**: Firebase Storage URL is logged to console
4. **Process**: Use `/api/yolo` or `/api/model/predict` with the Firebase Storage URL
5. **Results**: ML processing results are returned

### Key Features

- All uploads are authenticated via Firebase Auth
- Files are stored in Firebase Storage with organized folder structure
- Unique file paths prevent naming conflicts
- File type and size validation
- Clean separation between file upload and ML processing
- Firebase Storage URLs are logged for debugging

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration
- `PYTHON_YOLO_URL`: Python backend URL (default: http://127.0.0.1:8000/api/v1/image/predict)
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to Firebase service account key

## Error Handling

All routes return standardized error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

Common HTTP status codes:

- 400: Bad Request (missing file, invalid type, etc.)
- 401: Unauthorized (missing or invalid token)
- 500: Internal Server Error
