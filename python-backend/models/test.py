import onnx
import onnxruntime as ort
import numpy as np
from PIL import Image
import os
import cv2

def calculate_iou(box1, box2):
    """Calculate Intersection over Union (IoU) of two bounding boxes."""
    x1_min, y1_min, x1_max, y1_max = box1
    x2_min, y2_min, x2_max, y2_max = box2
    
    # Calculate intersection area
    inter_x_min = max(x1_min, x2_min)
    inter_y_min = max(y1_min, y2_min)
    inter_x_max = min(x1_max, x2_max)
    inter_y_max = min(y1_max, y2_max)
    
    if inter_x_max <= inter_x_min or inter_y_max <= inter_y_min:
        return 0.0
    
    inter_area = (inter_x_max - inter_x_min) * (inter_y_max - inter_y_min)
    
    # Calculate union area
    box1_area = (x1_max - x1_min) * (y1_max - y1_min)
    box2_area = (x2_max - x2_min) * (y2_max - y2_min)
    union_area = box1_area + box2_area - inter_area
    
    return inter_area / union_area if union_area > 0 else 0.0

def non_max_suppression(detections, iou_threshold=0.05):
    """Apply AGGRESSIVE Non-Maximum Suppression to remove overlapping boxes."""
    if len(detections) == 0:
        return []
    
    # Sort detections by confidence (descending) - keep only the highest confidence
    detections = sorted(detections, key=lambda x: x['confidence'], reverse=True)
    
    keep = []
    suppressed_count = 0
    
    for i, det in enumerate(detections):
        suppress = False
        for kept_det in keep:
            iou = calculate_iou(det['bbox'], kept_det['bbox'])
            if iou > iou_threshold:
                suppress = True
                suppressed_count += 1
                break
        
        if not suppress:
            keep.append(det)
    
    print(f"NMS: Kept {len(keep)} detections, suppressed {suppressed_count} overlapping boxes")
    return keep

