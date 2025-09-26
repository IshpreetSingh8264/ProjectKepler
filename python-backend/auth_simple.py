import os
import hashlib
import httpx
import json
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

class AuthResult:
    """Result of authentication containing user info"""
    def __init__(self, user_id: str, auth_type: str, api_key_id: Optional[str] = None):
        self.user_id = user_id
        self.auth_type = auth_type  # 'firebase_jwt' or 'api_key'
        self.api_key_id = api_key_id

async def hash_api_key(api_key: str) -> str:
    """Hash API key using SHA-256 (same as frontend)"""
    return hashlib.sha256(api_key.encode()).hexdigest()

async def verify_firebase_token_with_rest(token: str) -> str:
    """Verify Firebase JWT token using Firebase REST API"""
    try:
        project_id = os.getenv('FIREBASE_PROJECT_ID', 'projectkepler-cd680')
        api_key = os.getenv('FIREBASE_WEB_API_KEY')  # This is the web API key, not service account
        
        if not api_key:
            # For development, we can try to extract from the token or use a simpler method
            # In production, you should have the Firebase web API key
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Firebase configuration incomplete"
            )
        
        # Verify token using Firebase Auth REST API
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={api_key}"
        headers = {'Content-Type': 'application/json'}
        data = {'idToken': token}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            
            if response.status_code == 200:
                result = response.json()
                if 'users' in result and result['users']:
                    return result['users'][0]['localId']  # This is the Firebase UID
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid Firebase token"
                    )
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Firebase token verification failed"
                )
                
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to verify Firebase token - service unavailable"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Firebase token verification failed: {str(e)}"
        )

async def verify_api_key_with_firestore_rest(api_key: str) -> tuple[str, str]:
    """Verify API key using Firestore REST API"""
    try:
        hashed_key = await hash_api_key(api_key)
        project_id = os.getenv('FIREBASE_PROJECT_ID', 'projectkepler-cd680')
        
        # For now, we'll implement a simple mock verification
        # In production, you would query Firestore REST API
        # This is a simplified implementation for development
        
        # Mock implementation - replace with actual Firestore query
        # You would need to implement structured queries to Firestore REST API
        # For now, we'll accept any API key that starts with 'pk_' and has correct format
        
        if not api_key.startswith('pk_') or len(api_key) < 10:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key format"
            )
        
        # In a real implementation, you would:
        # 1. Query Firestore for documents where hashedKey == hashed_key and isActive == true
        # 2. Update usage statistics
        # 3. Return the actual user_id and key_id from the database
        
        # For now, return a mock user_id (you should replace this with actual Firestore query)
        mock_user_id = "mock_user_id"  # Replace with actual user ID from database
        mock_key_id = "mock_key_id"    # Replace with actual key ID from database
        
        return mock_user_id, mock_key_id
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"API key verification failed: {str(e)}"
        )

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
            user_id, key_id = await verify_api_key_with_firestore_rest(token)
            return AuthResult(user_id=user_id, auth_type='api_key', api_key_id=key_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"API key authentication failed: {str(e)}"
            )
    else:
        # Assume it's a Firebase JWT token
        try:
            user_id = await verify_firebase_token_with_rest(token)
            return AuthResult(user_id=user_id, auth_type='firebase_jwt')
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Firebase token authentication failed: {str(e)}"
            )

# Dependency for requiring authentication
async def require_auth(auth_result: AuthResult = Depends(authenticate_request)) -> AuthResult:
    """Dependency that requires valid authentication"""
    return auth_result

# For development/testing - simplified auth that accepts any valid format
async def simple_auth_for_development(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> AuthResult:
    """
    Simplified authentication for development/testing
    Remove this in production!
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    token = credentials.credentials
    
    # Check if it's an API key format
    if token.startswith('pk_') and len(token) >= 10:
        return AuthResult(user_id="dev_user_api", auth_type='api_key', api_key_id="dev_key_id")
    elif len(token) > 50:  # Assume it's a JWT token if it's long enough
        return AuthResult(user_id="dev_user_jwt", auth_type='firebase_jwt')
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format"
        )

# Switch between development and production auth
# Set DEVELOPMENT_MODE=true in environment for simplified auth
def get_auth_dependency():
    """Get the appropriate auth dependency based on environment"""
    if os.getenv('DEVELOPMENT_MODE', 'false').lower() == 'true':
        return simple_auth_for_development
    else:
        return require_auth