import os
import asyncio
import hashlib
from typing import Optional, Union
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import firebase_admin
from firebase_admin import credentials, auth
import json

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK with service account"""
    try:
        # Check if Firebase is already initialized
        firebase_admin.get_app()
    except ValueError:
        # Initialize Firebase Admin SDK
        # You'll need to set up service account credentials
        # For now, we'll use environment variables for Firebase config
        if os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY'):
            # If service account key is provided as JSON string
            service_account_info = json.loads(os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY'))
            cred = credentials.Certificate(service_account_info)
        else:
            # Fallback to default credentials or service account file
            cred = credentials.ApplicationDefault()
        
        firebase_admin.initialize_app(cred)

# Initialize Firebase on startup
initialize_firebase()

security = HTTPBearer()

class AuthenticationError(Exception):
    """Custom exception for authentication errors"""
    pass

class AuthResult:
    """Result of authentication containing user info"""
    def __init__(self, user_id: str, auth_type: str, api_key_id: Optional[str] = None):
        self.user_id = user_id
        self.auth_type = auth_type  # 'firebase_jwt' or 'api_key'
        self.api_key_id = api_key_id

async def hash_api_key(api_key: str) -> str:
    """Hash API key using SHA-256 (same as frontend)"""
    return hashlib.sha256(api_key.encode()).hexdigest()

async def verify_firebase_token(token: str) -> str:
    """Verify Firebase JWT token and return user ID"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        raise AuthenticationError(f"Invalid Firebase token: {str(e)}")

async def verify_api_key_with_firestore(api_key: str) -> tuple[str, str]:
    """
    Verify API key against Firestore database
    Returns (user_id, key_id) if valid
    """
    try:
        # Hash the provided API key
        hashed_key = await hash_api_key(api_key)
        
        # Make request to your Firestore REST API or use Firebase Admin SDK
        # For this example, I'll show both approaches
        
        # Approach 1: Using Firebase Admin SDK (recommended)
        from firebase_admin import firestore
        db = firestore.client()
        
        # Query for API key with matching hash and active status
        api_keys_ref = db.collection('apiKeys')
        query = api_keys_ref.where('hashedKey', '==', hashed_key).where('isActive', '==', True)
        results = query.get()
        
        if not results:
            raise AuthenticationError("Invalid or inactive API key")
        
        # Get the first (should be only) result
        key_doc = results[0]
        key_data = key_doc.to_dict()
        
        # Update usage statistics
        key_doc.reference.update({
            'lastUsed': firestore.SERVER_TIMESTAMP,
            'usageCount': firestore.Increment(1)
        })
        
        return key_data['userId'], key_doc.id
        
    except Exception as e:
        if isinstance(e, AuthenticationError):
            raise
        raise AuthenticationError(f"Error verifying API key: {str(e)}")

async def authenticate_request(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> AuthResult:
    """
    Main authentication function that handles both Firebase JWT and API keys
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    token = credentials.credentials
    
    # Check if it's an API key (starts with 'pk_')
    if token.startswith('pk_'):
        try:
            user_id, key_id = await verify_api_key_with_firestore(token)
            return AuthResult(user_id=user_id, auth_type='api_key', api_key_id=key_id)
        except AuthenticationError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"API key authentication failed: {str(e)}"
            )
    else:
        # Assume it's a Firebase JWT token
        try:
            user_id = await verify_firebase_token(token)
            return AuthResult(user_id=user_id, auth_type='firebase_jwt')
        except AuthenticationError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Firebase token authentication failed: {str(e)}"
            )

# Alternative approach using Firestore REST API (if you prefer not to use Admin SDK)
async def verify_api_key_with_rest_api(api_key: str) -> tuple[str, str]:
    """
    Alternative method using Firestore REST API
    """
    try:
        hashed_key = await hash_api_key(api_key)
        
        # Firestore REST API endpoint
        project_id = os.getenv('FIREBASE_PROJECT_ID')
        if not project_id:
            raise AuthenticationError("Firebase project ID not configured")
        
        # Construct Firestore REST API URL
        base_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents"
        
        # You would need to implement the REST API query here
        # This is more complex and requires proper authentication to Firestore
        # The Admin SDK approach above is recommended
        
        raise NotImplementedError("REST API approach not fully implemented")
        
    except Exception as e:
        raise AuthenticationError(f"Error verifying API key via REST API: {str(e)}")

# Dependency for requiring authentication
async def require_auth(auth_result: AuthResult = Depends(authenticate_request)) -> AuthResult:
    """Dependency that requires valid authentication"""
    return auth_result

# Optional: Dependency for requiring specific auth type
async def require_api_key_auth(auth_result: AuthResult = Depends(authenticate_request)) -> AuthResult:
    """Dependency that requires API key authentication specifically"""
    if auth_result.auth_type != 'api_key':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key authentication required"
        )
    return auth_result

async def require_firebase_auth(auth_result: AuthResult = Depends(authenticate_request)) -> AuthResult:
    """Dependency that requires Firebase JWT authentication specifically"""
    if auth_result.auth_type != 'firebase_jwt':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase JWT authentication required"
        )
    return auth_result