def visualize_detections(image, output, input_size, orig_size, conf_threshold=0.10):
    """Visualize detections by drawing bounding boxes on the image."""
    # Handle different output formats
    model_h, model_w = input_size  # Model input size (448, 448)
    orig_w, orig_h = orig_size     # Original image size
    
    output = output[0]  # Remove batch dimension
    output = output.T   # Transpose to (detections, features)
    
    num_detections, num_features = output.shape
    print(f"Processing {num_detections} detections with {num_features} features each")
    print(f"Model input size: {model_w}x{model_h}, Original size: {orig_w}x{orig_h}")
    
    detections_drawn = 0
    valid_detections = []
    
    # Debug: Check first few detections
    print(f"First detection sample: {output[0]}")
    if num_features == 12:
        # For 12 features, try different confidence positions
        conf_pos4 = np.max(output[:100, 4])
        conf_pos5 = np.max(output[:100, 5]) 
        conf_last = np.max(output[:100, -1])
        print(f"Max confidence at pos 4: {conf_pos4}")
        print(f"Max confidence at pos 5: {conf_pos5}")
        print(f"Max confidence at last pos: {conf_last}")
        print(f"Detection confidence range (last): min={np.min(output[:, -1])}, max={np.max(output[:, -1])}")
    else:
        print(f"Max confidence in first 100 detections: {np.max(output[:100, -1])}")  # Last column is confidence
        print(f"Detection confidence range: min={np.min(output[:, -1])}, max={np.max(output[:, -1])}")
    
    # MAXIMUM ACCURACY MODE: Process ALL detections for individual tests too
    print(f"🐌 SLOW & ACCURATE MODE: Processing ALL {num_detections} detections (no sampling)")
    
    # Show confidence distribution for debugging
    if num_features == 12:
        confidences = output[:, -1]
    else:
        confidences = output[:, -1]
    
    conf_above_005 = np.sum(confidences > 0.005) 
    conf_above_01 = np.sum(confidences > 0.01)
    conf_above_05 = np.sum(confidences > 0.05)
    print(f"Confidence distribution: >0.005: {conf_above_005}, >0.01: {conf_above_01}, >0.05: {conf_above_05}")
    
    for i in range(num_detections):
        detection = output[i]
        
        if num_features == 5:  # Format: [x1, y1, x2, y2, conf]
            x1, y1, x2, y2, conf = detection
            class_id = 0  # No class info
            class_conf = conf
        elif num_features >= 6:  # Format: [x1, y1, x2, y2, conf, class0, class1, ...]
            x1, y1, x2, y2 = detection[:4]
            if num_features == 12:
                # Try confidence at different positions for 12-feature format
                conf = detection[-1]  # Try last position first
                class_probs = detection[4:-1]  # Everything between coords and conf
            else:
                conf = detection[4]  # Standard position 4
                class_probs = detection[5:]
            class_id = np.argmax(class_probs)
            class_conf = conf  # Use raw confidence since we're not sure about format
        else:
            continue
        
        # Debug: Print high confidence detections
        if conf > 0.05:  # Lower threshold for debugging  
            print(f"Detection {i}: conf={conf:.4f}, bbox=({x1:.2f},{y1:.2f},{x2:.2f},{y2:.2f})")
        
        if conf > conf_threshold:
            # Pre-validate aspect ratio before coordinate conversion
            temp_width = x2 if x2 > x1 else x1  # Handle different coordinate formats
            temp_height = y2 if y2 > y1 else y1
            if temp_width > 0 and temp_height > 0:
                temp_aspect = temp_width / temp_height
                
                # Apply basic aspect ratio filter before expensive coordinate conversion
                if temp_aspect > 15 or temp_aspect < 0.05:  # Extremely unrealistic shapes
                    print(f"PRE-REJECTED: Extreme aspect ratio {temp_aspect:.3f}")
                    continue
            # Convert coordinates assuming format: [x_center, y_center, width, height]
            # Scale from model input size (448x448) to original image
            x_center = x1 * orig_w / model_w
            y_center = y1 * orig_h / model_h  
            width = x2 * orig_w / model_w
            height = y2 * orig_h / model_h
            
            # Convert to x1, y1, x2, y2
            x1_final = int(x_center - width/2)
            y1_final = int(y_center - height/2)
            x2_final = int(x_center + width/2)
            y2_final = int(y_center + height/2)
            
            # Ensure coordinates are within bounds
            x1_final = max(0, min(x1_final, orig_w))
            y1_final = max(0, min(y1_final, orig_h))
            x2_final = max(0, min(x2_final, orig_w))
            y2_final = max(0, min(y2_final, orig_h))
            
            # Final aspect ratio validation based on model type
            final_width = x2_final - x1_final
            final_height = y2_final - y1_final
            if final_width > 0 and final_height > 0:
                final_aspect = final_width / final_height
                
                # Apply model-specific aspect ratio validation
                if num_features == 5:
                    # 5-feature models are typically oxygen_tank
                    label = "Oxygen Tank"
                    min_aspect, max_aspect = 0.3, 3.0  # Oxygen tank range
                    if final_aspect < min_aspect or final_aspect > max_aspect:
                        print(f"FINAL-REJECTED Oxygen Tank: aspect ratio {final_aspect:.3f} outside range {min_aspect}-{max_aspect}")
                        continue
                else:
                    # For 12-feature models, could be fire_stuff or space_suit  
                    label = "Detection"
                    min_aspect, max_aspect = 0.2, 5.0  # Generic range for unknown model
                    if final_aspect < min_aspect or final_aspect > max_aspect:
                        print(f"FINAL-REJECTED Detection: aspect ratio {final_aspect:.3f} outside range {min_aspect}-{max_aspect}")
                        continue
                
                detection = {
                    'bbox': (x1_final, y1_final, x2_final, y2_final),
                    'confidence': conf,
                    'label': label,
                    'aspect_ratio': final_aspect  # Store for debugging
                }
                valid_detections.append(detection)
            else:
                print(f"REJECTED: Invalid box dimensions ({final_width}x{final_height})")
                continue
    
    # Apply AGGRESSIVE Non-Maximum Suppression to remove overlapping boxes
    final_detections = non_max_suppression(valid_detections, iou_threshold=0.05)
    print(f"Before NMS: {len(valid_detections)} detections, After NMS: {len(final_detections)} detections")
    
    # Draw final detections
    for detection in final_detections:
        x1, y1, x2, y2 = detection['bbox']
        conf = detection['confidence']
        label_text = detection['label']
        
        print(f"Final detection: conf={conf:.4f}, bbox=({x1},{y1},{x2},{y2})")
        
        # Draw box with black color
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 0), 3)
        label = f"{label_text}: {conf:.2f}"
        cv2.putText(image, label, (x1, max(y1-10, 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)
        detections_drawn += 1
    
    print(f"Drew {detections_drawn} detections")
    
    # Draw a test box to ensure drawing works
    cv2.rectangle(image, (50, 50), (150, 150), (255, 0, 0), 3)  # Blue test box
    cv2.putText(image, "TEST BOX", (50, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
    
    # Save the result
    output_path = "./test-images/fire_extinguisher_detected.png"
    cv2.imwrite(output_path, image)
    print(f"Detection visualization saved to: {output_path}")
    
    # Also show with PIL for verification
    pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    pil_image.show()

def load_and_check_onnx_model(model_path):
    try:
        model = onnx.load(model_path)
        # Use the graph attribute for verification
        onnx.checker.check_graph(model.graph)
        print(f"Model '{model_path}' loaded and graph verified successfully.")
        return model
    except Exception as e:
        print(f"Failed to load or verify the model graph: {e}")
        return None

def test_fire_stuff_model():
    """Test the fire_stuff.onnx model with the fire_extinguisher.png image."""
    model_path = "./fire_stuff.onnx"
    image_path = "./test-images/exting.png"
    
    if not os.path.exists(model_path):
        print(f"Model file {model_path} not found.")
        return
    
    if not os.path.exists(image_path):
        print(f"Image file {image_path} not found.")
        return
    
    try:
        # Load the ONNX model
        session = ort.InferenceSession(model_path)
        print(f"Loaded model: {model_path}")
        
        # Get input details
        input_name = session.get_inputs()[0].name
        input_shape = session.get_inputs()[0].shape
        print(f"Input name: {input_name}, Shape: {input_shape}")
        
        # Load and preprocess image
        # Load image for processing
        image = Image.open(image_path).convert('RGB')
        original_image = cv2.imread(image_path)  # For drawing
        orig_h, orig_w = original_image.shape[:2]  # Original dimensions
        
        # Resize to model's expected input size
        target_size = (input_shape[2], input_shape[3])
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        image_array = np.array(image).astype(np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        image_array = (image_array - mean) / std
        
        # Transpose to CHW format
        image_array = np.transpose(image_array, (2, 0, 1))
        
        # Add batch dimension
        input_data = np.expand_dims(image_array, axis=0)
        
        print(f"Input data shape: {input_data.shape}")
        
        # Run inference
        outputs = session.run(None, {input_name: input_data})
        
        print("Inference successful!")
        print(f"Number of outputs: {len(outputs)}")
        for i, output in enumerate(outputs):
            print(f"Output {i} shape: {output.shape}")
            print(f"Output {i} sample values: {output.flatten()[:10]}")
        
        # Visualize detections
        visualize_detections(original_image, outputs[0], target_size, (orig_w, orig_h))
        
        return outputs
    
    except Exception as e:
        print(f"Error testing model: {e}")
        return None

def test_oxygen_tank_model():
    """Test the oxygen_tank.onnx model with the fire_extinguisher.png image."""
    model_path = "./oxygen_tank.onnx"
    image_path = "./test-images/image.copy.png"
    
    if not os.path.exists(model_path):
        print(f"Model file {model_path} not found.")
        return
    
    if not os.path.exists(image_path):
        print(f"Image file {image_path} not found.")
        return
    
    try:
        # Load the ONNX model
        session = ort.InferenceSession(model_path)
        print(f"Loaded model: {model_path}")
        
        # Get input details
        input_name = session.get_inputs()[0].name
        input_shape = session.get_inputs()[0].shape
        print(f"Input name: {input_name}, Shape: {input_shape}")
        
        # Load image for processing
        image = Image.open(image_path).convert('RGB')
        original_image = cv2.imread(image_path)  # For drawing
        orig_h, orig_w = original_image.shape[:2]  # Original dimensions
        
        # Resize to model's expected input size
        target_size = (input_shape[2], input_shape[3])
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        image_array = np.array(image).astype(np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        image_array = (image_array - mean) / std
        
        # Transpose to CHW format
        image_array = np.transpose(image_array, (2, 0, 1))
        
        # Add batch dimension
        input_data = np.expand_dims(image_array, axis=0)
        
        print(f"Input data shape: {input_data.shape}")
        
        # Run inference
        outputs = session.run(None, {input_name: input_data})
        
        print("Inference successful!")
        print(f"Number of outputs: {len(outputs)}")
        for i, output in enumerate(outputs):
            print(f"Output {i} shape: {output.shape}")
            print(f"Output {i} sample values: {output.flatten()[:10]}")
        
        # Visualize detections
        visualize_detections(original_image, outputs[0], target_size, (orig_w, orig_h))
        
        return outputs
    
    except Exception as e:
        print(f"Error testing model: {e}")
        return None

def test_space_suit_model():
    """Test the space_suit.onnx model with a test image."""
    model_path = "./space_suit.onnx"
    image_path = "./test-images/suit-test.png"  # You can change this to a space suit image if available
    
    if not os.path.exists(model_path):
        print(f"Model file {model_path} not found.")
        return
    
    if not os.path.exists(image_path):
        print(f"Image file {image_path} not found.")
        return
    
    try:
        # Load the ONNX model
        session = ort.InferenceSession(model_path)
        print(f"Loaded model: {model_path}")
        
        # Get input details
        input_name = session.get_inputs()[0].name
        input_shape = session.get_inputs()[0].shape
        print(f"Input name: {input_name}, Shape: {input_shape}")
        
        # Load image for processing
        image = Image.open(image_path).convert('RGB')
        original_image = cv2.imread(image_path)  # For drawing
        orig_h, orig_w = original_image.shape[:2]  # Original dimensions
        
        # Resize to model's expected input size
        target_size = (input_shape[2], input_shape[3])
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        image_array = np.array(image).astype(np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        image_array = (image_array - mean) / std
        
        # Transpose to CHW format
        image_array = np.transpose(image_array, (2, 0, 1))
        
        # Add batch dimension
        input_data = np.expand_dims(image_array, axis=0)
        
        print(f"Input data shape: {input_data.shape}")
        
        # Run inference
        outputs = session.run(None, {input_name: input_data})
        
        print("Inference successful!")
        print(f"Number of outputs: {len(outputs)}")
        for i, output in enumerate(outputs):
            print(f"Output {i} shape: {output.shape}")
            print(f"Output {i} sample values: {output.flatten()[:10]}")
        
        # Visualize detections
        visualize_detections(original_image, outputs[0], target_size, (orig_w, orig_h))
        
        return outputs
    
    except Exception as e:
        print(f"Error testing model: {e}")
        return None

def run_ensemble_inference(image_path, conf_threshold=0.10, iou_threshold=0.05):
    """Run ensemble inference on all models for a single image."""
    models = {
        'fire_stuff': './fire_stuff.onnx',
        'oxygen_tank': './oxygen_tank.onnx', 
        'space_suit': './space_suit.onnx',
        
    }
    
    if not os.path.exists(image_path):
        print(f"Image file {image_path} not found.")
        return None
    
    # Load original image
    original_image = cv2.imread(image_path)
    orig_h, orig_w = original_image.shape[:2]
    print(f"Processing image: {image_path} (size: {orig_w}x{orig_h})")
    
    all_detections = []
    
    for model_name, model_path in models.items():
        if not os.path.exists(model_path):
            print(f"Model {model_name} not found at {model_path}, skipping...")
            continue
            
        try:
            print(f"\n--- Testing {model_name} ---")
            
            # Load model
            session = ort.InferenceSession(model_path)
            input_name = session.get_inputs()[0].name
            input_shape = session.get_inputs()[0].shape
            
            # Preprocess image
            image = Image.open(image_path).convert('RGB')
            target_size = (input_shape[2], input_shape[3])
            image = image.resize(target_size)
            
            image_array = np.array(image).astype(np.float32) / 255.0
            mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
            std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
            image_array = (image_array - mean) / std
            image_array = np.transpose(image_array, (2, 0, 1))
            input_data = np.expand_dims(image_array, axis=0)
            
            # Run inference
            outputs = session.run(None, {input_name: input_data})
            output = outputs[0][0].T  # Remove batch dim and transpose
            
            num_detections, num_features = output.shape
            print(f"Output shape: {outputs[0].shape}, Features: {num_features}")
            
            # Debug: Show confidence distribution for oxygen_tank
            if model_name == 'oxygen_tank':
                print(f"DEBUG - Oxygen Tank confidence analysis:")
                confidences = []
                if num_features == 5:
                    confidences = output[:, 4]  # Confidence at position 4
                elif num_features >= 6:
                    if num_features == 12:
                        confidences = output[:, -1]  # Last position
                    else:
                        confidences = output[:, 4]  # Standard position 4
                
                print(f"Top 10 confidence values: {sorted(confidences, reverse=True)[:10]}")
                print(f"Min: {np.min(confidences):.6f}, Max: {np.max(confidences):.6f}")
                print(f"Mean: {np.mean(confidences):.6f}, Std: {np.std(confidences):.6f}")
                high_conf_count = np.sum(confidences > 0.01)  # Very low threshold
                print(f"Detections above 0.01 confidence: {high_conf_count}")
            
            # ULTRA-THOROUGH ACCURACY MODE: Multi-pass processing for precision
            # Pass 1: Analyze all detections thoroughly
            print(f"� ULTRA-THOROUGH MODE: Multi-pass analysis of ALL {num_detections} detections...")
            
            # Get confidence values for comprehensive analysis
            if num_features == 5:
                confidences = output[:, 4]
            elif num_features == 12:
                confidences = output[:, -1]
            else:
                confidences = output[:, 4]
            
            # Detailed confidence distribution analysis
            conf_above_001 = np.sum(confidences > 0.001)
            conf_above_005 = np.sum(confidences > 0.005)
            conf_above_01 = np.sum(confidences > 0.01)
            conf_above_03 = np.sum(confidences > 0.03)
            conf_above_05 = np.sum(confidences > 0.05)
            conf_above_10 = np.sum(confidences > 0.10)
            print(f"Detailed confidence analysis:")
            print(f"  >0.1%: {conf_above_001}, >0.5%: {conf_above_005}, >1%: {conf_above_01}")
            print(f"  >3%: {conf_above_03}, >5%: {conf_above_05}, >10%: {conf_above_10}")
            
            # Pass 2: Process every detection with validation
            print(f"Pass 1: Initial screening of all {num_detections} detections...")
            candidate_detections = []
            
            for i in range(num_detections):
                detection = output[i]
                
                if num_features == 5:  # [x_center, y_center, width, height, conf]
                    x1, y1, x2, y2, conf = detection
                    class_name = model_name.replace('_', ' ').title()
                elif num_features >= 6:  # [x_center, y_center, width, height, conf, classes...]
                    x1, y1, x2, y2 = detection[:4]
                    if num_features == 12:
                        conf = detection[-1]  # Last position for 12-feature
                    else:
                        conf = detection[4]   # Standard position
                    class_name = model_name.replace('_', ' ').title()
                else:
                    continue
                
                # ULTRA-HIGH PRECISION thresholds - 10%+ confidence required for all models
                if model_name == 'oxygen_tank':
                    effective_threshold = 0.10   # 10% minimum for oxygen tank
                elif model_name == 'fire_stuff':
                    effective_threshold = 0.10   # 10% minimum for fire detection  
                elif model_name == 'space_suit':
                    effective_threshold = 0.10   # 10% minimum for space suit
                else:
                    effective_threshold = 0.10   # 10% minimum for all models
                
                # First pass: collect candidates above lower threshold for analysis
                intermediate_threshold = effective_threshold * 0.3  # 30% of final threshold for analysis
                if conf > intermediate_threshold:
                    candidate_detections.append((i, detection, conf))
            
            print(f"Pass 1 complete: {len(candidate_detections)} candidates for detailed analysis")
            
            # Pass 2: Detailed validation of candidates
            print(f"Pass 2: Detailed validation of {len(candidate_detections)} candidates...")
            validated_detections = []
            
            for idx, (detection_idx, detection, conf) in enumerate(candidate_detections):
                if num_features == 5:
                    x1, y1, x2, y2, conf = detection
                    class_name = model_name.replace('_', ' ').title()
                elif num_features >= 6:
                    x1, y1, x2, y2 = detection[:4]
                    if num_features == 12:
                        conf = detection[-1]
                    else:
                        conf = detection[4]
                    class_name = model_name.replace('_', ' ').title()
                else:
                    continue
                
                # Apply final strict threshold
                if conf > effective_threshold:
                    # Convert coordinates with validation
                    model_h, model_w = target_size
                    x_center = x1 * orig_w / model_w
                    y_center = y1 * orig_h / model_h
                    width = x2 * orig_w / model_w
                    height = y2 * orig_h / model_h
                    
                    # Validate reasonable box dimensions with model-specific minimum sizes
                    if model_name == 'fire_stuff':
                        min_width, min_height = 40, 60  # Fire extinguishers should be substantial objects
                        if width < min_width or height < min_height:
                            print(f"REJECTED {model_name}: Too small {width:.0f}x{height:.0f} (min {min_width}x{min_height})")
                            continue
                    elif model_name == 'oxygen_tank':
                        min_width, min_height = 30, 50  # Oxygen tanks should be visible objects
                        if width < min_width or height < min_height:
                            print(f"REJECTED {model_name}: Too small {width:.0f}x{height:.0f} (min {min_width}x{min_height})")
                            continue
                    elif model_name == 'space_suit':
                        min_width, min_height = 50, 80  # Space suits are large human-sized objects
                        if width < min_width or height < min_height:
                            print(f"REJECTED {model_name}: Too small {width:.0f}x{height:.0f} (min {min_width}x{min_height})")
                            continue
                    else:
                        # Generic minimum size
                        if width < 20 or height < 20:
                            print(f"REJECTED {model_name}: Too small {width:.0f}x{height:.0f}")
                            continue
                    
                    # Skip huge boxes that cover most of the image
                    if width > orig_w * 0.8 or height > orig_h * 0.8:
                        print(f"REJECTED {model_name}: Too large {width:.0f}x{height:.0f} (image: {orig_w}x{orig_h})")
                        continue
                    
                    x1_final = int(x_center - width/2)
                    y1_final = int(y_center - height/2)
                    x2_final = int(x_center + width/2)
                    y2_final = int(y_center + height/2)
                    
                    # Validate box is within reasonable bounds
                    if x1_final < 0 or y1_final < 0 or x2_final >= orig_w or y2_final >= orig_h:
                        # Clip to image bounds but reject if clipping is too severe
                        clipped_x1 = max(0, x1_final)
                        clipped_y1 = max(0, y1_final)
                        clipped_x2 = min(orig_w-1, x2_final)
                        clipped_y2 = min(orig_h-1, y2_final)
                        
                        # If clipping removes more than 30% of box area, reject
                        original_area = (x2_final - x1_final) * (y2_final - y1_final)
                        clipped_area = (clipped_x2 - clipped_x1) * (clipped_y2 - clipped_y1)
                        if clipped_area < 0.7 * original_area:
                            continue
                        
                        x1_final, y1_final, x2_final, y2_final = clipped_x1, clipped_y1, clipped_x2, clipped_y2
                    
                    # Area-based validation - objects should have reasonable total area
                    area = width * height
                    image_area = orig_w * orig_h
                    area_ratio = area / image_area
                    
                    if model_name == 'fire_stuff':
                        # Fire extinguishers should occupy reasonable portion of image
                        min_area_ratio, max_area_ratio = 0.005, 0.3  # 0.5% to 30% of image
                        if area_ratio < min_area_ratio or area_ratio > max_area_ratio:
                            print(f"REJECTED {model_name}: Invalid area ratio {area_ratio:.4f} (expected {min_area_ratio}-{max_area_ratio})")
                            continue
                    elif model_name == 'oxygen_tank':
                        min_area_ratio, max_area_ratio = 0.01, 0.4  # 1% to 40% of image
                        if area_ratio < min_area_ratio or area_ratio > max_area_ratio:
                            print(f"REJECTED {model_name}: Invalid area ratio {area_ratio:.4f} (expected {min_area_ratio}-{max_area_ratio})")
                            continue
                    elif model_name == 'space_suit':
                        min_area_ratio, max_area_ratio = 0.02, 0.5  # 2% to 50% of image
                        if area_ratio < min_area_ratio or area_ratio > max_area_ratio:
                            print(f"REJECTED {model_name}: Invalid area ratio {area_ratio:.4f} (expected {min_area_ratio}-{max_area_ratio})")
                            continue
                    
                    # Model-specific aspect ratio validation based on expected object dimensions
                    aspect_ratio = width / height
                    
                    # Define realistic aspect ratio ranges for each object type
                    if model_name == 'fire_stuff':
                        # Fire extinguishers: typically tall cylinders (height > width)
                        # Tightened range: must be clearly taller than wide
                        min_aspect, max_aspect = 0.3, 0.75  # More restrictive upper bound
                        if aspect_ratio < min_aspect or aspect_ratio > max_aspect:
                            print(f"REJECTED {model_name}: Invalid aspect ratio {aspect_ratio:.3f} (expected {min_aspect}-{max_aspect})")
                            continue
                    
                    elif model_name == 'oxygen_tank':
                        # Oxygen tanks: cylindrical, can be tall or wide depending on orientation
                        # Expected range: 0.4 to 2.5 (more flexible for different orientations)
                        min_aspect, max_aspect = 0.3, 3.0
                        if aspect_ratio < min_aspect or aspect_ratio > max_aspect:
                            print(f"REJECTED {model_name}: Invalid aspect ratio {aspect_ratio:.3f} (expected {min_aspect}-{max_aspect})")
                            continue
                    
                    elif model_name == 'space_suit':
                        # Space suits: roughly human-shaped, tall and narrow
                        # Expected range: 0.4 to 0.8 (width/height ratio)
                        min_aspect, max_aspect = 0.3, 1.0
                        if aspect_ratio < min_aspect or aspect_ratio > max_aspect:
                            print(f"REJECTED {model_name}: Invalid aspect ratio {aspect_ratio:.3f} (expected {min_aspect}-{max_aspect})")
                            continue
                    
                    elif model_name == 'astronaut_bunk':
                        # Astronaut bunks: rectangular beds, wider than tall
                        # Expected range: 1.2 to 3.0 (width/height ratio)
                        min_aspect, max_aspect = 1.0, 4.0
                        if aspect_ratio < min_aspect or aspect_ratio > max_aspect:
                            print(f"REJECTED {model_name}: Invalid aspect ratio {aspect_ratio:.3f} (expected {min_aspect}-{max_aspect})")
                            continue
                    
                    elif model_name == 'oxygen_mask':
                        # Oxygen masks: small, roughly square to slightly wide
                        # Expected range: 0.8 to 1.5 (width/height ratio)
                        min_aspect, max_aspect = 0.6, 2.0
                        if aspect_ratio < min_aspect or aspect_ratio > max_aspect:
                            print(f"REJECTED {model_name}: Invalid aspect ratio {aspect_ratio:.3f} (expected {min_aspect}-{max_aspect})")
                            continue
                    
                    else:
                        # Default: skip extremely elongated boxes
                        if aspect_ratio > 10 or aspect_ratio < 0.1:
                            print(f"REJECTED {model_name}: Extreme aspect ratio {aspect_ratio:.3f}")
                            continue
                    
                    detection_data = {
                        'bbox': (x1_final, y1_final, x2_final, y2_final),
                        'confidence': conf,
                        'label': class_name,
                        'model': model_name
                    }
                    validated_detections.append(detection_data)
                    
                    # Debug: Show high-confidence detections
                    if conf > effective_threshold * 1.5:  # Show only very high confidence
                        print(f"HIGH-CONF {model_name.upper()}: conf={conf:.4f}, bbox=({x1_final},{y1_final},{x2_final},{y2_final})")
            
            all_detections.extend(validated_detections)
            print(f"Pass 2 complete: {len(validated_detections)} validated detections from {model_name}")
            
            print(f"Found {len([d for d in all_detections if d['model'] == model_name])} detections from {model_name}")
            
        except Exception as e:
            print(f"Error with {model_name}: {e}")
            continue
    
    # Apply NMS separately for each model type to avoid suppressing different objects
    print(f"\n--- Ensemble Results ---")
    print(f"Total detections before NMS: {len(all_detections)}")
    
    final_detections = []
    
    # Group detections by model
    model_groups = {}
    for det in all_detections:
        model = det['model']
        if model not in model_groups:
            model_groups[model] = []
        model_groups[model].append(det)
    
    # Apply NMS within each model group
    for model_name, model_detections in model_groups.items():
        print(f"Applying NMS to {len(model_detections)} {model_name} detections...")
        filtered_detections = non_max_suppression(model_detections, iou_threshold=iou_threshold)
        final_detections.extend(filtered_detections)
        print(f"✓ {model_name}: {len(filtered_detections)} detections after NMS")
    
    print(f"Final detections after model-wise NMS: {len(final_detections)}")
    
    # Draw results
    result_image = original_image.copy()
    colors = {
        'fire_stuff': (0, 0, 255),      # Red
        'oxygen_tank': (0, 255, 0),     # Green  
        'space_suit': (255, 0, 0),      # Blue
        
    }
    
    for detection in final_detections:
        x1, y1, x2, y2 = detection['bbox']
        conf = detection['confidence']
        label = detection['label']
        model = detection['model']
        
        color = colors.get(model, (0, 0, 0))
        cv2.rectangle(result_image, (x1, y1), (x2, y2), color, 3)
        label_text = f"{label}: {conf:.2f}"
        cv2.putText(result_image, label_text, (x1, max(y1-10, 10)), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        print(f"✓ {label}: {conf:.3f} from {model}")
    
    # Save result
    output_path = "./test-images/ensemble_result.png"
    cv2.imwrite(output_path, result_image)
    print(f"\nEnsemble result saved to: {output_path}")
    
    # Show result
    pil_image = Image.fromarray(cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB))
    pil_image.show()
    
    return final_detections

def test_fire_stuff():
    """Quick test for fire_stuff model"""
    image_path = "./test-images/exting.png"
    if os.path.exists(image_path):
        visualize_detections("./fire_stuff.onnx", image_path, "Fire Stuff")
    else:
        print("Fire extinguisher test image not found")

def test_oxygen_tank():
    """Quick test for oxygen_tank model"""  
    image_path = "./test-images/image.png"
    if os.path.exists(image_path):
        visualize_detections("./oxygen_tank.onnx", image_path, "Oxygen Tank")
    else:
        print("Oxygen tank test image not found")

def test_space_suit():
    """Quick test for space_suit model"""
    image_path = "./test-images/suit-test.png" 
    if os.path.exists(image_path):
        visualize_detections("./space_suit.onnx", image_path, "Space Suit")
    else:
        print("Space suit test image not found")

if __name__ == "__main__":
    print("🚀 Space Equipment Detection Ensemble 🚀")
    print("=========================================")
    print("1. Test individual models")
    print("2. Run ensemble inference on image")
    print("3. Load model specs only")
    
    choice = input("\nChoose option (1/2/3): ").strip()
    
    if choice == "1":
        print("\n--- Individual Model Testing ---")
        test_fire_stuff()
        test_oxygen_tank() 
        test_space_suit()
    elif choice == "2":
        print("\n--- Ensemble Inference ---")
        image_path = input("Enter image path (or press Enter for menu): ").strip()
        
        if not image_path:
            # Show available test images
            test_images = ['./test-images/image.png', './test-images/suit-test.png', 
                          './test-images/fire_extinguisher_detected.png', './test-images/exting.png']
            print("\nAvailable test images:")
            for i, img in enumerate(test_images):
                if os.path.exists(img):
                    print(f"{i+1}. {os.path.basename(img)}")
            
            img_choice = input("Select image (1-4) or enter custom path: ").strip()
            if img_choice.isdigit() and 1 <= int(img_choice) <= 4:
                image_path = test_images[int(img_choice)-1]
            else:
                image_path = img_choice
        
        if os.path.exists(image_path):
            print(f"\n🔍 Running ensemble inference on: {os.path.basename(image_path)}")
            detections = run_ensemble_inference(image_path)
            print(f"\n✅ Ensemble complete! Found {len(detections)} final detections")
        else:
            print(f"❌ Image not found: {image_path}")
    elif choice == "3":
        print("\n--- Loading Model Specifications ---")
        load_and_check_onnx_model("./fire_stuff.onnx")
        # load_and_check_onnx_model("./astronaut_bunk.onnx") 
        # load_and_check_onnx_model("./oxygen_mask.onnx")
        load_and_check_onnx_model("./oxygen_tank.onnx")
        load_and_check_onnx_model("./space_suit.onnx")
    else:
        print("❌ Invalid choice. Running individual tests...")
        test_fire_stuff()
        test_oxygen_tank()
        test_space_suit()