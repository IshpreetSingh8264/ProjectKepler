"""
YOLO Ensemble Model Loader for ProjectKepler
Handles loading and ensemble prediction from multiple YOLO ONNX models
"""

import logging
import os
import numpy as np
import cv2
from typing import List, Dict, Any, Optional, Tuple
import onnxruntime as ort
from pathlib import Path

logger = logging.getLogger(__name__)

class YOLOEnsemble:
    def __init__(self):
        self.models = []
        self.model_paths = []
        self.sessions = []
        self.is_loaded = False
        
    def load_models(self, model_paths: List[str]) -> bool:
        """
        Load multiple YOLO ONNX models for ensemble prediction
        
        Args:
            model_paths: List of paths to ONNX model files
        
        Returns:
            bool: True if at least one model loaded successfully
        """
        self.models.clear()
        self.sessions.clear()
        self.model_paths = model_paths.copy()
        
        loaded_count = 0
        
        for model_path in model_paths:
            try:
                if not os.path.exists(model_path):
                    logger.warning(f"Model file not found: {model_path}")
                    continue
                
                # Create ONNX runtime session
                providers = ['CUDAExecutionProvider', 'CPUExecutionProvider']
                session = ort.InferenceSession(model_path, providers=providers)
                
                self.sessions.append(session)
                logger.info(f"Successfully loaded model: {model_path}")
                loaded_count += 1
                
            except Exception as e:
                logger.error(f"Failed to load model {model_path}: {str(e)}")
                continue
        
        self.is_loaded = loaded_count > 0
        logger.info(f"Loaded {loaded_count}/{len(model_paths)} models successfully")
        
        return self.is_loaded
    
    def preprocess_image(self, image: np.ndarray, input_size: Tuple[int, int] = (640, 640)) -> np.ndarray:
        """
        Preprocess image for YOLO model input
        
        Args:
            image: Input image as numpy array
            input_size: Target input size (width, height)
        
        Returns:
            Preprocessed image tensor
        """
        # Resize image while maintaining aspect ratio
        h, w = image.shape[:2]
        r = min(input_size[0] / w, input_size[1] / h)
        new_w, new_h = int(w * r), int(h * r)
        
        resized = cv2.resize(image, (new_w, new_h))
        
        # Create padded image
        padded = np.full((input_size[1], input_size[0], 3), 114, dtype=np.uint8)
        padded[:new_h, :new_w] = resized
        
        # Convert to float and normalize
        padded = padded.astype(np.float32) / 255.0
        
        # HWC to CHW
        padded = np.transpose(padded, (2, 0, 1))
        
        # Add batch dimension
        return np.expand_dims(padded, axis=0)
    
    def postprocess_detections(self, outputs: List[np.ndarray], conf_threshold: float = 0.5, 
                             nms_threshold: float = 0.4) -> List[Dict]:
        """
        Post-process YOLO model outputs and apply NMS
        
        Args:
            outputs: List of model outputs from ensemble
            conf_threshold: Confidence threshold for filtering detections
            nms_threshold: NMS threshold for removing duplicate detections
        
        Returns:
            List of detection dictionaries
        """
        all_detections = []
        
        for output in outputs:
            # Assuming YOLO output format: [batch, 84, 8400] or similar
            # Where 84 = 4 (bbox) + 80 (classes) for COCO dataset
            if len(output.shape) == 3:
                output = output[0]  # Remove batch dimension
            
            if output.shape[0] > output.shape[1]:
                output = output.T  # Transpose if needed
            
            # Extract boxes, scores, and class predictions
            boxes = output[:, :4]  # x, y, w, h
            scores = np.max(output[:, 4:], axis=1)
            class_ids = np.argmax(output[:, 4:], axis=1)
            
            # Filter by confidence
            valid_indices = scores > conf_threshold
            boxes = boxes[valid_indices]
            scores = scores[valid_indices]
            class_ids = class_ids[valid_indices]
            
            # Convert to detection format
            for box, score, class_id in zip(boxes, scores, class_ids):
                all_detections.append({
                    'bbox': box.tolist(),
                    'confidence': float(score),
                    'class_id': int(class_id),
                    'class_name': f'class_{class_id}'  # You can map this to actual class names
                })
        
        # Apply NMS across all detections
        if all_detections:
            # Simple NMS implementation (you might want to use cv2.dnn.NMSBoxes for better performance)
            final_detections = self._apply_nms(all_detections, nms_threshold)
        else:
            final_detections = []
        
        return final_detections
    
    def _apply_nms(self, detections: List[Dict], nms_threshold: float) -> List[Dict]:
        """Apply Non-Maximum Suppression to detections"""
        if not detections:
            return []
        
        # Convert to format suitable for OpenCV NMS
        boxes = []
        confidences = []
        
        for det in detections:
            x, y, w, h = det['bbox']
            # Convert center format to corner format if needed
            boxes.append([x - w/2, y - h/2, w, h])
            confidences.append(det['confidence'])
        
        boxes = np.array(boxes)
        confidences = np.array(confidences)
        
        # Apply NMS
        indices = cv2.dnn.NMSBoxes(boxes.tolist(), confidences.tolist(), 0.5, nms_threshold)
        
        if len(indices) > 0:
            indices = indices.flatten()
            return [detections[i] for i in indices]
        
        return []
    
    def predict(self, image: np.ndarray, conf_threshold: float = 0.5, 
                nms_threshold: float = 0.4) -> List[Dict]:
        """
        Run ensemble prediction on input image
        
        Args:
            image: Input image as numpy array
            conf_threshold: Confidence threshold for detections
            nms_threshold: NMS threshold
        
        Returns:
            List of detection results
        """
        if not self.is_loaded:
            raise ValueError("No models loaded. Call load_models() first.")
        
        # Preprocess image
        input_tensor = self.preprocess_image(image)
        
        # Run inference on all models
        all_outputs = []
        for session in self.sessions:
            try:
                # Get input/output names
                input_name = session.get_inputs()[0].name
                output_names = [output.name for output in session.get_outputs()]
                
                # Run inference
                outputs = session.run(output_names, {input_name: input_tensor})
                all_outputs.extend(outputs)
                
            except Exception as e:
                logger.error(f"Inference failed for one model: {str(e)}")
                continue
        
        # Post-process and ensemble results
        detections = self.postprocess_detections(all_outputs, conf_threshold, nms_threshold)
        
        return detections

