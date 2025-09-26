'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { uploadImageToStorage } from '@/lib/storageClient';

export default function TestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
      setError(null);
    }
  };

  const testUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', 'test-user');

      const response = await fetch('/api/image/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      setUploadResult(result);
      console.log('Upload successful:', result);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">Firebase Storage Upload Test</h1>
        
        <Card className="p-6 mb-6 bg-blue-500/20 border-blue-500/30">
          <p className="text-blue-400">📋 Simple Firebase Storage Upload Test</p>
        </Card>

        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Select Image File:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-white bg-slate-700 border border-slate-600 rounded px-3 py-2"
              />
            </div>

            {selectedFile && (
              <div className="text-slate-300">
                <p>Selected: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Type: {selectedFile.type}</p>
              </div>
            )}

            <Button 
              onClick={testUpload} 
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload to Firebase Storage'}
            </Button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded">
                <p className="text-red-400">Error: {error}</p>
              </div>
            )}

            {uploadResult && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded">
                <h3 className="text-green-400 font-bold mb-2">Upload Successful!</h3>
                <div className="text-slate-300 space-y-1 text-sm">
                  <p><strong>Download URL:</strong> <a href={uploadResult.downloadURL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">{uploadResult.downloadURL}</a></p>
                  <p><strong>Storage Path:</strong> {uploadResult.storagePath}</p>
                  <p><strong>File Size:</strong> {uploadResult.fileSize} bytes</p>
                  <p><strong>Uploaded At:</strong> {uploadResult.uploadedAt}</p>
                </div>
                
                {uploadResult.downloadURL && (
                  <div className="mt-4">
                    <p className="text-white mb-2">Preview:</p>
                    <img 
                      src={uploadResult.downloadURL} 
                      alt="Uploaded image" 
                      className="max-w-full h-auto max-h-64 rounded border border-slate-600"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}