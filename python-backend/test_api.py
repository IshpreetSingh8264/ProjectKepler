#!/usr/bin/env python3
"""
Test script for ProjectKepler ML API Backend
Run this after starting the server to verify everything is working
"""

import requests
import json
import os
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:8000"
TEST_API_KEY = "pk_test_key_1234567890"  # This will work in development mode
TEST_JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token"  # Mock JWT for development

def test_health_check():
    """Test the health check endpoint"""
    print("🏥 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data.get('message', 'Unknown')}")
            return True
        else:
            print(f"❌ Health check failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_auth_api_key():
    """Test authentication with API key"""
    print("\n🔑 Testing API key authentication...")
    try:
        headers = {"Authorization": f"Bearer {TEST_API_KEY}"}
        response = requests.get(f"{BASE_URL}/api/v1/user/info", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API key auth passed: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ API key auth failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ API key auth error: {e}")
        return False

def test_auth_jwt():
    """Test authentication with JWT token"""
    print("\n🎫 Testing JWT authentication...")
    try:
        headers = {"Authorization": f"Bearer {TEST_JWT_TOKEN}"}
        response = requests.get(f"{BASE_URL}/api/v1/user/info", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ JWT auth passed: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ JWT auth failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ JWT auth error: {e}")
        return False

def test_no_auth():
    """Test endpoint without authentication (should fail)"""
    print("\n🚫 Testing no authentication (should fail)...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/user/info")
        print(f"Status: {response.status_code}")
        if response.status_code == 401:
            print("✅ No auth correctly rejected")
            return True
        else:
            print(f"❌ No auth should have been rejected: {response.text}")
            return False
    except Exception as e:
        print(f"❌ No auth test error: {e}")
        return False

def test_api_docs():
    """Test API documentation endpoints"""
    print("\n📚 Testing API documentation...")
    try:
        # Test OpenAPI schema
        response = requests.get(f"{BASE_URL}/openapi.json")
        if response.status_code == 200:
            print("✅ OpenAPI schema accessible")
        else:
            print(f"❌ OpenAPI schema failed: {response.status_code}")
            return False
            
        # Test docs page
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ API docs page accessible")
            return True
        else:
            print(f"❌ API docs page failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API docs test error: {e}")
        return False

def create_test_image():
    """Create a simple test image for ML testing"""
    try:
        from PIL import Image
        import numpy as np
        
        # Create a simple test image
        img_array = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
        img = Image.fromarray(img_array)
        test_path = Path("test_image.jpg")
        img.save(test_path)
        return test_path
    except ImportError:
        print("⚠️ PIL not available, skipping image creation")
        return None
    except Exception as e:
        print(f"⚠️ Could not create test image: {e}")
        return None

def test_image_prediction():
    """Test image prediction endpoint"""
    print("\n🖼️ Testing image prediction...")
    
    # Try to create a test image
    test_image = create_test_image()
    if not test_image or not test_image.exists():
        print("⚠️ Skipping image test - no test image available")
        return True
    
    try:
        headers = {"Authorization": f"Bearer {TEST_API_KEY}"}
        with open(test_image, 'rb') as f:
            files = {'file': ('test_image.jpg', f, 'image/jpeg')}
            response = requests.post(f"{BASE_URL}/api/v1/image/predict", 
                                   headers=headers, files=files)
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Image prediction passed: Found {len(data.get('predictions', []))} objects")
            
            # Clean up test image
            test_image.unlink()
            return True
        else:
            print(f"❌ Image prediction failed: {response.text}")
            # Clean up test image
            if test_image.exists():
                test_image.unlink()
            return False
    except Exception as e:
        print(f"❌ Image prediction error: {e}")
        # Clean up test image
        if test_image and test_image.exists():
            test_image.unlink()
        return False

def main():
    """Run all tests"""
    print("🧪 ProjectKepler ML API Backend Tests")
    print("=====================================")
    
    tests = [
        ("Health Check", test_health_check),
        ("API Key Auth", test_auth_api_key),
        ("JWT Auth", test_auth_jwt),
        ("No Auth (should fail)", test_no_auth),
        ("API Documentation", test_api_docs),
        ("Image Prediction", test_image_prediction),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🔄 Running: {test_name}")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "="*50)
    print("📊 Test Results Summary")
    print("="*50)
    
    passed = 0
    failed = 0
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed + failed} tests")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All tests passed! Backend is working correctly.")
    else:
        print(f"\n⚠️ {failed} test(s) failed. Check the output above for details.")
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)