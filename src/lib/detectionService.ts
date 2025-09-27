import { auth } from './firebaseClient';

export interface DetectionParameters {
  confidence: number;
  iouThreshold: number;
  modelVariant: string;
  targetObjects: string[];
}

export interface DetectionResult {
  name: string;
  confidence: number;
  bbox: number[];
  color: string;
}

export interface Detection {
  id: string;
  userId: string;
  imageUrl: string;
  parameters: DetectionParameters;
  status: 'processing' | 'completed' | 'failed';
  results?: DetectionResult[];
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

class DetectionService {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  private async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    
    return fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  /**
   * Start a new detection process
   */
  async startDetection(
    imageUrl: string,
    parameters: DetectionParameters
  ): Promise<{ detectionId: string; status: string }> {
    try {
      const response = await this.makeAuthenticatedRequest('/api/detection/process', {
        method: 'POST',
        body: JSON.stringify({
          imageUrl,
          ...parameters
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start detection');
      }

      const data = await response.json();
      return {
        detectionId: data.detectionId,
        status: data.status
      };
    } catch (error) {
      console.error('Start detection error:', error);
      throw error;
    }
  }

  /**
   * Get detection status and results
   */
  async getDetectionStatus(detectionId: string): Promise<Detection> {
    try {
      const response = await this.makeAuthenticatedRequest(`/api/detection/status/${detectionId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get detection status');
      }

      const data = await response.json();
      return data.detection;
    } catch (error) {
      console.error('Get detection status error:', error);
      throw error;
    }
  }

  /**
   * Get user's detection history
   */
  async getDetectionHistory(limit: number = 10, status?: string): Promise<Detection[]> {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (status) {
        params.append('status', status);
      }

      const response = await this.makeAuthenticatedRequest(`/api/detection/history?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get detection history');
      }

      const data = await response.json();
      return data.detections;
    } catch (error) {
      console.error('Get detection history error:', error);
      throw error;
    }
  }

  /**
   * Poll detection status until completion
   */
  async pollDetectionStatus(
    detectionId: string,
    onUpdate?: (detection: Detection) => void,
    maxAttempts: number = 30,
    intervalMs: number = 2000
  ): Promise<Detection> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const poll = async () => {
        try {
          attempts++;
          const detection = await this.getDetectionStatus(detectionId);
          
          onUpdate?.(detection);

          if (detection.status === 'completed' || detection.status === 'failed') {
            resolve(detection);
            return;
          }

          if (attempts >= maxAttempts) {
            reject(new Error('Detection polling timeout'));
            return;
          }

          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Upload image to Firebase Storage
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'detection-images');

      const token = await this.getAuthToken();
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      return data.downloadURL;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }

  /**
   * Process image: upload + detect in one call
   */
  async processImage(
    file: File,
    parameters: DetectionParameters,
    onStatusUpdate?: (detection: Detection) => void
  ): Promise<Detection> {
    try {
      // First upload the image
      const imageUrl = await this.uploadImage(file);
      
      // Start detection
      const { detectionId } = await this.startDetection(imageUrl, parameters);
      
      // Poll for results
      return await this.pollDetectionStatus(detectionId, onStatusUpdate);
    } catch (error) {
      console.error('Process image error:', error);
      throw error;
    }
  }

  /**
   * Process image from URL
   */
  async processImageUrl(
    imageUrl: string,
    parameters: DetectionParameters,
    onStatusUpdate?: (detection: Detection) => void
  ): Promise<Detection> {
    try {
      // Start detection
      const { detectionId } = await this.startDetection(imageUrl, parameters);
      
      // Poll for results
      return await this.pollDetectionStatus(detectionId, onStatusUpdate);
    } catch (error) {
      console.error('Process image URL error:', error);
      throw error;
    }
  }
}

export const detectionService = new DetectionService();