# Global ensemble instance
_yolo_ensemble = YOLOEnsemble()

# Model paths - EDIT THESE TO POINT TO YOUR ONNX MODELS
MODEL_PATHS = [
    "models/astronaut_bunk.onnx",  # Replace with your first model path
    "models/fire_stuff.onnx",  # Replace with your second model path
    "models/oxygen_mask.onnx",  # Add more models as needed
    "models/space_suit.onnx",  # Add more models as needed
    "models/oxygen_tank.onnx",  # Add more models as needed
]

def load_yolo_ensemble() -> bool:
    """
    Load the YOLO ensemble models
    
    Returns:
        bool: True if models loaded successfully
    """
    global _yolo_ensemble
    
    # Filter existing model paths
    existing_paths = [path for path in MODEL_PATHS if os.path.exists(path)]
    
    if not existing_paths:
        logger.warning("No YOLO model files found. Please check MODEL_PATHS in model_loader.py")
        return False
    
    return _yolo_ensemble.load_models(existing_paths)

def predict_yolo_ensemble(image: np.ndarray, conf_threshold: float = 0.5, 
                         nms_threshold: float = 0.4) -> List[Dict]:
    """
    Make prediction using YOLO ensemble
    
    Args:
        image: Input image as numpy array
        conf_threshold: Confidence threshold
        nms_threshold: NMS threshold
    
    Returns:
        List of detection results
    """
    return _yolo_ensemble.predict(image, conf_threshold, nms_threshold)

def get_ensemble_status() -> Dict[str, Any]:
    """
    Get status of the ensemble model
    
    Returns:
        Dictionary with status information
    """
    return {
        "loaded": _yolo_ensemble.is_loaded,
        "model_count": len(_yolo_ensemble.sessions),
        "model_paths": _yolo_ensemble.model_paths
    }