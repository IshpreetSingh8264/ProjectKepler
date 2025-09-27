'use client';

import { useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaCode, 
  FaKey, 
  FaUpload, 
  FaImage, 
  FaVideo, 
  FaBrain,
  FaCopy,
  FaCheck,
  FaExternalLinkAlt,
  FaServer,
  FaShieldAlt,
  FaChartBar
} from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar, LazyWrapper, LoadingSpinner } from '@/components/common';
import { useAuth } from '@/lib/authContext';

// Lazy load ApiKeysManager
const ApiKeysManager = lazy(() => import('@/components/modals/ApiKeysManager'));

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, title }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-blue-500/20">
      {title && (
        <div className="bg-slate-800 px-4 py-2 text-sm text-gray-300 font-medium border-b border-blue-500/20">
          {title}
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className={`language-${language} text-slate-200`}>{code}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          {copied ? (
            <FaCheck className="h-4 w-4 text-green-400" />
          ) : (
            <FaCopy className="h-4 w-4 text-slate-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default function DeveloperPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: FaCode },
    { id: 'authentication', label: 'Authentication', icon: FaShieldAlt },
    { id: 'endpoints', label: 'API Endpoints', icon: FaServer },
    { id: 'examples', label: 'Code Examples', icon: FaBrain },
    { id: 'keys', label: 'API Keys', icon: FaKey },
  ];

  const endpoints = [
    {
      method: 'POST',
      path: '/api/upload',
      description: 'Upload files to Firebase Storage',
      auth: true,
      params: [
        { name: 'file', type: 'File', required: true, description: 'File to upload (max 100MB)' },
        { name: 'folder', type: 'string', required: false, description: 'Storage folder (default: uploads)' }
      ],
      response: {
        success: true,
        downloadURL: 'https://storage.googleapis.com/...',
        storagePath: 'uploads/user123/...',
        fileName: 'example.jpg',
        fileSize: 1024,
        fileType: 'image/jpeg',
        folder: 'uploads',
        userId: 'user123',
        uploadedAt: '2024-01-01T00:00:00.000Z'
      }
    },
    {
      method: 'POST',
      path: '/api/image/process',
      description: 'Upload and process images',
      auth: false,
      params: [
        { name: 'file', type: 'File', required: true, description: 'Image file to process' },
        { name: 'userId', type: 'string', required: false, description: 'User ID (optional)' }
      ],
      response: {
        success: true,
        downloadURL: 'https://storage.googleapis.com/...',
        storagePath: 'images/user123/...',
        fileName: 'image.jpg',
        fileSize: 2048,
        fileType: 'image/jpeg',
        userId: 'user123',
        uploadedAt: '2024-01-01T00:00:00.000Z'
      }
    },
    {
      method: 'POST',
      path: '/api/video/process',
      description: 'Upload and process videos',
      auth: true,
      params: [
        { name: 'file', type: 'File', required: true, description: 'Video file to process (max 50MB)' }
      ],
      response: {
        success: true,
        downloadURL: 'https://storage.googleapis.com/...',
        storagePath: 'videos/user123/...',
        fileName: 'video.mp4',
        fileSize: 10485760,
        fileType: 'video/mp4',
        userId: 'user123',
        uploadedAt: '2024-01-01T00:00:00.000Z'
      }
    },
    {
      method: 'POST',
      path: '/api/yolo',
      description: 'YOLO object detection on images',
      auth: true,
      params: [
        { name: 'imageUrl', type: 'string', required: true, description: 'URL of the image to analyze' }
      ],
      response: {
        detections: [
          {
            class: 'person',
            confidence: 0.95,
            bbox: [100, 200, 300, 400]
          }
        ],
        processing_time: 1.2,
        image_url: 'https://storage.googleapis.com/...'
      }
    },
    {
      method: 'POST',
      path: '/api/model/predict',
      description: 'Generic model prediction endpoint',
      auth: true,
      params: [
        { name: 'imageUrl', type: 'string', required: true, description: 'URL of the image to analyze' },
        { name: 'modelType', type: 'string', required: false, description: 'Model type (default: yolo)' }
      ],
      response: {
        prediction: 'Model prediction result',
        model_type: 'yolo',
        processing_time: 1.5,
        confidence: 0.89
      }
    }
  ];

  const codeExamples = {
    javascript: `// Upload file example
const uploadFile = async (file, authToken) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'images');

  const response = await fetch('${baseUrl}/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${authToken}\`
    },
    body: formData
  });

  return await response.json();
};

// YOLO detection example
const detectObjects = async (imageUrl, authToken) => {
  const response = await fetch('${baseUrl}/api/yolo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${authToken}\`
    },
    body: JSON.stringify({ imageUrl })
  });

  return await response.json();
};`,

    python: `import requests

# Upload file example
def upload_file(file_path, auth_token, folder="uploads"):
    with open(file_path, 'rb') as f:
        files = {'file': f}
        data = {'folder': folder}
        headers = {'Authorization': f'Bearer {auth_token}'}
        
        response = requests.post(
            '${baseUrl}/api/upload',
            files=files,
            data=data,
            headers=headers
        )
        
    return response.json()

# YOLO detection example
def detect_objects(image_url, auth_token):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {auth_token}'
    }
    data = {'imageUrl': image_url}
    
    response = requests.post(
        '${baseUrl}/api/yolo',
        json=data,
        headers=headers
    )
    
    return response.json()`,

    curl: `# Upload file
curl -X POST "${baseUrl}/api/upload" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -F "file=@/path/to/your/file.jpg" \\
  -F "folder=images"

# YOLO object detection
curl -X POST "${baseUrl}/api/yolo" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"imageUrl": "https://storage.googleapis.com/your-image-url"}'

# Generic model prediction
curl -X POST "${baseUrl}/api/model/predict" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "imageUrl": "https://storage.googleapis.com/your-image-url",
    "modelType": "yolo"
  }'`
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaCode className="h-5 w-5 text-blue-400" />
                  ProjectKepler API Overview
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Welcome to the ProjectKepler Developer API. Our platform provides powerful AI-driven image and video processing capabilities through a RESTful API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Key Features</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-center gap-2">
                        <FaUpload className="h-4 w-4 text-green-400" />
                        File upload to Firebase Storage
                      </li>
                      <li className="flex items-center gap-2">
                        <FaImage className="h-4 w-4 text-blue-400" />
                        Image processing and analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <FaVideo className="h-4 w-4 text-purple-400" />
                        Video processing capabilities
                      </li>
                      <li className="flex items-center gap-2">
                        <FaBrain className="h-4 w-4 text-orange-400" />
                        YOLO object detection
                      </li>
                      <li className="flex items-center gap-2">
                        <FaShieldAlt className="h-4 w-4 text-red-400" />
                        Secure authentication
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Base Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Base URL:</span>
                        <span className="text-blue-400 font-mono">{baseUrl}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">API Version:</span>
                        <span className="text-slate-300">v1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Content Type:</span>
                        <span className="text-slate-300">application/json, multipart/form-data</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rate Limits:</span>
                        <span className="text-slate-300">100 requests/minute</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Start</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="text-white font-medium">Create an Account</h4>
                      <p className="text-slate-400 text-sm">Sign up for ProjectKepler to get started</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="text-white font-medium">Generate API Key</h4>
                      <p className="text-slate-400 text-sm">Create your API key from the API Keys section</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="text-white font-medium">Make Your First Request</h4>
                      <p className="text-slate-400 text-sm">Start using our API endpoints with your authentication token</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaShieldAlt className="h-5 w-5 text-red-400" />
                  Authentication
                </CardTitle>
                <CardDescription className="text-slate-300">
                  ProjectKepler API uses Firebase Authentication with Bearer tokens for secure access.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Getting Your Token</h3>
                  <p className="text-slate-300 mb-4">
                    Authentication tokens are obtained through Firebase Auth. When you sign in to your account, 
                    you receive an ID token that serves as your API authentication.
                  </p>
                  <CodeBlock
                    language="javascript"
                    title="Get Authentication Token (JavaScript)"
                    code={`import { auth } from './firebaseConfig';
import { getIdToken } from 'firebase/auth';

const getAuthToken = async () => {
  if (auth.currentUser) {
    const token = await getIdToken(auth.currentUser);
    return token;
  }
  throw new Error('User not authenticated');
};`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Using the Token</h3>
                  <p className="text-slate-300 mb-4">
                    Include the token in the Authorization header of your requests:
                  </p>
                  <CodeBlock
                    language="http"
                    title="Authorization Header"
                    code={`Authorization: Bearer YOUR_FIREBASE_ID_TOKEN`}
                  />
                </div>

                <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaShieldAlt className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400 font-medium">Security Notes</span>
                  </div>
                  <ul className="text-amber-200 text-sm space-y-1">
                    <li>• Tokens expire after 1 hour and need to be refreshed</li>
                    <li>• Never expose your tokens in client-side code or logs</li>
                    <li>• Use HTTPS for all API requests</li>
                    <li>• Tokens are tied to your Firebase user account</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'endpoints':
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaServer className="h-5 w-5 text-green-400" />
                  API Endpoints
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Complete reference for all available API endpoints
                </CardDescription>
              </CardHeader>
            </Card>

            {endpoints.map((endpoint, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${ 
                        endpoint.method === 'POST' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-blue-400 font-mono">{endpoint.path}</code>
                    </CardTitle>
                    {endpoint.auth && (
                      <div className="flex items-center gap-1 text-red-400 text-xs">
                        <FaShieldAlt className="h-3 w-3" />
                        <span>Auth Required</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-slate-300">
                    {endpoint.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left text-slate-300 p-2">Name</th>
                            <th className="text-left text-slate-300 p-2">Type</th>
                            <th className="text-left text-slate-300 p-2">Required</th>
                            <th className="text-left text-slate-300 p-2">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.params.map((param, pidx) => (
                            <tr key={pidx} className="border-b border-slate-800">
                              <td className="p-2 text-blue-400 font-mono">{param.name}</td>
                              <td className="p-2 text-slate-300">{param.type}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  param.required ? 'bg-red-900 text-red-200' : 'bg-slate-700 text-slate-300'
                                }`}>
                                  {param.required ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="p-2 text-slate-300">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Response Example</h4>
                    <CodeBlock
                      language="json"
                      code={JSON.stringify(endpoint.response, null, 2)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaBrain className="h-5 w-5 text-orange-400" />
                  Code Examples
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Ready-to-use code examples in multiple programming languages
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">JavaScript / TypeScript</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    language="javascript"
                    code={codeExamples.javascript}
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Python</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    language="python"
                    code={codeExamples.python}
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">cURL</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    language="bash"
                    code={codeExamples.curl}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'keys':
        return (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaKey className="h-5 w-5 text-orange-400" />
                  API Key Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Manage your API keys for accessing ProjectKepler services
                </CardDescription>
              </CardHeader>
            </Card>

            {user ? (
              <LazyWrapper>
                <Suspense fallback={<LoadingSpinner message="Loading API management..." />}>
                  <ApiKeysManager />
                </Suspense>
              </LazyWrapper>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="py-12">
                  <div className="mx-auto mb-6 p-4 rounded-full bg-gradient-to-r from-red-600 to-orange-600 w-20 h-20 flex items-center justify-center">
                    <FaKey className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Authentication Required</h3>
                  <p className="text-slate-300 text-lg max-w-md mx-auto mb-6">
                    Please sign in to your account to view and manage your API keys.
                  </p>
                  <Button 
                    onClick={() => router.push('/signin')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                  >
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen space-station-bg relative overflow-hidden">
      {/* Space Grid Background */}
      <div className="absolute inset-0 space-grid opacity-20"></div>
      
      <Navbar onProfileClick={handleProfileClick} />
      
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="space-gradient-primary p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 space-glow"
            >
              <FaCode className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl sm:text-6xl font-bold text-white mb-6"
            >
              <span className="block text-2xl md:text-3xl text-gray-400 font-normal mb-2">
                CONTROL MODULE
              </span>
              Mission Control{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent space-text-glow">
                API
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed"
            >
              Advanced API interface for space station object detection systems. 
              Access powerful AI models for critical safety equipment identification and real-time analysis capabilities.
              <br />
              <span className="text-sm text-cyan-400/60 italic mt-3 block">
                "Code is poetry, APIs are the verses..." 
                <span className="text-xs text-gray-600 ml-2">// There are only 10 types of people in this universe</span>
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button 
                onClick={() => setActiveSection('examples')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
              >
                <FaCode className="mr-2 h-4 w-4" />
                View Examples
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(`${baseUrl}/api/status`, '_blank')}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <FaExternalLinkAlt className="mr-2 h-4 w-4" />
                API Status
              </Button>
            </motion.div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Navigation Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:w-64 flex-shrink-0"
            >
              <Card className="bg-slate-800/50 border-slate-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex-1"
            >
              {renderSection()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}