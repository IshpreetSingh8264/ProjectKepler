# ONNX Model Specifications

## oxygen_tank.onnx
- **Input Shape**: `[1, 3, 448, 448]` (batch, channels, height, width)
- **Input Name**: `images`
- **Output Shape**: `(1, 5, 4116)` (batch, features, detections)
- **Output Format**: `[x_center, y_center, width, height, confidence]`
- **Coordinate System**: Pixel coordinates in model input space (448x448)
- **Confidence Range**: 0.005 - 0.223 (max ~22%)
- **Working**: ✅ Successfully detects oxygen tanks
- **Test Image**: `image.copy.png`
- **Preprocessing**: 
  - Resize to 448x448
  - Normalize with ImageNet stats: mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
  - CHW format

## fire_stuff.onnx
- **Input Shape**: `[1, 3, 448, 448]` (batch, channels, height, width)
- **Input Name**: `images`
- **Output Shape**: `(1, 12, 4116)` (batch, features, detections)
- **Output Format**: `[x_center, y_center, width, height, ?, ?, ?, ?, ?, ?, ?, confidence]`
- **Coordinate System**: Pixel coordinates in model input space (448x448)
- **Confidence Position**: Last column (index 11)
- **Confidence Range**: 0.0 - 0.884 (max ~88.4%)
- **Working**: ✅ Successfully detects fire extinguishers with high confidence
- **Test Image**: `image.png`
- **Preprocessing**: Same as oxygen_tank.onnx
- **Recommended Threshold**: 0.5 (50%) to avoid multiple overlapping boxes

## Testing Status
- **oxygen_tank.onnx**: ✅ Working with proper bounding box detection
- **fire_stuff.onnx**: ✅ Working with high confidence fire extinguisher detection
- **astronaut_bunk.onnx**: 🔄 Not tested yet
- **oxygen_mask.onnx**: 🔄 Not tested yet  
- **space_suit.onnx**: 🔄 Not tested yet

## Summary
Both models are now working correctly:
- **oxygen_tank.onnx**: 5-feature format, confidence at position 4
- **fire_stuff.onnx**: 12-feature format, confidence at position 11 (last)
- Both use [x_center, y_center, width, height] coordinate format
- Both require coordinate scaling from 448x448 to original image size